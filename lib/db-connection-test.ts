import { neon } from "@neondatabase/serverless"

export async function testDatabaseConnection() {
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

    // Create a new connection to test
    const sql = neon(process.env.DATABASE_URL!)

    // Test the connection with a simple query
    const result = await sql`SELECT current_database() as db_name, current_schema() as schema_name`

    // Get database info
    const dbName = result[0]?.db_name || "unknown"
    const schemaName = result[0]?.schema_name || "unknown"

    // Try to list all tables in the current schema
    const tablesResult = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `

    // Extract table names
    const tables = tablesResult.map((row) => row.table_name)

    // Try to query the agents table specifically
    let agentsData = []
    let agentsError = null

    try {
      const agentsResult = await sql`SELECT * FROM agents LIMIT 5`
      agentsData = agentsResult
    } catch (error) {
      agentsError = error instanceof Error ? error.message : "Unknown error"
    }

    return {
      success: true,
      connectionInfo: {
        maskedUrl,
        dbName,
        schemaName,
      },
      tables,
      agentsData,
      agentsError,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      errorType: error instanceof Error ? error.constructor.name : "Unknown",
    }
  }
}
