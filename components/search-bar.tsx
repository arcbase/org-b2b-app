"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export function SearchBar() {
  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
      <Input
        type="search"
        placeholder="Search across all sections..."
        className="w-full bg-gray-100 pl-9 focus-visible:ring-[#007AFF]"
      />
    </div>
  )
}
