"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, Key } from "lucide-react"

export function DatabaseConnectionInfo() {
  const [showConnectionString, setShowConnectionString] = useState(false)
  const [connectionString, setConnectionString] = useState<string | null>(null)

  const fetchConnectionInfo = async () => {
    try {
      const response = await fetch("/api/db-connection-info")
      if (response.ok) {
        const data = await response.json()
        setConnectionString(data.connectionString)
      } else {
        setConnectionString("Error fetching connection info")
      }
    } catch (error) {
      setConnectionString("Error: " + (error instanceof Error ? error.message : "Unknown error"))
    }
  }

  // Mask the connection string to hide sensitive information
  const getMaskedConnectionString = () => {
    if (!connectionString) return null

    try {
      // For postgres:// URLs, mask the password and other sensitive parts
      if (connectionString.startsWith("postgres://") || connectionString.startsWith("postgresql://")) {
        return connectionString.replace(/(postgres(?:ql)?:\/\/[^:]+:)([^@]+)(@.+)/, "$1******$3")
      }
      return "Connection string format not recognized"
    } catch {
      return "Unable to parse connection string"
    }
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5 text-[#007AFF]" />
          Database Connection Information
        </CardTitle>
        <CardDescription>Check your database connection string (sensitive information is masked)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {!connectionString ? (
            <Button onClick={fetchConnectionInfo}>Check Connection String</Button>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Connection String:</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowConnectionString(!showConnectionString)}>
                  {showConnectionString ? (
                    <>
                      <EyeOff className="h-4 w-4 mr-2" /> Hide
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-2" /> Show
                    </>
                  )}
                </Button>
              </div>
              <div className="p-3 bg-gray-100 rounded-md overflow-x-auto">
                <code className="text-sm">{showConnectionString ? connectionString : getMaskedConnectionString()}</code>
              </div>
              <p className="text-sm text-muted-foreground">
                Make sure your DATABASE_URL environment variable is correctly set in your .env file or deployment
                platform.
              </p>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
