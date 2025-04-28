import { sql } from "@/lib/db"

export default async function DiagnosticsPage() {
  const diagnosticResults = await runDiagnostics()

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-semibold mb-6">Database Diagnostics</h1>

      <div className="bg-white rounded-md border p-6 mb-6">
        <h2 className="text-xl font-medium mb-4">Database Connection</h2>
        <div className="bg-gray-100 p-4 rounded-md mb-4">
          <h3 className="font-medium mb-2">Connection URL (masked)</h3>
          <code className="text-sm break-all">{diagnosticResults.connectionInfo.maskedUrl}</code>

          <h3 className="font-medium mt-4 mb-2">Connection Test</h3>
          <div className={`p-3 rounded-md ${diagnosticResults.connection.success ? "bg-green-50" : "bg-red-50"}`}>
            <p className={diagnosticResults.connection.success ? "text-green-700" : "text-red-700"}>
              {diagnosticResults.connection.message}
            </p>
            {diagnosticResults.connection.error && (
              <p className="text-red-600 mt-2">{diagnosticResults.connection.error}</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-md border p-6 mb-6">
        <h2 className="text-xl font-medium mb-4">Table Existence Tests</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(diagnosticResults.tables).map(([tableName, result]) => (
            <div
              key={tableName}
              className={`p-4 rounded-md ${
                result.exists ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
              }`}
            >
              <h3 className="font-medium mb-2">{tableName}</h3>
              <p className={result.exists ? "text-green-700" : "text-red-700"}>
                {result.exists ? "Table exists" : "Table does not exist"}
              </p>
              {result.error && <p className="text-red-600 mt-2 text-sm">{result.error}</p>}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-md border p-6 mb-6">
        <h2 className="text-xl font-medium mb-4">Query Tests</h2>
        <div className="space-y-4">
          {Object.entries(diagnosticResults.queries).map(([tableName, result]) => (
            <div key={tableName} className="border rounded-md">
              <div className="bg-gray-50 p-3 border-b font-medium">Query: SELECT * FROM {tableName} LIMIT 1</div>
              <div className="p-4">
                {result.success ? (
                  <>
                    <div className="flex items-center text-green-700 mb-2">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Query executed successfully
                    </div>
                    <div className="bg-gray-100 p-3 rounded-md">
                      <h4 className="font-medium mb-2">Result:</h4>
                      <pre className="text-xs overflow-x-auto">{JSON.stringify(result.data, null, 2)}</pre>
                    </div>
                  </>
                ) : (
                  <div className="flex items-start text-red-700">
                    <svg className="w-5 h-5 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div>
                      <p>Query failed</p>
                      {result.error && <p className="text-sm mt-1">{result.error}</p>}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-md border p-6">
        <h2 className="text-xl font-medium mb-4">Environment Variables</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(diagnosticResults.env).map(([key, value]) => (
            <div key={key} className="flex justify-between p-3 bg-gray-100 rounded-md">
              <span className="font-medium">{key}:</span>
              <span>{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

async function runDiagnostics() {
  // Get the database URL (masked for security)
  const dbUrl = process.env.DATABASE_URL || ""
  let maskedUrl = "Not set"

  if (dbUrl) {
    try {
      const url = new URL(dbUrl)
      maskedUrl = `${url.protocol}//${url.username}:****@${url.host}${url.pathname}`
    } catch (e) {
      maskedUrl = "Invalid URL format"
    }
  }

  const results = {
    connectionInfo: {
      maskedUrl,
    },
    connection: {
      success: false,
      message: "",
      error: null as string | null,
    },
    tables: {
      firms: { exists: false, error: null as string | null },
      advisor_firms: { exists: false, error: null as string | null },
      advisors: { exists: false, error: null as string | null },
      agents: { exists: false, error: null as string | null },
      licenses: { exists: false, error: null as string | null },
    },
    queries: {
      firms: { success: false, error: null as string | null, data: null as any },
      advisor_firms: { success: false, error: null as string | null, data: null as any },
      advisors: { success: false, error: null as string | null, data: null as any },
      agents: { success: false, error: null as string | null, data: null as any },
    },
    env: {
      DATABASE_URL: process.env.DATABASE_URL ? "Set (masked)" : "Not set",
      POSTGRES_URL: process.env.POSTGRES_URL ? "Set (masked)" : "Not set",
      POSTGRES_PRISMA_URL: process.env.POSTGRES_PRISMA_URL ? "Set (masked)" : "Not set",
      POSTGRES_URL_NON_POOLING: process.env.POSTGRES_URL_NON_POOLING ? "Set (masked)" : "Not set",
      POSTGRES_URL_NO_SSL: process.env.POSTGRES_URL_NO_SSL ? "Set (masked)" : "Not set",
      NODE_ENV: process.env.NODE_ENV || "Not set",
    },
  }

  // Test 1: Basic connection
  try {
    const connectionResult = await sql`SELECT NOW() as time`
    results.connection.success = true
    results.connection.message = `Connected successfully. Server time: ${
      connectionResult?.rows?.[0]?.time || "unknown"
    }`
  } catch (error) {
    results.connection.success = false
    results.connection.message = "Failed to connect to database"
    results.connection.error = error instanceof Error ? error.message : String(error)
  }

  // Test 2: Check if tables exist
  for (const table of Object.keys(results.tables)) {
    try {
      // Use parameterized queries with the sql tag function instead of string interpolation
      const tableExistsResult = await sql`
        SELECT EXISTS (
          SELECT 1 FROM information_schema.tables 
          WHERE table_schema = 'public' AND table_name = ${table}
        )
      `

      // Extract the exists value
      let tableExists = false
      if (Array.isArray(tableExistsResult) && tableExistsResult.length > 0) {
        tableExists = tableExistsResult[0].exists === true
      } else if (tableExistsResult?.rows && tableExistsResult.rows.length > 0) {
        tableExists = tableExistsResult.rows[0].exists === true
      }

      results.tables[table as keyof typeof results.tables].exists = tableExists
    } catch (error) {
      results.tables[table as keyof typeof results.tables].error =
        error instanceof Error ? error.message : String(error)
    }
  }

  // Test 3: Try to query each table
  for (const table of Object.keys(results.queries)) {
    try {
      // Only attempt to query if the table exists
      if (results.tables[table as keyof typeof results.tables].exists) {
        // Use parameterized queries with the sql tag function
        const queryResult = await sql`SELECT * FROM ${sql.identifier([table])} LIMIT 1`
        results.queries[table as keyof typeof results.queries].success = true
        results.queries[table as keyof typeof results.queries].data = Array.isArray(queryResult)
          ? queryResult
          : queryResult.rows || []
      } else {
        results.queries[table as keyof typeof results.queries].error = `Table '${table}' does not exist`
      }
    } catch (error) {
      results.queries[table as keyof typeof results.queries].success = false
      results.queries[table as keyof typeof results.queries].error =
        error instanceof Error ? error.message : String(error)
    }
  }

  return results
}
