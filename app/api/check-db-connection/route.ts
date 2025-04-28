import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Try to execute a simple query
    const result = await sql`SELECT NOW() as time`

    // Check if result and result.rows exist before accessing
    if (!result || !result.rows || result.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Database query returned no results",
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: `Successfully connected to database. Server time: ${result.rows[0].time}`,
    })
  } catch (error) {
    console.error("Database connection error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
