import { NextResponse } from "next/server"
import { fetchWithAuth, getAuthToken } from "@/lib/api-utils"

export async function GET() {
  try {
    // First, test environment variables
    const environment = {
      apiBaseUrl: process.env.API_BASE_URL ? "Set" : "Not set",
      tokenUrl: process.env.TOKEN_URL ? "Set" : "Not set",
      clientId: process.env.API_CLIENT_ID ? "Set" : "Not set",
      clientSecret: process.env.API_CLIENT_SECRET ? "Set" : "Not set",
    }

    // Log actual values for debugging (masked for security)
    console.log(
      "API_BASE_URL:",
      process.env.API_BASE_URL ? process.env.API_BASE_URL.substring(0, 10) + "..." : "Not set",
    )
    console.log("TOKEN_URL:", process.env.TOKEN_URL ? process.env.TOKEN_URL.substring(0, 10) + "..." : "Not set")
    console.log("API_CLIENT_ID:", process.env.API_CLIENT_ID ? "Set (masked)" : "Not set")
    console.log("API_CLIENT_SECRET:", process.env.API_CLIENT_SECRET ? "Set (masked)" : "Not set")

    // Test token acquisition
    let tokenTest
    try {
      const token = await getAuthToken()
      tokenTest = {
        success: true,
        message: "Successfully acquired authentication token",
        token_preview: token.substring(0, 10) + "...", // Show just the beginning for verification
      }
    } catch (error) {
      console.error("Token acquisition test failed:", error)
      tokenTest = {
        success: false,
        message: "Failed to acquire authentication token",
        error: error instanceof Error ? error.message : String(error),
      }
    }

    // Test API call if token was successful
    let apiTest = { skipped: true }
    if (tokenTest.success) {
      try {
        // Try a simple GET request to test the connection
        const apiUrl = `${process.env.API_BASE_URL}/health-check`
        console.log(`Testing API connection to: ${apiUrl}`)

        const response = await fetchWithAuth(apiUrl)

        let responseData = "Could not parse response"
        try {
          responseData = await response.text()
          responseData = responseData.substring(0, 100) // Limit length for logging
        } catch (e) {
          // Ignore parsing errors
        }

        apiTest = {
          success: response.ok,
          message: response.ok ? "Successfully connected to external API" : "API request failed",
          status: response.status,
          statusText: response.statusText,
          responsePreview: responseData,
        }
      } catch (error) {
        console.error("API connection test failed:", error)
        apiTest = {
          success: false,
          message: "Failed to connect to external API",
          error: error instanceof Error ? error.message : String(error),
        }
      }
    }

    return NextResponse.json({
      environment,
      tokenTest,
      apiTest,
    })
  } catch (error) {
    console.error("Test proxy error:", error)
    return NextResponse.json(
      {
        error: "An unexpected error occurred during testing",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
