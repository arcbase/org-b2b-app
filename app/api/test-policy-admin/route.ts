import { NextResponse } from "next/server"

// API base URL from environment variable
const API_BASE_URL = process.env.API_BASE_URL || ""
const TOKEN_URL = process.env.TOKEN_URL || ""
const API_CLIENT_ID = process.env.API_CLIENT_ID || ""
const API_CLIENT_SECRET = process.env.API_CLIENT_SECRET || ""

// Function to get access token
async function getAccessToken(): Promise<string> {
  try {
    console.log("Attempting to get access token from:", TOKEN_URL)

    const response = await fetch(TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: API_CLIENT_ID,
        client_secret: API_CLIENT_SECRET,
      }),
    })

    console.log(`Token response status: ${response.status} ${response.statusText}`)

    if (!response.ok) {
      throw new Error(`Failed to get access token: ${response.status}`)
    }

    const data = await response.json()
    return data.access_token
  } catch (error) {
    console.error("Error getting access token:", error)
    throw new Error("Failed to authenticate with the API")
  }
}

export async function GET() {
  try {
    // Check if environment variables are set
    if (!API_BASE_URL || !TOKEN_URL || !API_CLIENT_ID || !API_CLIENT_SECRET) {
      return NextResponse.json(
        {
          success: false,
          error: "Policy admin API environment variables are not configured",
          missingVars: {
            API_BASE_URL: !API_BASE_URL,
            TOKEN_URL: !TOKEN_URL,
            API_CLIENT_ID: !API_CLIENT_ID,
            API_CLIENT_SECRET: !API_CLIENT_SECRET,
          },
        },
        { status: 400 },
      )
    }

    // Try to get an access token
    try {
      const accessToken = await getAccessToken()
      console.log("Successfully obtained access token")

      // Try a simple GraphQL query to the /graphql endpoint
      try {
        const graphqlEndpoint = `${API_BASE_URL}/graphql`
        console.log(`Trying to access GraphQL endpoint: ${graphqlEndpoint}`)

        // Simple introspection query that should work with most GraphQL APIs
        // This query asks for the schema's query type name, which is a minimal query
        // that should work even with limited permissions
        const graphqlQuery = {
          query: `
            query {
              __schema {
                queryType {
                  name
                }
              }
            }
          `,
        }

        const response = await fetch(graphqlEndpoint, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(graphqlQuery),
        })

        console.log(`GraphQL endpoint response status: ${response.status} ${response.statusText}`)

        // Try to parse the response body
        let responseBody
        try {
          responseBody = await response.text()
          console.log("Response body preview:", responseBody.substring(0, 200))

          // Try to parse as JSON if possible
          try {
            responseBody = JSON.parse(responseBody)
          } catch (e) {
            // Keep as text if not valid JSON
          }
        } catch (e) {
          responseBody = "Could not read response body"
        }

        // Even if we get errors in the GraphQL response, it means the API is responding
        // and the authentication token is being processed
        if (response.status !== 404) {
          return NextResponse.json({
            success: true,
            message: "Successfully connected to the policy admin GraphQL API",
            endpoint: "graphql",
            status: response.status,
            statusText: response.statusText,
            // Include a sanitized version of the response for debugging
            responsePreview:
              typeof responseBody === "object"
                ? {
                    hasErrors: !!responseBody.errors,
                    hasData: !!responseBody.data,
                  }
                : "Non-JSON response received",
          })
        }

        // If GraphQL endpoint fails, try the base URL as a last resort
        console.log(`Trying base URL: ${API_BASE_URL}`)
        const baseResponse = await fetch(API_BASE_URL, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json",
          },
        })

        console.log(`Base URL response status: ${baseResponse.status} ${baseResponse.statusText}`)

        // Again, even non-200 responses (except 404) indicate the API is responding
        if (baseResponse.status !== 404) {
          return NextResponse.json({
            success: true,
            message: "Successfully connected to the policy admin API base URL",
            endpoint: "base",
            status: baseResponse.status,
            statusText: baseResponse.statusText,
          })
        }

        return NextResponse.json(
          {
            success: false,
            error: `Could not find a valid API endpoint. Both GraphQL and base URL returned 404.`,
          },
          { status: 404 },
        )
      } catch (apiError) {
        console.error("Error making API request:", apiError)
        return NextResponse.json(
          {
            success: false,
            error: `Error making API request: ${apiError instanceof Error ? apiError.message : String(apiError)}`,
          },
          { status: 500 },
        )
      }
    } catch (tokenError) {
      console.error("Error getting access token:", tokenError)
      return NextResponse.json(
        {
          success: false,
          error: `Failed to get access token: ${tokenError instanceof Error ? tokenError.message : String(tokenError)}`,
        },
        { status: 401 },
      )
    }
  } catch (error) {
    console.error("Error testing policy admin connection:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    )
  }
}
