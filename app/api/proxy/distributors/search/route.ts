import { NextResponse } from "next/server"
import { fetchWithAuth } from "@/lib/api-utils"

export async function POST(request: Request) {
  try {
    // Get the API base URL from environment variables
    const apiBaseUrl = process.env.API_BASE_URL

    // Check if the API base URL is set
    if (!apiBaseUrl) {
      console.error("[Proxy] API_BASE_URL environment variable is not set")
      return NextResponse.json(
        {
          error: "API_BASE_URL environment variable is not set",
        },
        { status: 400 },
      )
    }

    // Get the request body
    const body = await request.json()

    // Log the incoming request for debugging
    console.log("[Proxy] Received search request with variables:", JSON.stringify(body.variables))

    // Extract the variables from the request body
    const { searchTerm, onlyActive, pagingContext } = body.variables || {}

    console.log("[Proxy] Extracted variables:", { searchTerm, onlyActive, pagingContext })

    // Prepare the GraphQL request
    const graphqlRequest = {
      query: `
        query distributorSearch(
          $searchTerm: String!
          $onlyActive: Boolean
          $pagingContext: PagingContextInput
        ) {
          distributorSearch(
            searchTerm: $searchTerm
            onlyActive: $onlyActive
            pagingContext: $pagingContext
          ) {
            count
            results {
              name
              lastFourTaxId
              nationalProducerNumber
              firmNames
              distributor {
                id
                name
                searchName
                source
                isPerson
                nationalProducerNumber
                lastFourTaxId
                taxId
                crdNumber
                ... on Agency {
                  name
                  __typename
                }
                ... on Agent {
                  prefix
                  firstName
                  middleName
                  sex
                  lastName
                  suffix
                  birthDate
                  __typename
                }
              }
            }
          }
        }
      `,
      variables: {
        searchTerm,
        onlyActive,
        pagingContext,
      },
    }

    // Ensure we're using the /graphql endpoint
    const graphqlEndpoint = `${apiBaseUrl}/graphql`

    console.log("[Proxy] Sending GraphQL request to API:", {
      url: graphqlEndpoint,
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })

    try {
      // Make the request to the GraphQL endpoint
      const response = await fetchWithAuth(graphqlEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(graphqlRequest),
      })

      // Log response headers and status for debugging
      console.log("[Proxy] Response status:", response.status, response.statusText)
      console.log("[Proxy] Response headers:", Object.fromEntries([...response.headers.entries()]))

      // Check content type to ensure we're getting JSON back
      const contentType = response.headers.get("content-type")
      if (contentType && !contentType.includes("application/json")) {
        console.error(`[Proxy] Unexpected content type: ${contentType}`)

        // Try to get the response text for debugging
        const responseText = await response.text()
        console.error("[Proxy] Non-JSON response:", responseText.substring(0, 500))

        return NextResponse.json(
          {
            error: `API returned non-JSON response with content type: ${contentType}`,
            responsePreview: responseText.substring(0, 500),
          },
          { status: 500 },
        )
      }

      // Get the response data
      const data = await response.json()

      // Log the response for debugging
      console.log("[Proxy] GraphQL API response status:", response.status)
      console.log("[Proxy] GraphQL API response preview:", JSON.stringify(data).substring(0, 200) + "...")

      // Check if the response is successful
      if (!response.ok) {
        console.error("[Proxy] API error:", response.status, data)
        return NextResponse.json(
          {
            error: "Failed to search distributors from API",
            status: response.status,
            details: data,
          },
          { status: response.status },
        )
      }

      // Return the search results
      return NextResponse.json(data)
    } catch (fetchError) {
      console.error("[Proxy] Fetch error:", fetchError)

      // Fall back to mock API if real API fails
      console.log("[Proxy] Falling back to mock API")
      const mockResponse = await fetch("/api/distributors/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ variables: { searchTerm, onlyActive, pagingContext } }),
      })

      if (!mockResponse.ok) {
        throw new Error(`Mock API also failed: ${mockResponse.status}`)
      }

      const mockData = await mockResponse.json()
      return NextResponse.json(mockData)
    }
  } catch (error) {
    console.error("[Proxy] Error in distributor search proxy:", error)
    return NextResponse.json(
      {
        error: "An unexpected error occurred while searching distributors",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
