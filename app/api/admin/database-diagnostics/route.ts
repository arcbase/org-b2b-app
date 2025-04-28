import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    // Get the database URL (masked for security)
    const dbUrl = process.env.DATABASE_URL || ""
    let maskedUrl = "Not set"

    if (dbUrl) {
      try {
        const url = new URL(dbUrl)
        maskedUrl = `${url.protocol}//${url.username}:****@${url.host}${url.pathname}`
      } catch (e) {
        maskedUrl = "Invalid URL format"
      }
    }

    const results = {
      connectionInfo: {
        maskedUrl,
      },
      connection: {
        success: false,
        message: "",
        error: null as string | null,
      },
      tables: {
        firms: { exists: false, error: null as string | null },
        advisor_firms: { exists: false, error: null as string | null },
        advisors: { exists: false, error: null as string | null },
        agents: { exists: false, error: null as string | null },
        licenses: { exists: false, error: null as string | null },
      },
      queries: {
        firms: { success: false, error: null as string | null, data: null as any },
        advisor_firms: { success: false, error: null as string | null, data: null as any },
        advisors: { success: false, error: null as string | null, data: null as any },
        agents: { success: false, error: null as string | null, data: null as any },
      },
      env: {
        DATABASE_URL: process.env.DATABASE_URL ? "Set (masked)" : "Not set",
        POSTGRES_URL: process.env.POSTGRES_URL ? "Set (masked)" : "Not set",
        POSTGRES_PRISMA_URL: process.env.POSTGRES_PRISMA_URL ? "Set (masked)" : "Not set",
        POSTGRES_URL_NON_POOLING: process.env.POSTGRES_URL_NON_POOLING ? "Set (masked)" : "Not set",
        POSTGRES_URL_NO_SSL: process.env.POSTGRES_URL_NO_SSL ? "Set (masked)" : "Not set",
        CUSTOM_DATABASE_URL: process.env.CUSTOM_DATABASE_URL ? "Set (masked)" : "Not set",
        NODE_ENV: process.env.NODE_ENV || "Not set",
      },
    }

    // Test 1: Basic connection
    try {
      const connectionResult = await sql`SELECT NOW() as time`
      results.connection.success = true
      results.connection.message = `Connected successfully. Server time: ${
        connectionResult?.rows?.[0]?.time || "unknown"
      }`
    } catch (error) {
      results.connection.success = false
      results.connection.message = "Failed to connect to database"
      results.connection.error = error instanceof Error ? error.message : String(error)
    }

    // Test 2: Check if tables exist
    for (const table of Object.keys(results.tables)) {
      try {
        // Use parameterized queries with the sql tag function
        const tableExistsResult = await sql`
        SELECT EXISTS (
          SELECT 1 FROM information_schema.tables 
          WHERE table_schema = 'public' AND table_name = ${table}
        )
      `

        // Extract the exists value
        let tableExists = false
        if (Array.isArray(tableExistsResult) && tableExistsResult.length > 0) {
          tableExists = tableExistsResult[0].exists === true
        } else if (tableExistsResult?.rows && tableExistsResult.rows.length > 0) {
          tableExists = tableExistsResult.rows[0].exists === true
        }

        results.tables[table as keyof typeof results.tables].exists = tableExists
      } catch (error) {
        results.tables[table as keyof typeof results.tables].error =
          error instanceof Error ? error.message : String(error)
      }
    }

    // Test 3: Try to query each table
    for (const table of Object.keys(results.queries)) {
      try {
        // Only attempt to query if the table exists
        if (results.tables[table as keyof typeof results.tables].exists) {
          // Use string template for the query instead of sql.identifier
          const query = `SELECT * FROM ${table} LIMIT 1`
          const queryResult = await sql.query(query)

          results.queries[table as keyof typeof results.queries].success = true
          results.queries[table as keyof typeof results.queries].data = queryResult.rows || []
        } else {
          results.queries[table as keyof typeof results.queries].error = `Table '${table}' does not exist`
        }
      } catch (error) {
        results.queries[table as keyof typeof results.queries].success = false
        results.queries[table as keyof typeof results.queries].error =
          error instanceof Error ? error.message : String(error)
      }
    }

    return NextResponse.json(results)
  } catch (error) {
    console.error("Error running database diagnostics:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
        errorType: error instanceof Error ? error.constructor.name : "Unknown",
      },
      { status: 500 },
    )
  }
}
