// Environment configuration helper

// API configuration
export const API_CONFIG = {
  // Base URL for the API
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL || "https://onyx-api.test.gainbridge.life",

  // Token URL for authentication - REMOVED NEXT_PUBLIC prefix
  TOKEN_URL: process.env.TOKEN_URL || "https://auth.test.gainbridge.life/oauth2/token",

  // Client credentials
  CLIENT_ID: process.env.API_CLIENT_ID || "",
  CLIENT_SECRET: process.env.API_CLIENT_SECRET || "",

  // Feature flags
  USE_MOCK_API: process.env.NEXT_PUBLIC_USE_MOCK_API === "true" || false,
  FALLBACK_TO_MOCK: process.env.NEXT_PUBLIC_FALLBACK_TO_MOCK === "true" || false,

  // Logging
  VERBOSE_LOGGING: process.env.NEXT_PUBLIC_VERBOSE_LOGGING === "true" || true,
}

// Helper function to check if all required API credentials are set
export function areApiCredentialsSet(): boolean {
  return !!(API_CONFIG.BASE_URL && API_CONFIG.TOKEN_URL && API_CONFIG.CLIENT_ID && API_CONFIG.CLIENT_SECRET)
}

// Helper function to get a masked version of a URL or credential for logging
export function getMaskedValue(value: string, type: "url" | "credential"): string {
  if (!value) return "Not set"

  if (type === "url") {
    try {
      const url = new URL(value)
      return `${url.protocol}//${url.hostname}${url.pathname}`
    } catch {
      return "Invalid URL format"
    }
  } else {
    // For credentials, just show first 4 chars
    return value.substring(0, 4) + "..." + value.substring(value.length - 4)
  }
}

// Log the current configuration (safe for production)
export function logApiConfig(): void {
  console.log("[ENV CONFIG] API Configuration:")
  console.log(`[ENV CONFIG] BASE_URL: ${getMaskedValue(API_CONFIG.BASE_URL, "url")}`)
  console.log(`[ENV CONFIG] TOKEN_URL: ${getMaskedValue(API_CONFIG.TOKEN_URL, "url")}`)
  console.log(`[ENV CONFIG] CLIENT_ID: ${API_CONFIG.CLIENT_ID ? "Set" : "Not set"}`)
  console.log(`[ENV CONFIG] CLIENT_SECRET: ${API_CONFIG.CLIENT_SECRET ? "Set" : "Not set"}`)
  console.log(`[ENV CONFIG] USE_MOCK_API: ${API_CONFIG.USE_MOCK_API}`)
  console.log(`[ENV CONFIG] FALLBACK_TO_MOCK: ${API_CONFIG.FALLBACK_TO_MOCK}`)
}
