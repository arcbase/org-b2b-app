import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: Request) {
  try {
    // Query the database for all agents
    const agents = await sql`SELECT * FROM agents ORDER BY agent_name`

    return NextResponse.json({ agents: agents.rows || agents })
  } catch (error) {
    console.error("Error fetching agents:", error)
    return NextResponse.json({ error: "Failed to fetch agents" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      firmId,
      firstName,
      middleName,
      lastName,
      nationalProducerNumber,
      taxId,
      externalId,
      email,
      phone,
      residentState,
    } = body

    // Validate required fields
    if (!firmId || !firstName || !lastName || !nationalProducerNumber) {
      return NextResponse.json(
        { error: "Missing required fields: firmId, firstName, lastName, nationalProducerNumber" },
        { status: 400 },
      )
    }

    // Check if the firm exists
    const firmCheck = await sql`SELECT * FROM firms WHERE firm_id = ${firmId}`
    const firm = firmCheck.rows?.[0] || firmCheck[0]

    if (!firm) {
      return NextResponse.json({ error: "Firm not found" }, { status: 404 })
    }

    // Create the agent name
    const agentName = `${firstName} ${middleName ? middleName + " " : ""}${lastName}`.trim().toUpperCase()

    // Insert the agent into the database
    const result = await sql`
      INSERT INTO agents (
        agent_name, 
        agent_external_id, 
        npn, 
        email, 
        resident_state, 
        firm_id, 
        firm_name,
        status
      )
      VALUES (
        ${agentName}, 
        ${externalId || ""}, 
        ${nationalProducerNumber}, 
        ${email || ""}, 
        ${residentState || ""}, 
        ${firmId}, 
        ${firm.firm_name},
        ${"Active"}
      )
      RETURNING *
    `

    const newAgent = result.rows?.[0] || result[0]

    return NextResponse.json({
      success: true,
      message: "Agent successfully added to firm",
      agent: newAgent,
    })
  } catch (error) {
    console.error("Error creating agent:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create agent",
      },
      { status: 500 },
    )
  }
}
