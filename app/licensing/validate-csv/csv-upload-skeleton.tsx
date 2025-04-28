import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function CSVUploadSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-72 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-md p-6 bg-gray-50">
            <Skeleton className="h-10 w-10 rounded-full mb-2" />
            <Skeleton className="h-4 w-64 mb-4" />
            <Skeleton className="h-9 w-32 rounded-md" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-20 rounded-md" />
            <Skeleton className="h-20 rounded-md" />
            <Skeleton className="h-20 rounded-md" />
          </div>

          <Skeleton className="h-4 w-full mt-6" />

          <div className="mt-6">
            <Skeleton className="h-10 w-32 rounded-md ml-auto" />
          </div>
        </CardContent>
      </Card>

      <div>
        <div className="flex border-b">
          <Skeleton className="h-10 w-24 rounded-md mx-1" />
          <Skeleton className="h-10 w-24 rounded-md mx-1" />
          <Skeleton className="h-10 w-24 rounded-md mx-1" />
        </div>

        <div className="mt-4 rounded-md border overflow-hidden">
          <Skeleton className="h-12 w-full" />
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full mt-1" />
          ))}
        </div>
      </div>
    </div>
  )
}
