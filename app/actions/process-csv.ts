"use server"

import Papa from "papaparse"
import { revalidatePath } from "next/cache"

// Mock database of agent licenses - in a real app, this would come from your database
const mockAgentLicenses = [
  { agentId: 66061310, agentName: "GRANT CROUCH", state: "WA", status: "Active", expirationDate: "2025-12-31" },
  { agentId: 66061310, agentName: "GRANT CROUCH", state: "CA", status: "Active", expirationDate: "2025-10-15" },
  { agentId: 66061310, agentName: "GRANT CROUCH", state: "NY", status: "Pending", expirationDate: null },
  { agentId: 66061311, agentName: "SARAH JOHNSON", state: "TX", status: "Active", expirationDate: "2025-08-22" },
  { agentId: 66061311, agentName: "SARAH JOHNSON", state: "FL", status: "Active", expirationDate: "2025-09-30" },
  { agentId: 66061312, agentName: "MICHAEL BROWN", state: "IL", status: "Active", expirationDate: "2025-11-10" },
  { agentId: 66061313, agentName: "EMILY DAVIS", state: "GA", status: "Expired", expirationDate: "2024-03-15" },
  { agentId: 66061314, agentName: "DAVID WILSON", state: "OH", status: "Active", expirationDate: "2025-07-20" },
  { agentId: 66061315, agentName: "JENNIFER ADAMS", state: "PA", status: "Active", expirationDate: "2025-06-05" },
  { agentId: 66061316, agentName: "ROBERT CHEN", state: "MI", status: "Inactive", expirationDate: "2024-01-10" },
]

export type ValidationResult = {
  policyNumber: string
  agentName: string
  agentId: number
  state: string
  isLicensed: boolean
  licenseStatus?: string
  expirationDate?: string | null
  needsAppointment: boolean
  applicationDate: string
}

export async function processCSVFile(formData: FormData) {
  const file = formData.get("csvFile") as File

  if (!file) {
    return { success: false, error: "No file uploaded" }
  }

  // Check file type
  if (!file.name.endsWith(".csv")) {
    return { success: false, error: "Please upload a CSV file" }
  }

  try {
    const fileContent = await file.text()

    // Parse CSV
    const { data, errors } = Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
    })

    if (errors.length > 0) {
      return { success: false, error: "Error parsing CSV file" }
    }

    // Add debugging to see what's in the parsed data
    console.log("Parsed CSV data:", data)

    // Process each row and validate agent licensing
    const results: ValidationResult[] = data.map((row: any) => {
      const policyNumber = row["POLICY NUMBER"] || ""
      const state = row["Issue State"] || ""
      const agentName = row["Agent Name"] || ""
      const agentId = Number.parseInt(row["Agent D Distributor Key"] || "0")
      const applicationDate = row["APPLICATION DATE"] || ""

      // Check if agent is licensed in the state
      const license = mockAgentLicenses.find((license) => license.agentId === agentId && license.state === state)

      const isLicensed = !!license && license.status === "Active"
      const needsAppointment = !isLicensed

      return {
        policyNumber,
        agentName,
        agentId,
        state,
        isLicensed,
        licenseStatus: license?.status,
        expirationDate: license?.expirationDate,
        needsAppointment,
        applicationDate,
      }
    })

    console.log("Processed results before validation:", results)

    // Instead of filtering out rows with missing data, mark them as needing attention
    const validResults = results.map((result) => {
      // Check if any required fields are missing
      const hasMissingData = !result.agentName || !result.agentId || !result.state

      return {
        ...result,
        // If data is missing, mark as needing appointment and add a note
        needsAppointment: hasMissingData ? true : result.needsAppointment,
        licenseStatus: hasMissingData ? "Incomplete Data" : result.licenseStatus,
        isLicensed: hasMissingData ? false : result.isLicensed,
      }
    })

    console.log("Final valid results:", validResults)

    revalidatePath("/licensing/validate-csv")

    return {
      success: true,
      results: validResults,
      summary: {
        total: validResults.length,
        licensed: validResults.filter((r) => r.isLicensed).length,
        needsAppointment: validResults.filter((r) => r.needsAppointment).length,
      },
    }
  } catch (error) {
    console.error("Error processing CSV:", error)
    return { success: false, error: "Error processing CSV file" }
  }
}
