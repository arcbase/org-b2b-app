import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export default function NotFound() {
  return (
    <div className="container mx-auto py-16 flex flex-col items-center justify-center">
      <AlertCircle className="h-16 w-16 text-red-500 mb-6" />
      <h1 className="text-4xl font-bold mb-4">404 - Not Found</h1>
      <p className="text-xl text-gray-600 mb-8">The resource you are looking for does not exist.</p>
      <div className="flex gap-4">
        <Link href="/">
          <Button>Go to Dashboard</Button>
        </Link>
        <Link href="/admin">
          <Button variant="outline">Go to Admin</Button>
        </Link>
      </div>
    </div>
  )
}
