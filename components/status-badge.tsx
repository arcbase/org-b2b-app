import { cn } from "@/lib/utils"

type StatusBadgeProps = {
  status: "Active" | "Inactive" | "Review" | "Pending" | "Approved" | "Expired"
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusColor = () => {
    switch (status) {
      case "Active":
      case "Approved":
        return "bg-green-100 text-green-800 border-green-200"
      case "Pending":
      case "Review":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "Inactive":
      case "Expired":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        getStatusColor(),
        className,
      )}
    >
      {status}
    </span>
  )
}
