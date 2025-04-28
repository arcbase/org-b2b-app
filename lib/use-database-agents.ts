import { sql } from "@/lib/db"
import { extractRowsFromResult, getFirstRowFromResult } from "@/lib/utils/sql-helpers"

export async function getAgentById(id: number) {
  try {
    // Fetch agent details
    const agentResult = await sql`
      SELECT a.*, f.firm_name as linked_b2b_partner_firm_name, af.advisor_firm_name
      FROM agents a
      LEFT JOIN firms f ON a.firm_id = f.firm_id
      LEFT JOIN advisor_firms af ON a.advisor_firm_id = af.advisor_firm_id
      WHERE a.agent_id = ${id}
    `

    const agent = getFirstRowFromResult(agentResult)

    if (!agent) {
      return { error: "Agent not found" }
    }

    // Fetch state licenses
    const licensesResult = await sql`
      SELECT * FROM state_licenses WHERE agent_id = ${id}
    `

    const licenses = extractRowsFromResult(licensesResult)

    return {
      ...agent,
      state_licenses: licenses,
    }
  } catch (error) {
    console.error("Error fetching agent:", error)
    return { error: "Failed to fetch agent details" }
  }
}

// Renamed from getAllAgents to getDatabaseAgents to match the import in agents/page.tsx
export async function getDatabaseAgents() {
  try {
    // Check if the agents table exists
    const tableExistsResult = await sql`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'agents'
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
      return { error: "Agents table does not exist. Please initialize the database." }
    }

    // Fetch agents from the database with firm information
    const result = await sql`
      SELECT a.*, f.firm_name as linked_b2b_partner_firm_name
      FROM agents a
      LEFT JOIN firms f ON a.firm_id = f.firm_id
      ORDER BY a.agent_name
    `

    // Return the agents data
    return extractRowsFromResult(result)
  } catch (error) {
    console.error("Error fetching agents from database:", error)
    return { error: error instanceof Error ? error.message : "Unknown error" }
  }
}
