import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Check if the advisors table exists
    const tableExistsResult = await sql`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'advisors'
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
        { error: "Advisors table does not exist. Please initialize the database." },
        { status: 404 },
      )
    }

    // Fetch advisors from the database
    const result = await sql`
      SELECT a.*, af.advisor_firm_name
      FROM advisors a
      LEFT JOIN advisor_firms af ON a.advisor_firm_id = af.advisor_firm_id
      ORDER BY a.advisor_name
    `

    // Return the advisors data
    const advisors = Array.isArray(result) ? result : result.rows || []
    return NextResponse.json(advisors)
  } catch (error) {
    console.error("Error fetching advisors:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
