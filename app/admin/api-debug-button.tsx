"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bug, Loader2 } from "lucide-react"

export function ApiDebugButton() {
  const [isLoading, setIsLoading] = useState(false)
  const [apiConfig, setApiConfig] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const checkApiConfig = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/debug-api-config")

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()
      setApiConfig(data.config)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      console.error("Error checking API config:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bug className="h-5 w-5 text-[#007AFF]" />
          API Configuration Debug
        </CardTitle>
        <CardDescription>Check the current API configuration settings</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button onClick={checkApiConfig} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Checking...
              </>
            ) : (
              "Check API Configuration"
            )}
          </Button>

          {error && (
            <div className="bg-red-50 border border-red-200 p-3 rounded-md">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {apiConfig && (
            <div className="bg-gray-50 border p-4 rounded-md">
              <h3 className="font-medium mb-2">API Configuration</h3>
              <div className="space-y-2">
                {Object.entries(apiConfig).map(([key, value]) => (
                  <div key={key} className="grid grid-cols-2 gap-2">
                    <div className="font-mono text-sm">{key}</div>
                    <div className="font-mono text-sm">{value as string}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
