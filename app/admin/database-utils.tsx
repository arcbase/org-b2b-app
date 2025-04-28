"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { initDatabase } from "@/app/actions/init-database"
import { seedDatabase } from "@/app/actions/seed-database"
import { AlertCircle, CheckCircle, Database, RefreshCw } from "lucide-react"
import { useState } from "react"

export function DatabaseUtils() {
  const [initStatus, setInitStatus] = useState<{ success?: boolean; message?: string }>({})
  const [seedStatus, setSeedStatus] = useState<{ success?: boolean; message?: string }>({})
  const [isInitializing, setIsInitializing] = useState(false)
  const [isSeeding, setIsSeeding] = useState(false)

  const handleInitDatabase = async () => {
    setIsInitializing(true)
    setInitStatus({})
    try {
      const result = await initDatabase()
      setInitStatus(result)
    } catch (error) {
      setInitStatus({
        success: false,
        message: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      })
    } finally {
      setIsInitializing(false)
    }
  }

  const handleSeedDatabase = async () => {
    setIsSeeding(true)
    setSeedStatus({})
    try {
      const result = await seedDatabase()
      setSeedStatus(result)
    } catch (error) {
      setSeedStatus({
        success: false,
        message: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      })
    } finally {
      setIsSeeding(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5 text-[#007AFF]" />
          Database Utilities
        </CardTitle>
        <CardDescription>Initialize and seed the database</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Card className="shadow-none">
            <CardContent className="grid gap-4">
              <Button onClick={handleInitDatabase} disabled={isInitializing}>
                {isInitializing ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Initializing...
                  </span>
                ) : (
                  "Initialize Database"
                )}
              </Button>
              {initStatus.message && (
                <div
                  className={`p-3 rounded-md ${initStatus.success ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}
                >
                  <div className="flex items-start gap-2">
                    {initStatus.success ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                    )}
                    <p className={`text-sm ${initStatus.success ? "text-green-700" : "text-red-700"}`}>
                      {initStatus.message}
                    </p>
                  </div>
                </div>
              )}
              <p className="text-sm text-muted-foreground">
                This will create all necessary tables in the database if they don't already exist.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-none">
            <CardContent className="grid gap-4">
              <Button onClick={handleSeedDatabase} disabled={isSeeding}>
                {isSeeding ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Seeding...
                  </span>
                ) : (
                  "Seed Database"
                )}
              </Button>
              {seedStatus.message && (
                <div
                  className={`p-3 rounded-md ${seedStatus.success ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}
                >
                  <div className="flex items-start gap-2">
                    {seedStatus.success ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                    )}
                    <p className={`text-sm ${seedStatus.success ? "text-green-700" : "text-red-700"}`}>
                      {seedStatus.message}
                    </p>
                  </div>
                </div>
              )}
              <p className="text-sm text-muted-foreground">
                This will populate the database with sample data for testing.
              </p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}
