"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle, Database, RefreshCw } from "lucide-react"

export function DatabaseDiagnostics() {
  const [diagnosticResults, setDiagnosticResults] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const runDiagnostics = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/admin/database-diagnostics")

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()
      setDiagnosticResults(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      console.error("Error running database diagnostics:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    runDiagnostics()
  }, [])

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5 text-[#007AFF]" />
          Database Diagnostics
        </CardTitle>
        <CardDescription>Comprehensive diagnostics for your database connection</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {isLoading ? (
            <div className="flex items-center gap-2 text-gray-500">
              <RefreshCw className="h-5 w-5 animate-spin" />
              <span>Running diagnostics...</span>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
              <div>
                <p className="font-medium text-red-700">Diagnostics failed</p>
                <p className="text-red-600 text-sm mt-1">{error}</p>
              </div>
            </div>
          ) : diagnosticResults ? (
            <>
              {/* Connection Info */}
              <div>
                <h3 className="text-md font-medium mb-3">Connection Information</h3>
                <div className="bg-gray-50 rounded-md border p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Database URL (masked):</p>
                      <code className="text-xs bg-gray-100 p-1 rounded">
                        {diagnosticResults.connectionInfo.maskedUrl}
                      </code>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Connection Status:</p>
                      {diagnosticResults.connection.success ? (
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          <span className="text-sm">Connected</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-red-600">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          <span className="text-sm">Failed</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {diagnosticResults.connection.error && (
                    <div className="mt-3 bg-red-50 p-3 rounded-md text-red-700 text-sm">
                      {diagnosticResults.connection.error}
                    </div>
                  )}
                </div>
              </div>

              {/* Table Existence */}
              <div>
                <h3 className="text-md font-medium mb-3">Table Existence Check</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(diagnosticResults.tables).map(([tableName, result]: [string, any]) => (
                    <div
                      key={tableName}
                      className={`p-4 rounded-md border ${
                        result.exists ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{tableName}</span>
                        {result.exists ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                      <p className={`text-sm ${result.exists ? "text-green-600" : "text-red-600"}`}>
                        {result.exists ? "Table exists" : "Table does not exist"}
                      </p>
                      {result.error && <p className="text-xs text-red-600 mt-1">{result.error}</p>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Query Tests */}
              <div>
                <h3 className="text-md font-medium mb-3">Query Tests</h3>
                <div className="space-y-4">
                  {Object.entries(diagnosticResults.queries).map(([tableName, result]: [string, any]) => (
                    <div key={tableName} className="border rounded-md">
                      <div className="bg-gray-50 p-3 border-b font-medium">
                        Query: SELECT * FROM {tableName} LIMIT 1
                      </div>
                      <div className="p-4">
                        {result.success ? (
                          <>
                            <div className="flex items-center text-green-600 mb-2">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              <span className="text-sm">Query successful</span>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-md">
                              <p className="text-xs font-medium mb-1">Result:</p>
                              <pre className="text-xs overflow-x-auto">{JSON.stringify(result.data, null, 2)}</pre>
                            </div>
                          </>
                        ) : (
                          <div className="flex items-start text-red-600">
                            <AlertCircle className="h-4 w-4 mr-1 mt-0.5" />
                            <div>
                              <p className="text-sm">Query failed</p>
                              {result.error && <p className="text-xs mt-1">{result.error}</p>}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Environment Variables */}
              <div>
                <h3 className="text-md font-medium mb-3">Environment Variables</h3>
                <div className="bg-gray-50 rounded-md border p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(diagnosticResults.env).map(([key, value]: [string, any]) => (
                      <div key={key} className="flex justify-between p-2 bg-gray-100 rounded-md">
                        <span className="font-medium text-sm">{key}:</span>
                        <span className="text-sm">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : null}

          <Button onClick={runDiagnostics} disabled={isLoading} className="mt-4">
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Running Diagnostics...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Run Diagnostics Again
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
