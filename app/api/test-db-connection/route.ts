import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    // Log the database URL being used (masked for security)
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

    console.log("Using database URL (masked):", maskedUrl)

    // Test the connection with a simple query
    const connectionResult = await sql`SELECT NOW() as time`

    // Check if tables exist
    const tablesExistResult = await sql`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'agents'
      ) as agents_exist
    `

    const agentsExist = tablesExistResult.rows?.[0]?.agents_exist === true

    // Only try to query the agents table if it exists
    let agentsCount = 0
    if (agentsExist) {
      const agentsResult = await sql`SELECT COUNT(*) as count FROM agents`
      agentsCount = agentsResult.rows?.[0]?.count || 0
    }

    // Get list of tables
    const tablesResult = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `

    const tables = tablesResult.rows?.map((row) => row.table_name) || []

    return NextResponse.json({
      success: true,
      connection: "Connected successfully to database",
      tables: tables,
      agentsExist: agentsExist,
      agentsCount: agentsExist ? agentsCount : "Table does not exist",
      databaseUrl: maskedUrl,
      needsInitialization: !agentsExist,
      serverTime: connectionResult.rows?.[0]?.time,
    })
  } catch (error) {
    console.error("Database connection test error:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        errorType: error instanceof Error ? error.constructor.name : "Unknown",
        databaseUrl: process.env.DATABASE_URL ? "Set (masked)" : "Not set",
      },
      { status: 500 },
    )
  }
}
