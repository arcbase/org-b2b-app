import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Get the database connection string from environment variables
    const connectionString = process.env.DATABASE_URL || "Not set"

    return NextResponse.json({
      success: true,
      connectionString,
    })
  } catch (error) {
    console.error("Error getting database connection info:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
