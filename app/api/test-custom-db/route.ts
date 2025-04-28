import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    // Log the database URLs for debugging (masking sensitive parts)
    const customDbUrl = process.env.CUSTOM_DATABASE_URL || "Not set"
    const defaultDbUrl = process.env.DATABASE_URL || "Not set"

    console.log(
      "Custom DB URL (masked):",
      customDbUrl !== "Not set"
        ? `${customDbUrl.split("@")[0].split(":")[0]}:****@${customDbUrl.split("@")[1]}`
        : "Not set",
    )
    console.log(
      "Default DB URL (masked):",
      defaultDbUrl !== "Not set"
        ? `${defaultDbUrl.split("@")[0].split(":")[0]}:****@${defaultDbUrl.split("@")[1]}`
        : "Not set",
    )

    // Test the database connection
    console.log("Executing database query...")
    const result = await sql`SELECT current_database() as db_name, current_schema() as schema_name`

    // Log the raw result for debugging
    console.log("Query result:", JSON.stringify(result))

    // Get database info safely
    let dbName = "unknown"
    let schemaName = "unknown"

    if (result && result.rows && result.rows.length > 0) {
      dbName = result.rows[0].db_name || "unknown"
      schemaName = result.rows[0].schema_name || "unknown"
    }

    // Get a list of tables in the database
    console.log("Fetching table list...")
    const tablesResult = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `

    // Log the raw tables result for debugging
    console.log("Tables result:", JSON.stringify(tablesResult))

    // Extract table names safely
    const tables = []
    if (tablesResult && tablesResult.rows) {
      for (const row of tablesResult.rows) {
        if (row && row.table_name) {
          tables.push(row.table_name)
        }
      }
    }

    // Return detailed information
    return NextResponse.json({
      success: true,
      connection: {
        database: dbName,
        schema: schemaName,
      },
      tables: tables,
      environment: {
        customDbUrlSet: !!process.env.CUSTOM_DATABASE_URL,
        defaultDbUrlSet: !!process.env.DATABASE_URL,
        nodeEnv: process.env.NODE_ENV || "unknown",
      },
      rawResult: result, // Include the raw result for debugging
    })
  } catch (error) {
    console.error("Database test error:", error)

    // Return detailed error information
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        errorType: error ? error.constructor.name : "Unknown",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
