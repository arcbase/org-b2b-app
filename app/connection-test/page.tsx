"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle, Database, RefreshCw } from "lucide-react"

export default function ConnectionTestPage() {
  const [testResult, setTestResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const testConnection = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/test-connection")

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()
      setTestResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      console.error("Error testing database connection:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    testConnection()
  }, [])

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-semibold mb-6">Database Connection Test</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-[#007AFF]" />
            Connection Status
          </CardTitle>
          <CardDescription>Detailed database connection information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoading ? (
              <div className="flex items-center gap-2 text-gray-500">
                <RefreshCw className="h-5 w-5 animate-spin" />
                <span>Testing connection...</span>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
                <div>
                  <p className="font-medium text-red-700">Connection failed</p>
                  <p className="text-red-600 text-sm mt-1">{error}</p>
                </div>
              </div>
            ) : testResult ? (
              <div>
                {testResult.success ? (
                  <div className="bg-green-50 border border-green-200 rounded-md p-4 flex items-start mb-4">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                    <div>
                      <p className="font-medium text-green-700">Connection successful</p>
                      <p className="text-green-600 text-sm mt-1">
                        Connected to database: {testResult.connectionInfo.dbName}, schema:{" "}
                        {testResult.connectionInfo.schemaName}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start mb-4">
                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
                    <div>
                      <p className="font-medium text-red-700">Connection failed</p>
                      <p className="text-red-600 text-sm mt-1">{testResult.error}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Database URL:</h3>
                    <div className="bg-gray-100 p-3 rounded-md">
                      <code className="text-sm">{testResult.connectionInfo?.maskedUrl}</code>
                    </div>
                  </div>

                  {testResult.tables && (
                    <div>
                      <h3 className="text-sm font-medium mb-2">Available Tables:</h3>
                      <div className="bg-gray-100 p-3 rounded-md">
                        {testResult.tables.length > 0 ? (
                          <ul className="list-disc list-inside">
                            {testResult.tables.map((table: string) => (
                              <li key={table} className="text-sm">
                                {table}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-amber-600">No tables found in the public schema</p>
                        )}
                      </div>
                    </div>
                  )}

                  {testResult.agentsData && (
                    <div>
                      <h3 className="text-sm font-medium mb-2">Agents Data Sample:</h3>
                      <div className="bg-gray-100 p-3 rounded-md">
                        {testResult.agentsData.length > 0 ? (
                          <pre className="text-xs overflow-x-auto">
                            {JSON.stringify(testResult.agentsData, null, 2)}
                          </pre>
                        ) : (
                          <p className="text-sm text-amber-600">No agent data found</p>
                        )}
                      </div>
                    </div>
                  )}

                  {testResult.agentsError && (
                    <div>
                      <h3 className="text-sm font-medium mb-2">Agents Query Error:</h3>
                      <div className="bg-red-50 p-3 rounded-md">
                        <p className="text-sm text-red-600">{testResult.agentsError}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : null}

            <Button onClick={testConnection} disabled={isLoading}>
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Test Connection Again
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
