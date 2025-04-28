import { NextResponse } from "next/server"
import { fetchWithAuth } from "@/lib/api-utils"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Make the authenticated request to the external API
    const response = await fetchWithAuth(`${process.env.API_BASE_URL}/firms/${id}`)

    if (!response.ok) {
      console.error(`API error: ${response.status} ${response.statusText}`)
      return NextResponse.json({ error: `Failed to fetch firm with ID ${id}` }, { status: response.status })
    }

    // Get the response data
    const data = await response.json()

    // Return the data to the client
    return NextResponse.json(data)
  } catch (error) {
    console.error(`Error in firm/${params.id} proxy:`, error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()

    // Make the authenticated request to the external API
    const response = await fetchWithAuth(`${process.env.API_BASE_URL}/firms/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      console.error(`API error: ${response.status} ${response.statusText}`)
      return NextResponse.json({ error: `Failed to update firm with ID ${id}` }, { status: response.status })
    }

    // Get the response data
    const data = await response.json()

    // Return the data to the client
    return NextResponse.json(data)
  } catch (error) {
    console.error(`Error in firm/${params.id} proxy:`, error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
