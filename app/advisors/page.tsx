"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { AdvisorsTable } from "./advisors-table"
import { AdvisorsTableSkeleton } from "./advisors-table-skeleton"
import { NoDataMessage } from "@/components/no-data-message"
import { DataFetchError } from "@/components/data-fetch-error"

type Advisor = {
  advisor_id: number
  advisor_name: string
  advisor_firm_id: number
  advisor_firm_name: string
  email: string
  phone: string
  portal_access_status: string
  status: string
}

export default function AdvisorsPage() {
  const [advisors, setAdvisors] = useState<Advisor[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchAdvisors = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch("/api/advisors")

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()
      setAdvisors(data)
    } catch (err) {
      console.error("Error fetching advisors:", err)
      setError(err instanceof Error ? err : new Error("Failed to fetch advisors"))
    } finally {
      setIsLoading(false)
    }
  }

  const refreshData = async () => {
    setIsRefreshing(true)
    await fetchAdvisors()
    setIsRefreshing(false)
  }

  useEffect(() => {
    fetchAdvisors()
  }, [])

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Advisors</h1>
        <Button className="bg-[#007AFF] hover:bg-[#0056b3]">
          <Plus className="mr-2 h-4 w-4" />
          Add New Advisor
        </Button>
      </div>

      {isLoading ? (
        <AdvisorsTableSkeleton />
      ) : error ? (
        <DataFetchError error={error} entityName="Advisors" refreshAction={refreshData} isRefreshing={isRefreshing} />
      ) : advisors && advisors.length > 0 ? (
        <AdvisorsTable advisors={advisors} />
      ) : (
        <NoDataMessage entityName="Advisor" entityNamePlural="Advisors" />
      )}
    </div>
  )
}
