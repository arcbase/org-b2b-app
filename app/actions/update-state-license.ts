"use server"

import { revalidatePath } from "next/cache"
import { sql } from "@/lib/db"
import { extractRowsFromResult } from "@/lib/utils/sql-helpers"

// Log function for tracking database operations
function logOperation(operation: string, details: any) {
  console.log(`[DB OPERATION] ${operation}:`, JSON.stringify(details, null, 2))
}

export async function updateStateLicense(licenseId: number, data: any) {
  try {
    logOperation("Update State License Request", { licenseId, data })

    // Remove any fields that shouldn't be directly updated
    const sanitizedData = { ...data }
    delete sanitizedData.id
    delete sanitizedData.agent_id
    delete sanitizedData.created_at

    // Create SET clause for SQL query
    const setClause = Object.entries(sanitizedData)
      .map(([key, value]) => {
        // Skip undefined values
        if (value === undefined) return null
        return `${key} = ${typeof value === "string" ? `'${value.replace(/'/g, "''")}'` : value}`
      })
      .filter(Boolean)
      .join(", ")

    if (!setClause) {
      return { success: false, message: "No valid fields to update" }
    }

    // Construct and execute the SQL query
    const query = `
      UPDATE state_licenses
      SET ${setClause}, updated_at = NOW()
      WHERE id = ${licenseId}
      RETURNING *
    `

    logOperation("Executing SQL", { query })

    // Execute the query
    const result = await sql.query(query)

    logOperation("Update Result", { rowCount: result.rowCount, rows: result.rows })

    if (result.rowCount === 0) {
      return {
        success: false,
        message: `State license with ID ${licenseId} not found`,
      }
    }

    // Get the agent_id to revalidate the correct path
    const agentId = result.rows[0].agent_id

    // Revalidate the appropriate paths
    revalidatePath(`/agents/${agentId}`)

    return {
      success: true,
      message: "State license updated successfully",
      data: result.rows[0],
    }
  } catch (error) {
    console.error(`[DB ERROR] Error updating state license:`, error)
    return {
      success: false,
      message: `Failed to update state license. ${error instanceof Error ? error.message : "Please try again."}`,
    }
  }
}

export async function requestNewLicense(agentId: number, state: string, status = "Pending") {
  try {
    logOperation("Request New License", { agentId, state, status })

    // Check if a license for this state already exists
    const existingLicenseResult = await sql`
      SELECT * FROM state_licenses 
      WHERE agent_id = ${agentId} AND state = ${state}
    `

    // Extract rows using our helper function
    const existingLicenses = extractRowsFromResult(existingLicenseResult)

    if (existingLicenses.length > 0) {
      return {
        success: false,
        message: `A license for ${state} already exists for this agent`,
        data: existingLicenses[0],
      }
    }

    // Insert new license
    const result = await sql`
      INSERT INTO state_licenses (agent_id, state, status, appointment_status, expiration_date)
      VALUES (${agentId}, ${state}, ${status}, 'Not Appointed', NULL)
      RETURNING *
    `

    // Extract rows from the result
    const insertedLicenses = extractRowsFromResult(result)

    logOperation("New License Result", { result: insertedLicenses })

    // Revalidate the appropriate paths
    revalidatePath(`/agents/${agentId}`)

    return {
      success: true,
      message: `License request for ${state} submitted successfully`,
      data: insertedLicenses[0],
    }
  } catch (error) {
    console.error(`[DB ERROR] Error requesting new license:`, error)
    return {
      success: false,
      message: `Failed to request new license. ${error instanceof Error ? error.message : "Please try again."}`,
    }
  }
}

export async function requestAppointment(licenseId: number, agentId: number) {
  try {
    logOperation("Request Appointment", { licenseId, agentId })

    // Update the appointment status
    const result = await sql`
      UPDATE state_licenses
      SET appointment_status = 'Pending', updated_at = NOW()
      WHERE id = ${licenseId}
      RETURNING *
    `

    // Extract rows from the result
    const updatedLicenses = extractRowsFromResult(result)

    logOperation("Appointment Request Result", { result: updatedLicenses })

    if (updatedLicenses.length === 0) {
      return {
        success: false,
        message: `State license with ID ${licenseId} not found`,
      }
    }

    // Revalidate the appropriate paths
    revalidatePath(`/agents/${agentId}`)

    return {
      success: true,
      message: "Appointment request submitted successfully",
      data: updatedLicenses[0],
    }
  } catch (error) {
    console.error(`[DB ERROR] Error requesting appointment:`, error)
    return {
      success: false,
      message: `Failed to request appointment. ${error instanceof Error ? error.message : "Please try again."}`,
    }
  }
}

export async function getStatesWithoutLicenses(agentId: number) {
  try {
    // Get all states that the agent already has licenses for
    const existingStatesResult = await sql`
     SELECT state FROM state_licenses WHERE agent_id = ${agentId}
   `

    // Handle different result formats
    let existingStatesList: string[] = []

    // If result is an array directly
    if (Array.isArray(existingStatesResult)) {
      existingStatesList = existingStatesResult.map((row) => row.state)
    }
    // If result has a rows property
    else if (existingStatesResult?.rows) {
      existingStatesList = existingStatesResult.rows.map((row) => row.state)
    }

    // List of all US states
    const allStates = [
      "AL",
      "AK",
      "AZ",
      "AR",
      "CA",
      "CO",
      "CT",
      "DE",
      "FL",
      "GA",
      "HI",
      "ID",
      "IL",
      "IN",
      "IA",
      "KS",
      "KY",
      "LA",
      "ME",
      "MD",
      "MA",
      "MI",
      "MN",
      "MS",
      "MO",
      "MT",
      "NE",
      "NV",
      "NH",
      "NJ",
      "NM",
      "NY",
      "NC",
      "ND",
      "OH",
      "OK",
      "OR",
      "PA",
      "RI",
      "SC",
      "SD",
      "TN",
      "TX",
      "UT",
      "VT",
      "VA",
      "WA",
      "WV",
      "WI",
      "WY",
      "DC",
    ]

    // Filter out states that the agent already has licenses for
    const availableStates = allStates.filter((state) => !existingStatesList.includes(state))

    return {
      success: true,
      availableStates,
    }
  } catch (error) {
    console.error(`[DB ERROR] Error getting available states:`, error)
    return {
      success: false,
      message: `Failed to get available states. ${error instanceof Error ? error.message : "Please try again."}`,
      availableStates: [],
    }
  }
}
