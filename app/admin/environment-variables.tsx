"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, Key } from "lucide-react"

export function EnvironmentVariables() {
  const [showVariables, setShowVariables] = useState(false)
  const [variables, setVariables] = useState<Record<string, string> | null>(null)

  const fetchEnvironmentInfo = async () => {
    try {
      const response = await fetch("/api/environment-info")
      if (response.ok) {
        const data = await response.json()
        setVariables(data.variables)
      } else {
        setVariables({ error: "Error fetching environment info" })
      }
    } catch (error) {
      setVariables({ error: "Error: " + (error instanceof Error ? error.message : "Unknown error") })
    }
  }

  // Mask sensitive information
  const getMaskedValue = (key: string, value: string) => {
    if (!showVariables) {
      // Mask sensitive values
      if (
        key.includes("SECRET") ||
        key.includes("KEY") ||
        key.includes("PASSWORD") ||
        key.includes("TOKEN") ||
        key.includes("URL")
      ) {
        return "••••••••••••••••"
      }
    }
    return value
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5 text-[#007AFF]" />
          Environment Variables
        </CardTitle>
        <CardDescription>Check your environment variables (sensitive information is masked)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {!variables ? (
            <Button onClick={fetchEnvironmentInfo}>Check Environment Variables</Button>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Environment Variables:</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowVariables(!showVariables)}>
                  {showVariables ? (
                    <>
                      <EyeOff className="h-4 w-4 mr-2" /> Hide Values
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-2" /> Show Values
                    </>
                  )}
                </Button>
              </div>
              <div className="p-3 bg-gray-100 rounded-md overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-2">Variable</th>
                      <th className="text-left py-2 px-2">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(variables).map(([key, value]) => (
                      <tr key={key} className="border-b">
                        <td className="py-2 px-2 font-medium">{key}</td>
                        <td className="py-2 px-2 font-mono">{getMaskedValue(key, value)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-muted-foreground">
                Required variables for API integration: API_BASE_URL, TOKEN_URL, API_CLIENT_ID, API_CLIENT_SECRET
              </p>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
