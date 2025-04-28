import { sql } from "@/lib/db"

/**
 * Safely executes a SQL query and handles different response formats
 * @param query The SQL query to execute
 * @param params Optional parameters for the query
 * @returns The query result with standardized format
 */
export async function executeQuery(query: string, params: any[] = []) {
  try {
    // Execute the query
    const result = await sql.query(query, params)

    // Log the raw result for debugging
    console.log("Raw query result:", JSON.stringify(result))

    // Return a standardized result format
    return {
      success: true,
      rows: result.rows || [],
      rowCount: result.rowCount || 0,
    }
  } catch (error) {
    console.error("Database query error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      rows: [],
      rowCount: 0,
    }
  }
}

/**
 * Checks if a table exists in the database
 * @param tableName The name of the table to check
 * @returns Boolean indicating if the table exists
 */
export async function tableExists(tableName: string): Promise<boolean> {
  try {
    const query = `
      SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = $1
      )
    `

    const result = await executeQuery(query, [tableName])

    if (result.success && result.rows.length > 0) {
      return result.rows[0].exists === true
    }

    return false
  } catch (error) {
    console.error(`Error checking if table ${tableName} exists:`, error)
    return false
  }
}

/**
 * Gets all tables in the public schema
 * @returns Array of table names
 */
export async function getAllTables(): Promise<string[]> {
  try {
    const query = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `

    const result = await executeQuery(query)

    if (result.success) {
      return result.rows.map((row) => row.table_name)
    }

    return []
  } catch (error) {
    console.error("Error getting all tables:", error)
    return []
  }
}
