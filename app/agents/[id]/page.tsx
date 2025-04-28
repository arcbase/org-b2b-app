import { AgentDetailsContent } from "../agent-details-content"
import { sql } from "@/lib/db"
import { notFound } from "next/navigation"
import { extractRowsFromResult, getFirstRowFromResult } from "@/lib/utils/sql-helpers"

// Get agent data from the database
async function getAgentById(id: string) {
  try {
    // Fetch agent details
    const agentResult = await sql`
      SELECT a.*, f.firm_name as linked_b2b_partner_firm_name
      FROM agents a
      LEFT JOIN firms f ON a.firm_id = f.firm_id
      WHERE a.agent_id = ${Number.parseInt(id)}
    `

    const agent = getFirstRowFromResult(agentResult)

    if (!agent) {
      return null
    }

    // Fetch state licenses
    const licensesResult = await sql`
      SELECT * FROM state_licenses WHERE agent_id = ${Number.parseInt(id)}
    `

    const licenses = extractRowsFromResult(licensesResult)

    return {
      ...agent,
      state_licenses: licenses,
    }
  } catch (error) {
    console.error("Error fetching agent:", error)
    return null
  }
}

export default async function AgentDetailsPage({ params }: { params: { id: string } }) {
  const agent = await getAgentById(params.id)

  if (!agent) {
    notFound()
  }

  return (
    <div className="container mx-auto py-8">
      <div className="bg-white p-8 rounded-md shadow-sm">
        <AgentDetailsContent agent={agent} />
      </div>
    </div>
  )
}
