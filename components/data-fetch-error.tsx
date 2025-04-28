"use client"

import { AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface DataFetchErrorProps {
  error: Error | string
  entityName: string
  refreshAction?: () => void
  isRefreshing?: boolean
}

export function DataFetchError({ error, entityName, refreshAction, isRefreshing }: DataFetchErrorProps) {
  const errorMessage = typeof error === "string" ? error : error.message

  // Update the isTableNotExistError check to be more specific
  const isTableNotExistError =
    errorMessage.includes("table does not exist") ||
    (errorMessage.includes("relation") && errorMessage.includes("does not exist"))

  // Add a database connection error check
  const isConnectionError =
    errorMessage.includes("connection") ||
    errorMessage.includes("connect to") ||
    errorMessage.includes("ECONNREFUSED") ||
    errorMessage.includes("database connection")

  return (
    <div className="bg-white rounded-md border p-8 text-center">
      <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
      <h2 className="text-xl font-medium mb-2">Error Loading {entityName}</h2>

      {isTableNotExistError ? (
        <div>
          <p className="text-gray-700 mb-4">The database tables haven't been initialized yet. You need to:</p>
          <ol className="text-left mx-auto max-w-md mb-4 space-y-2">
            <li className="flex items-start">
              <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                1
              </span>
              <span>
                Go to the <strong>Admin</strong> page
              </span>
            </li>
            <li className="flex items-start">
              <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                2
              </span>
              <span>
                Click <strong>Initialize Database</strong> to create the tables
              </span>
            </li>
            <li className="flex items-start">
              <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                3
              </span>
              <span>
                Click <strong>Seed Database</strong> to populate with sample data
              </span>
            </li>
          </ol>
        </div>
      ) : isConnectionError ? (
        <div>
          <p className="text-gray-700 mb-4">There appears to be a database connection issue:</p>
          <div className="text-left mx-auto max-w-md mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 font-medium break-words">{errorMessage}</p>
          </div>
          <p className="text-gray-700 mb-4">Please check your database connection settings in the Admin page.</p>
        </div>
      ) : (
        <div>
          <p className="text-gray-700 mb-4">There was a problem fetching the data:</p>
          <div className="text-left mx-auto max-w-md mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 font-medium break-words">{errorMessage}</p>
          </div>
        </div>
      )}

      <div className="flex justify-center gap-4">
        <Link href="/admin">
          <Button variant="outline">Go to Admin Page</Button>
        </Link>
        {refreshAction && (
          <Button onClick={refreshAction} disabled={isRefreshing}>
            {isRefreshing ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  )
}
