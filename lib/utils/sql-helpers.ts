/**
 * Extracts rows from a SQL query result, handling different result formats
 * @param result The result from a SQL query
 * @returns An array of rows
 */
export function extractRowsFromResult(result: any): any[] {
  if (!result) return []
  return Array.isArray(result) ? result : result.rows || []
}

/**
 * Gets the first row from a SQL query result, handling different result formats
 * @param result The result from a SQL query
 * @returns The first row or null if no rows
 */
export function getFirstRowFromResult(result: any): any | null {
  const rows = extractRowsFromResult(result)
  return rows.length > 0 ? rows[0] : null
}
