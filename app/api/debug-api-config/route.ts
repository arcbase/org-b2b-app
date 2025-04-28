import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Get the API configuration
    const apiConfig = {
      API_BASE_URL: process.env.API_BASE_URL || "Not set",
      TOKEN_URL: process.env.TOKEN_URL || "Not set",
      API_CLIENT_ID: process.env.API_CLIENT_ID ? "Set (masked)" : "Not set",
      API_CLIENT_SECRET: process.env.API_CLIENT_SECRET ? "Set (masked)" : "Not set",
      NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "Not set",
      // Removed all references to NEXT_PUBLIC_TOKEN
      NEXT_PUBLIC_API_CLIENT_ID: process.env.NEXT_PUBLIC_API_CLIENT_ID ? "Set (masked)" : "Not set",
      NEXT_PUBLIC_API_CLIENT_SECRET: process.env.NEXT_PUBLIC_API_CLIENT_SECRET ? "Set (masked)" : "Not set",
      NEXT_PUBLIC_USE_MOCK_API: process.env.NEXT_PUBLIC_USE_MOCK_API || "Not set",
    }

    // Mask sensitive parts of URLs
    const maskUrl = (url: string) => {
      if (url === "Not set") return url
      try {
        const parsedUrl = new URL(url)
        return `${parsedUrl.protocol}//${parsedUrl.hostname}${parsedUrl.pathname}`
      } catch {
        return "Invalid URL format"
      }
    }

    return NextResponse.json({
      success: true,
      config: {
        ...apiConfig,
        API_BASE_URL: maskUrl(apiConfig.API_BASE_URL),
        TOKEN_URL: maskUrl(apiConfig.TOKEN_URL),
        NEXT_PUBLIC_API_BASE_URL: maskUrl(apiConfig.NEXT_PUBLIC_API_BASE_URL),
        // Removed all references to NEXT_PUBLIC_TOKEN
      },
    })
  } catch (error) {
    console.error("Error in debug-api-config:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
