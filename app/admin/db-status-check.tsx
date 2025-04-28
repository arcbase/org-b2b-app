"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle, Database, RefreshCw } from "lucide-react"

export function DbStatusCheck() {
  const [status, setStatus] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const checkStatus = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/check-db-status")

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()
      setStatus(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      console.error("Error checking database status:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkStatus()
  }, [])

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5 text-[#007AFF]" />
          Database Status Check
        </CardTitle>
        <CardDescription>Check if your database is initialized and seeded with data</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center gap-2 text-gray-500">
              <RefreshCw className="h-5 w-5 animate-spin" />
              <span>Checking database status...</span>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
              <div>
                <p className="font-medium text-red-700">Status check failed</p>
                <p className="text-red-600 text-sm mt-1">{error}</p>
              </div>
            </div>
          ) : status ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  className={`p-4 rounded-md border ${status.initialized ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Database Initialized</span>
                    {status.initialized ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  <p className={`text-sm ${status.initialized ? "text-green-700" : "text-red-700"}`}>
                    {status.initialized
                      ? "All required tables exist in the database"
                      : "Database tables have not been initialized"}
                  </p>
                </div>

                <div
                  className={`p-4 rounded-md border ${status.seeded ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Database Seeded</span>
                    {status.seeded ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-amber-500" />
                    )}
                  </div>
                  <p className={`text-sm ${status.seeded ? "text-green-700" : "text-amber-700"}`}>
                    {status.seeded ? "Database contains sample data" : "Database has no data. Please seed the database"}
                  </p>
                </div>
              </div>

              {status.initialized && (
                <div>
                  <h3 className="text-sm font-medium mb-2">Table Record Counts:</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {Object.entries(status.tableData || {}).map(([table, count]) => (
                      <div key={table} className="p-3 bg-gray-50 rounded-md text-center">
                        <p className="text-xs text-gray-500 mb-1">{table}</p>
                        <p className={`font-medium ${Number(count) > 0 ? "text-green-600" : "text-amber-600"}`}>
                          {count} records
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!status.initialized && (
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <p className="text-blue-700 text-sm">
                    Please initialize the database by clicking the "Initialize Database" button below.
                  </p>
                </div>
              )}

              {status.initialized && !status.seeded && (
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <p className="text-blue-700 text-sm">
                    Please seed the database with sample data by clicking the "Seed Database" button below.
                  </p>
                </div>
              )}
            </div>
          ) : null}

          <Button onClick={checkStatus} disabled={isLoading}>
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Checking...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Check Again
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
