import { NextResponse } from "next/server"
import { fetchWithAuth } from "@/lib/api-utils"

export async function GET(request: Request) {
  try {
    // Get query parameters from the request URL
    const { searchParams } = new URL(request.url)
    const queryString = Array.from(searchParams.entries())
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&")

    // Construct the API URL with query parameters
    const apiUrl = `${process.env.API_BASE_URL}/agents${queryString ? `?${queryString}` : ""}`

    // Make the authenticated request to the external API
    const response = await fetchWithAuth(apiUrl)

    if (!response.ok) {
      // Log the error details for debugging but don't expose them to the client
      console.error(`API error: ${response.status} ${response.statusText}`)
      return NextResponse.json({ error: "Failed to fetch agents from external API" }, { status: response.status })
    }

    // Get the response data
    const data = await response.json()

    // Return the data to the client
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in agents proxy:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    // Get the request body
    const body = await request.json()

    // Make the authenticated request to the external API
    const response = await fetchWithAuth(`${process.env.API_BASE_URL}/agents`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      // Log the error details for debugging
      console.error(`API error: ${response.status} ${response.statusText}`)
      const errorData = await response.json().catch(() => ({}))

      return NextResponse.json({ error: "Failed to create agent", details: errorData }, { status: response.status })
    }

    // Get the response data
    const data = await response.json()

    // Return the data to the client
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in agents proxy:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
