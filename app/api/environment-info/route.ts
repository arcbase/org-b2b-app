import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Get a subset of environment variables that are safe to expose
    // Exclude actual values of sensitive variables
    const safeVariables: Record<string, string> = {
      NODE_ENV: process.env.NODE_ENV || "development",
      API_BASE_URL: process.env.API_BASE_URL ? "[SET]" : "[NOT SET]",
      TOKEN_URL: process.env.TOKEN_URL ? "[SET]" : "[NOT SET]",
      API_CLIENT_ID: process.env.API_CLIENT_ID ? "[SET]" : "[NOT SET]",
      API_CLIENT_SECRET: process.env.API_CLIENT_SECRET ? "[SET]" : "[NOT SET]",
    }

    return NextResponse.json({
      success: true,
      variables: safeVariables,
    })
  } catch (error) {
    console.error("Error getting environment info:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
