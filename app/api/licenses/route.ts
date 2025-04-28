import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Check if the licenses table exists
    const tableExistsResult = await sql`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'licenses'
      )
    `

    // Extract the exists value
    let tableExists = false
    if (Array.isArray(tableExistsResult) && tableExistsResult.length > 0) {
      tableExists = tableExistsResult[0].exists === true
    } else if (tableExistsResult?.rows && tableExistsResult.rows.length > 0) {
      tableExists = tableExistsResult.rows[0].exists === true
    }

    if (!tableExists) {
      return NextResponse.json(
        { error: "Licenses table does not exist. Please initialize the database." },
        { status: 404 },
      )
    }

    // Fetch licenses from the database
    const result = await sql`SELECT * FROM licenses ORDER BY license_expiration_date`

    // Return the licenses data
    const licenses = Array.isArray(result) ? result : result.rows || []
    return NextResponse.json(licenses)
  } catch (error) {
    console.error("Error fetching licenses:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
