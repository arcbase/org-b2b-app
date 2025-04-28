"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { AdvisorFirmsTable } from "./advisor-firms-table"
import { AdvisorFirmsTableSkeleton } from "./advisor-firms-table-skeleton"
import { NoDataMessage } from "@/components/no-data-message"
import { DataFetchError } from "@/components/data-fetch-error"

type AdvisorFirm = {
  advisor_firm_id: number
  advisor_firm_name: string
  firm_external_id: string
  linked_b2b_partner_firm_id: number
  linked_b2b_partner_firm_name: string
  primary_contact_name: string
  primary_contact_email: string
  phone: string
  address: string
  advisors_count: number
  status: string
  portal_access_status: string
}

export default function AdvisorFirmsPage() {
  const [advisorFirms, setAdvisorFirms] = useState<AdvisorFirm[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchAdvisorFirms = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch("/api/advisor-firms")

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()
      setAdvisorFirms(data)
    } catch (err) {
      console.error("Error fetching advisor firms:", err)
      setError(err instanceof Error ? err : new Error("Failed to fetch advisor firms"))
    } finally {
      setIsLoading(false)
    }
  }

  const refreshData = async () => {
    setIsRefreshing(true)
    await fetchAdvisorFirms()
    setIsRefreshing(false)
  }

  useEffect(() => {
    fetchAdvisorFirms()
  }, [])

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Advisor Firms</h1>
        <Button className="bg-[#007AFF] hover:bg-[#0056b3]">
          <Plus className="mr-2 h-4 w-4" />
          Add New Advisor Firm
        </Button>
      </div>

      {isLoading ? (
        <AdvisorFirmsTableSkeleton />
      ) : error ? (
        <DataFetchError
          error={error}
          entityName="Advisor Firms"
          refreshAction={refreshData}
          isRefreshing={isRefreshing}
        />
      ) : advisorFirms && advisorFirms.length > 0 ? (
        <AdvisorFirmsTable advisorFirms={advisorFirms} />
      ) : (
        <NoDataMessage entityName="Advisor Firm" entityNamePlural="Advisor Firms" />
      )}
    </div>
  )
}
