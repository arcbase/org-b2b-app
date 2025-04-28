import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const firmId = Number.parseInt(params.id, 10)

    if (isNaN(firmId)) {
      return NextResponse.json({ error: "Invalid firm ID" }, { status: 400 })
    }

    // Query the database for agents associated with this firm
    const agents = await sql`
      SELECT * FROM agents 
      WHERE firm_id = ${firmId}
      ORDER BY agent_name
    `

    return NextResponse.json({ agents: agents.rows || agents })
  } catch (error) {
    console.error("Error fetching agents for firm:", error)
    return NextResponse.json({ error: "Failed to fetch agents" }, { status: 500 })
  }
}
