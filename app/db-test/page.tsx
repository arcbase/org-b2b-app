"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle, Database, RefreshCw } from "lucide-react"

export default function DbTestPage() {
  const [testResult, setTestResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const testConnection = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/test-db-connection")

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
          <CardDescription>Test the connection to your Neon PostgreSQL database</CardDescription>
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
                      <p className="text-green-600 text-sm mt-1">{testResult.connection}</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start mb-4">
                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
                    <div>
                      <p className="font-medium text-red-700">Connection failed</p>
                      <p className="text-red-600 text-sm mt-1">{testResult.error}</p>
                      {testResult.errorStack && (
                        <details className="mt-2">
                          <summary className="text-xs cursor-pointer">Error Stack</summary>
                          <pre className="text-xs mt-1 p-2 bg-red-100 rounded overflow-x-auto">
                            {testResult.errorStack}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Database URL:</h3>
                    <div className="bg-gray-100 p-3 rounded-md">
                      <code className="text-sm">{testResult.databaseUrl}</code>
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

                  {testResult.agentsCount !== undefined && (
                    <div>
                      <h3 className="text-sm font-medium mb-2">Agents Count:</h3>
                      <div className="bg-gray-100 p-3 rounded-md">
                        <p className="text-sm">{testResult.agentsCount} agents found in database</p>
                      </div>
                    </div>
                  )}

                  {testResult.rawResults && (
                    <div>
                      <h3 className="text-sm font-medium mb-2">Raw Query Results:</h3>
                      <details>
                        <summary className="text-xs cursor-pointer">View raw results</summary>
                        <div className="bg-gray-100 p-3 rounded-md mt-2">
                          <pre className="text-xs overflow-x-auto">
                            {JSON.stringify(testResult.rawResults, null, 2)}
                          </pre>
                        </div>
                      </details>
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
