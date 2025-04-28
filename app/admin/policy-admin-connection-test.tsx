"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react"

export function PolicyAdminConnectionTest() {
  const [isLoading, setIsLoading] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [apiDetails, setApiDetails] = useState<any>(null)

  const testConnection = async () => {
    setIsLoading(true)
    setConnectionStatus("idle")
    setErrorMessage(null)
    setApiDetails(null)

    try {
      // Test the connection to the policy admin API
      const response = await fetch("/api/test-policy-admin", {
        method: "GET",
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setConnectionStatus("success")
        setApiDetails({
          endpoint: data.endpoint,
          status: data.status,
          statusText: data.statusText,
          responsePreview: data.responsePreview,
        })
      } else {
        setConnectionStatus("error")
        setErrorMessage(data.error || "Unknown error occurred")
      }
    } catch (error) {
      setConnectionStatus("error")
      setErrorMessage("Failed to connect to the policy admin API")
      console.error("Error testing policy admin connection:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Policy Admin API Connection</CardTitle>
        <CardDescription>
          Test the connection to the Policy Admin System API for agent search and management
        </CardDescription>
      </CardHeader>
      <CardContent>
        {connectionStatus === "success" && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-md">
              <CheckCircle className="h-5 w-5" />
              <span>Successfully connected to the Policy Admin API</span>
            </div>

            {apiDetails && (
              <div className="mt-3 bg-gray-50 p-3 rounded-md border">
                <h3 className="text-sm font-medium mb-2">API Details</h3>
                <p className="text-sm">Endpoint: {apiDetails.endpoint || "Unknown"}</p>
                {apiDetails.status && (
                  <p className="text-sm">
                    Response: {apiDetails.status} {apiDetails.statusText}
                    {apiDetails.status !== 200 && (
                      <span className="text-amber-600 ml-2">(Non-200 response, but connection successful)</span>
                    )}
                  </p>
                )}
                {apiDetails.responsePreview && typeof apiDetails.responsePreview === "object" && (
                  <div className="mt-2 text-xs">
                    <p>GraphQL Response:</p>
                    <ul className="list-disc list-inside mt-1">
                      {apiDetails.responsePreview.hasData && <li className="text-green-600">Response contains data</li>}
                      {apiDetails.responsePreview.hasErrors && (
                        <li className="text-amber-600">Response contains errors (may be permission related)</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {connectionStatus === "error" && (
          <div className="flex items-start gap-2 text-red-600 bg-red-50 p-3 rounded-md">
            <AlertCircle className="h-5 w-5 mt-0.5" />
            <div>
              <p className="font-medium">Connection failed</p>
              <p className="text-sm">{errorMessage}</p>
              <div className="mt-3">
                <p className="text-xs font-medium">Troubleshooting steps:</p>
                <ul className="list-disc list-inside text-xs mt-1">
                  <li>Check that all API environment variables are correctly set</li>
                  <li>Verify that the API base URL is correct</li>
                  <li>Ensure your client credentials are valid</li>
                  <li>Check if the API requires specific headers or parameters</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={testConnection} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Testing Connection...
            </>
          ) : (
            "Test Policy Admin API Connection"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
