import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Check if the firms table exists
    const tableExistsResult = await sql`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'firms'
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
        { error: "Firms table does not exist. Please initialize the database." },
        { status: 404 },
      )
    }

    // Fetch the specific firm from the database
    const result = await sql`SELECT * FROM firms WHERE firm_id = ${Number.parseInt(id)}`

    // Check if firm exists
    const firm = Array.isArray(result) ? result[0] : result.rows?.[0]

    if (!firm) {
      return NextResponse.json({ error: `Firm with ID ${id} not found` }, { status: 404 })
    }

    // Return the firm data
    return NextResponse.json(firm)
  } catch (error) {
    console.error(`Error fetching firm with ID ${params.id}:`, error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
