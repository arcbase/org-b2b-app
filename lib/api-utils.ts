/**
 * Utility functions for API authentication and requests
 */

// Cache the token and its expiration
let cachedToken: string | null = null
let tokenExpiration: number | null = null

/**
 * Get a valid authentication token, fetching a new one if necessary
 */
export async function getAuthToken(): Promise<string> {
  // Check if we have a valid cached token
  if (cachedToken && tokenExpiration && Date.now() < tokenExpiration) {
    console.log("[API Utils] Using cached token")
    return cachedToken
  }

  // Token is missing or expired, fetch a new one
  try {
    // Check if all required environment variables are set
    if (!process.env.TOKEN_URL) throw new Error("TOKEN_URL environment variable is not set")
    if (!process.env.API_CLIENT_ID) throw new Error("API_CLIENT_ID environment variable is not set")
    if (!process.env.API_CLIENT_SECRET) throw new Error("API_CLIENT_SECRET environment variable is not set")

    console.log("Attempting to fetch token from:", process.env.TOKEN_URL)

    // Standard OAuth2 client credentials flow with form-encoded parameters
    const formData = new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.API_CLIENT_ID,
      client_secret: process.env.API_CLIENT_SECRET,
    })

    const response = await fetch(process.env.TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: formData.toString(),
    })

    console.log(`Token response status: ${response.status} ${response.statusText}`)
    console.log("Token response headers:", Object.fromEntries([...response.headers.entries()]))

    // Check content type to ensure we're getting JSON back
    const contentType = response.headers.get("content-type")
    if (contentType && !contentType.includes("application/json")) {
      console.error(`Unexpected content type: ${contentType}`)

      // Get response content for debugging
      const responseText = await response.text()
      console.error("Non-JSON response:", responseText.substring(0, 500))

      throw new Error(`Token endpoint returned non-JSON response with content type: ${contentType}`)
    }

    // Get response content for debugging
    const responseText = await response.text()
    console.log("Response content preview:", responseText.substring(0, 200))

    if (!response.ok) {
      throw new Error(`Failed to get auth token: ${response.status} ${responseText.substring(0, 200)}`)
    }

    // Try to parse the response as JSON
    let data
    try {
      data = JSON.parse(responseText)
    } catch (e) {
      throw new Error(`Failed to parse token response as JSON: ${responseText.substring(0, 200)}`)
    }

    // Check if we received an access token
    if (!data.access_token) {
      throw new Error(`No access token in response: ${JSON.stringify(data)}`)
    }

    // Cache the token and set expiration
    cachedToken = data.access_token
    const expiresIn = data.expires_in || 3600
    tokenExpiration = Date.now() + (expiresIn - 300) * 1000

    console.log("[API Utils] Successfully obtained new token")
    return cachedToken
  } catch (error) {
    console.error("Error getting auth token:", error)
    throw error
  }
}

/**
 * Make an authenticated API request
 */
export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  try {
    const token = await getAuthToken()

    // Merge the authorization header with any existing headers
    const headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    }

    console.log(`[fetchWithAuth] Making request to: ${url}`)
    console.log(`[fetchWithAuth] Request method: ${options.method || "GET"}`)
    console.log(`[fetchWithAuth] Request headers:`, headers)

    if (options.body) {
      console.log(
        `[fetchWithAuth] Request body preview:`,
        typeof options.body === "string" ? options.body.substring(0, 200) : "Non-string body",
      )
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    console.log(`[fetchWithAuth] Response status: ${response.status} ${response.statusText}`)
    console.log(`[fetchWithAuth] Response headers:`, Object.fromEntries([...response.headers.entries()]))

    return response
  } catch (error) {
    console.error(`Error in fetchWithAuth for URL ${url}:`, error)
    throw error
  }
}
