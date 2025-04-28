import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    // Check if all required tables exist
    const tablesResult = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('firms', 'advisor_firms', 'advisors', 'agents', 'licenses')
    `

    const tables = tablesResult.rows?.map((row) => row.table_name) || []
    const allTablesExist = tables.length === 5

    // Check if tables have data
    let tableData = {}
    let hasData = false

    if (allTablesExist) {
      const countQueries = [
        sql`SELECT COUNT(*) as count FROM firms`,
        sql`SELECT COUNT(*) as count FROM advisor_firms`,
        sql`SELECT COUNT(*) as count FROM advisors`,
        sql`SELECT COUNT(*) as count FROM agents`,
        sql`SELECT COUNT(*) as count FROM licenses`,
      ]

      const results = await Promise.all(countQueries)

      tableData = {
        firms: Array.isArray(results[0]) ? results[0][0]?.count : results[0].rows?.[0]?.count || 0,
        advisor_firms: Array.isArray(results[1]) ? results[1][0]?.count : results[1].rows?.[0]?.count || 0,
        advisors: Array.isArray(results[2]) ? results[2][0]?.count : results[2].rows?.[0]?.count || 0,
        agents: Array.isArray(results[3]) ? results[3][0]?.count : results[3].rows?.[0]?.count || 0,
        licenses: Array.isArray(results[4]) ? results[4][0]?.count : results[4].rows?.[0]?.count || 0,
      }

      hasData = Object.values(tableData).some((count) => count > 0)
    }

    return NextResponse.json({
      initialized: allTablesExist,
      seeded: hasData,
      tables: tables,
      tableData: tableData,
    })
  } catch (error) {
    console.error("Error checking database status:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
        initialized: false,
        seeded: false,
      },
      { status: 500 },
    )
  }
}
