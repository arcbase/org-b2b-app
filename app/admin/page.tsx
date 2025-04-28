import { Suspense } from "react"
import { DatabaseStatus } from "./database-status"
import { DatabaseConnectionInfo } from "./database-connection-info"
import { DatabaseUtils } from "./database-utils"
import { DatabaseDiagnostics } from "./database-diagnostics"
import { DbStatusCheck } from "./db-status-check"
import { EnvironmentVariables } from "./environment-variables"
import { PolicyAdminConnectionTest } from "./policy-admin-connection-test"
import { ApiConfiguration } from "./api-configuration"
import { ApiEnvironmentGuide } from "./api-environment-guide"
import { ApiDebugButton } from "./api-debug-button"

export default function AdminPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-semibold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Suspense fallback={<div>Loading database status...</div>}>
          <DatabaseStatus />
        </Suspense>
        <DbStatusCheck />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <PolicyAdminConnectionTest />
        <ApiConfiguration />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <ApiDebugButton />
        <ApiEnvironmentGuide />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <EnvironmentVariables />
      </div>

      <div className="grid grid-cols-1 gap-6 mb-6">
        <DatabaseConnectionInfo />
      </div>

      <div className="grid grid-cols-1 gap-6 mb-6">
        <DatabaseDiagnostics />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <DatabaseUtils />
      </div>
    </div>
  )
}
