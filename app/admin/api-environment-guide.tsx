"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText } from "lucide-react"

export function ApiEnvironmentGuide() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-[#007AFF]" />
          API Environment Variables Guide
        </CardTitle>
        <CardDescription>Required environment variables for the Policy Admin API integration</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm">
            To connect to the Policy Admin API, you need to set the following environment variables:
          </p>

          <div className="bg-gray-50 p-4 rounded-md border">
            <h3 className="font-medium mb-2">Required Environment Variables</h3>
            <ul className="list-disc list-inside space-y-2">
              <li className="text-sm">
                <code className="bg-gray-100 px-1 py-0.5 rounded">API_BASE_URL</code> - The base URL of the Policy Admin
                API
              </li>
              <li className="text-sm">
                <code className="bg-gray-100 px-1 py-0.5 rounded">TOKEN_URL</code> - The URL for obtaining
                authentication tokens
              </li>
              <li className="text-sm">
                <code className="bg-gray-100 px-1 py-0.5 rounded">API_CLIENT_ID</code> - Your client ID for API
                authentication
              </li>
              <li className="text-sm">
                <code className="bg-gray-100 px-1 py-0.5 rounded">API_CLIENT_SECRET</code> - Your client secret for API
                authentication
              </li>
            </ul>
          </div>

          <div className="bg-gray-50 p-4 rounded-md border">
            <h3 className="font-medium mb-2">Optional Environment Variables</h3>
            <ul className="list-disc list-inside space-y-2">
              <li className="text-sm">
                <code className="bg-gray-100 px-1 py-0.5 rounded">NEXT_PUBLIC_USE_MOCK_API</code> - Set to "true" to use
                mock API data instead of real API calls
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
            <h3 className="font-medium mb-2 text-blue-800">Example .env.local File</h3>
            <pre className="bg-white p-3 rounded-md text-xs overflow-x-auto">
              {`# Policy Admin API Configuration
API_BASE_URL=https://api.policyadmin.example.com/v1
TOKEN_URL=https://auth.policyadmin.example.com/oauth2/token
API_CLIENT_ID=your-client-id
API_CLIENT_SECRET=your-client-secret

# Optional Configuration
NEXT_PUBLIC_USE_MOCK_API=false`}
            </pre>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
