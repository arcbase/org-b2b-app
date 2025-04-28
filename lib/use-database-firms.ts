"use server"

import { sql } from "@/lib/db"

export async function getDatabaseFirms() {
  try {
    // Check if the firms table exists
    const tableExistsResult = await sql`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'firms'
      )
    `

    // Extract the exists value
    let tableExists = false
    if (tableExistsResult.rows && tableExistsResult.rows.length > 0) {
      tableExists = tableExistsResult.rows[0].exists === true
    } else if (Array.isArray(tableExistsResult) && tableExistsResult.length > 0) {
      tableExists = tableExistsResult[0].exists === true
    }

    if (!tableExists) {
      return { error: "Firms table does not exist. Please initialize the database." }
    }

    // Fetch firms from the database
    const result = await sql`SELECT * FROM firms ORDER BY firm_name`

    // Return the firms data
    return result.rows || result
  } catch (error) {
    console.error("Error fetching firms from database:", error)
    return { error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function getFirmById(firmId: number) {
  try {
    // Fetch firm from the database
    const result = await sql`SELECT * FROM firms WHERE firm_id = ${firmId}`

    // Return the firm data or null if not found
    const firm = result.rows?.[0] || result[0] || null
    return firm
  } catch (error) {
    console.error("Error fetching firm from database:", error)
    return { error: error instanceof Error ? error.message : "Unknown error" }
  }
}
