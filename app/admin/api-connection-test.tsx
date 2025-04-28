"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, RefreshCw, Globe } from "lucide-react"

export function ApiConnectionTest() {
  const [testResults, setTestResults] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const runConnectionTest = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/test-proxy")
      const data = await response.json()
      setTestResults(data)
    } catch (error) {
      setTestResults({
        error: error instanceof Error ? error.message : "Unknown error occurred",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-[#007AFF]" />
          API Connection Test
        </CardTitle>
        <CardDescription>Verify connection to the external API</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button onClick={runConnectionTest} disabled={isLoading} className="w-full">
            {isLoading ? (
              <span className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin" />
                Testing Connection...
              </span>
            ) : (
              "Test API Connection"
            )}
          </Button>

          {testResults && (
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Environment Variables:</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {Object.entries(testResults.environment || {}).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="font-medium">{key}:</span>
                      <span className={value === "Set" ? "text-green-600" : "text-red-600"}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Token Acquisition:</h3>
                <div
                  className={`p-3 rounded-md ${testResults.tokenTest?.success ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}
                >
                  <div className="flex items-start gap-2">
                    {testResults.tokenTest?.success ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                    )}
                    <div>
                      <p className={`text-sm ${testResults.tokenTest?.success ? "text-green-700" : "text-red-700"}`}>
                        {testResults.tokenTest?.message}
                      </p>
                      {testResults.tokenTest?.error && (
                        <p className="text-xs text-red-600 mt-1">{testResults.tokenTest.error}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {!testResults.apiTest?.skipped && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">API Connection:</h3>
                  <div
                    className={`p-3 rounded-md ${testResults.apiTest?.success ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}
                  >
                    <div className="flex items-start gap-2">
                      {testResults.apiTest?.success ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                      )}
                      <div>
                        <p className={`text-sm ${testResults.apiTest?.success ? "text-green-700" : "text-red-700"}`}>
                          {testResults.apiTest?.message}
                        </p>
                        {testResults.apiTest?.status && (
                          <p className="text-xs text-green-600 mt-1">
                            Status: {testResults.apiTest.status} {testResults.apiTest.statusText}
                          </p>
                        )}
                        {testResults.apiTest?.error && (
                          <p className="text-xs text-red-600 mt-1">{testResults.apiTest.error}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {testResults.error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-700">{testResults.error}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
