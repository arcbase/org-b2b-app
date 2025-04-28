import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Check if the advisor_firms table exists
    const tableExistsResult = await sql`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'advisor_firms'
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
        { error: "Advisor firms table does not exist. Please initialize the database." },
        { status: 404 },
      )
    }

    // Fetch advisor firms from the database
    const result = await sql`
      SELECT af.*, f.firm_name as linked_b2b_partner_firm_name 
      FROM advisor_firms af
      LEFT JOIN firms f ON af.linked_b2b_partner_firm_id = f.firm_id
      ORDER BY af.advisor_firm_name
    `

    // Return the advisor firms data
    const advisorFirms = Array.isArray(result) ? result : result.rows || []
    return NextResponse.json(advisorFirms)
  } catch (error) {
    console.error("Error fetching advisor firms:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
