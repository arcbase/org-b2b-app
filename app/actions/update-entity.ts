"use server"

import { revalidatePath } from "next/cache"
import { sql } from "@/lib/db"

// Log function for tracking database operations
function logOperation(operation: string, details: any) {
  console.log(`[DB OPERATION] ${operation}:`, JSON.stringify(details, null, 2))
}

export async function updateEntity(entityType: string, entityId: number, data: any) {
  try {
    logOperation("Update Request", { entityType, entityId, data })

    // Remove any fields that shouldn't be directly updated
    const sanitizedData = { ...data }
    delete sanitizedData.firm_id
    delete sanitizedData.advisor_firm_id
    delete sanitizedData.agent_id
    delete sanitizedData.advisor_id
    delete sanitizedData.license_id
    delete sanitizedData.linked_b2b_partner_firm_id
    delete sanitizedData.linked_b2b_partner_firm_name
    delete sanitizedData.portal_account_creation_date
    delete sanitizedData.last_login_date
    delete sanitizedData.state_licenses

    // Map entity types to their corresponding database tables
    const tableMapping: Record<string, string> = {
      firms: "firms",
      "advisor-firms": "advisor_firms",
      advisors: "advisors",
      agents: "agents",
      licensing: "licenses",
    }

    // Map entity types to their corresponding ID column names
    const idColumnMapping: Record<string, string> = {
      firms: "firm_id",
      "advisor-firms": "advisor_firm_id",
      advisors: "advisor_id",
      agents: "agent_id",
      licensing: "license_id",
    }

    const tableName = tableMapping[entityType]
    const idColumnName = idColumnMapping[entityType]

    if (!tableName || !idColumnName) {
      throw new Error(`Unknown entity type: ${entityType}`)
    }

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
      UPDATE ${tableName}
      SET ${setClause}, updated_at = NOW()
      WHERE ${idColumnName} = ${entityId}
      RETURNING *
    `

    logOperation("Executing SQL", { query })

    // Execute the query
    const result = await sql.query(query)

    logOperation("Update Result", { rowCount: result.rowCount, rows: result.rows })

    if (result.rowCount === 0) {
      return {
        success: false,
        message: `${entityType.charAt(0).toUpperCase() + entityType.slice(1)} with ID ${entityId} not found`,
      }
    }

    // Revalidate the appropriate paths
    revalidatePath(`/${entityType}/${entityId}`)
    revalidatePath(`/${entityType}`)

    return {
      success: true,
      message: `${entityType.charAt(0).toUpperCase() + entityType.slice(1)} updated successfully`,
      data: result.rows[0],
    }
  } catch (error) {
    console.error(`[DB ERROR] Error updating ${entityType}:`, error)
    return {
      success: false,
      message: `Failed to update ${entityType}. ${error instanceof Error ? error.message : "Please try again."}`,
    }
  }
}
