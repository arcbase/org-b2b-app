"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search } from "lucide-react"

interface InitialAgentSearchModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSearch: (searchTerm: string) => void
}

export function InitialAgentSearchModal({ open, onOpenChange, onSearch }: InitialAgentSearchModalProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const handleSearch = () => {
    if (searchTerm.trim()) {
      console.log(`[Initial Agent Search] Initiating search with term: "${searchTerm}"`)
      onSearch(searchTerm)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Search for Agent</DialogTitle>
          <DialogDescription>Enter an agent name, NPN, or tax ID to search for.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="agentName">Agent Name/NPN/Tax ID</Label>
            <Input
              id="agentName"
              placeholder="Enter agent name, NPN, or tax ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              autoFocus
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSearch} disabled={!searchTerm.trim()}>
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
