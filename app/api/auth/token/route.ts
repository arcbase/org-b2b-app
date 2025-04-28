import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    // Get the token URL and credentials from environment variables
    const tokenUrl = process.env.TOKEN_URL
    const clientId = process.env.API_CLIENT_ID
    const clientSecret = process.env.API_CLIENT_SECRET

    // Check if all required environment variables are set
    if (!tokenUrl || !clientId || !clientSecret) {
      console.error("Missing required environment variables for authentication", {
        TOKEN_URL: !tokenUrl,
        API_CLIENT_ID: !clientId,
        API_CLIENT_SECRET: !clientSecret,
      })

      return NextResponse.json(
        {
          error: "Missing required environment variables for authentication",
          missingVars: {
            TOKEN_URL: !tokenUrl,
            API_CLIENT_ID: !clientId,
            API_CLIENT_SECRET: !clientSecret,
          },
        },
        { status: 400 },
      )
    }

    // Get the request body
    const body = await request.formData()

    console.log("Requesting token from Policy Admin API...")

    // Forward the request to the token endpoint
    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret,
      }),
    })

    // Get the response data
    const data = await response.json()

    // Check if the response is successful
    if (!response.ok) {
      console.error("Failed to get access token from provider", {
        status: response.status,
        statusText: response.statusText,
      })

      return NextResponse.json(
        {
          error: "Failed to get access token from provider",
          status: response.status,
          details: data,
        },
        { status: response.status },
      )
    }

    console.log("Successfully obtained token from Policy Admin API")

    // Return the token response
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in token API:", error)
    return NextResponse.json(
      {
        error: "An unexpected error occurred while getting the access token",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
