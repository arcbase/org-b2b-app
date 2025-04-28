import { Database, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function DbInitializationRequired() {
  return (
    <div className="bg-white rounded-md border p-8 text-center">
      <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
      <h2 className="text-xl font-medium mb-2">Database Initialization Required</h2>
      <p className="text-gray-500 mb-6">
        The database tables don't exist yet. You need to initialize the database before you can view this data.
      </p>
      <div className="flex justify-center">
        <Link href="/admin">
          <Button>
            <Database className="mr-2 h-4 w-4" />
            Go to Database Admin
          </Button>
        </Link>
      </div>
    </div>
  )
}
