"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, RefreshCw, Database } from "lucide-react"
import { Button } from "@/components/ui/button"

async function checkDatabaseConnection() {
  try {
    const response = await fetch("/api/check-db-connection")
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return {
        success: false,
        error: errorData.error || `Server responded with status: ${response.status}`,
      }
    }
    return await response.json()
  } catch (error) {
    console.error("Error checking database connection:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export function DatabaseStatus() {
  const [status, setStatus] = useState<{ success?: boolean; message?: string; error?: string }>({})
  const [isChecking, setIsChecking] = useState(false)

  const checkConnection = async () => {
    setIsChecking(true)
    try {
      const result = await checkDatabaseConnection()
      setStatus(result)
    } catch (error) {
      setStatus({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setIsChecking(false)
    }
  }

  useEffect(() => {
    checkConnection()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5 text-[#007AFF]" />
          Database Connection Status
        </CardTitle>
        <CardDescription>Check the connection to the Neon PostgreSQL database</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {status.success === undefined ? (
                <div className="h-5 w-5 rounded-full border-2 border-gray-300 border-t-transparent animate-spin" />
              ) : status.success ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              <span className="font-medium">
                {status.success === undefined
                  ? "Checking connection..."
                  : status.success
                    ? "Connected to database"
                    : "Connection failed"}
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={checkConnection} disabled={isChecking}>
              {isChecking ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              <span className="ml-2">Refresh</span>
            </Button>
          </div>

          {status.message && (
            <div className="p-3 rounded-md bg-green-50 border border-green-200">
              <p className="text-sm text-green-700">{status.message}</p>
            </div>
          )}

          {status.error && (
            <div className="p-3 rounded-md bg-red-50 border border-red-200">
              <p className="text-sm text-red-700">{status.error}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
