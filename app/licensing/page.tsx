"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Filter, Upload } from "lucide-react"
import { LicensingTable } from "./licensing-table"
import { LicensingTableSkeleton } from "./licensing-table-skeleton"
import { NoDataMessage } from "@/components/no-data-message"
import { DataFetchError } from "@/components/data-fetch-error"
import Link from "next/link"

type License = {
  license_id: number
  agent_name: string
  agent_id: number
  firm_name: string
  firm_id: number
  license_state: string
  license_expiration_date: string
  status: string
  actionable_alerts: string | null
}

export default function LicensingPage() {
  const [licenses, setLicenses] = useState<License[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchLicenses = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch("/api/licenses")

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()
      setLicenses(data)
    } catch (err) {
      console.error("Error fetching licenses:", err)
      setError(err instanceof Error ? err : new Error("Failed to fetch licenses"))
    } finally {
      setIsLoading(false)
    }
  }

  const refreshData = async () => {
    setIsRefreshing(true)
    await fetchLicenses()
    setIsRefreshing(false)
  }

  useEffect(() => {
    fetchLicenses()
  }, [])

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Licensing & Appointments</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Link href="/licensing/validate-csv">
            <Button variant="outline" className="bg-blue-50">
              <Upload className="mr-2 h-4 w-4" />
              Validate CSV
            </Button>
          </Link>
          <Button className="bg-[#007AFF] hover:bg-[#0056b3]">
            <Plus className="mr-2 h-4 w-4" />
            New License Request
          </Button>
        </div>
      </div>

      {isLoading ? (
        <LicensingTableSkeleton />
      ) : error ? (
        <DataFetchError error={error} entityName="Licenses" refreshAction={refreshData} isRefreshing={isRefreshing} />
      ) : licenses && licenses.length > 0 ? (
        <LicensingTable licenses={licenses} />
      ) : (
        <NoDataMessage entityName="License" entityNamePlural="Licenses" />
      )}
    </div>
  )
}
