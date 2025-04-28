"use client"

import { useState, useEffect } from "react"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, Search, AlertCircle } from "lucide-react"
import { searchDistributors, type DistributorSearchResult } from "@/lib/api/agent-api"

interface AgentSearchModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAgentSelect: (agent: DistributorSearchResult) => void
  initialSearchTerm?: string
}

export function AgentSearchModal({ open, onOpenChange, onAgentSelect, initialSearchTerm = "" }: AgentSearchModalProps) {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm)
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<DistributorSearchResult[]>([])
  const [error, setError] = useState<string | null>(null)
  const [selectedAgent, setSelectedAgent] = useState<DistributorSearchResult | null>(null)
  const [connectionError, setConnectionError] = useState<string | null>(null)

  // Reset state when modal opens and trigger search if initialSearchTerm is provided
  useEffect(() => {
    if (open) {
      setSearchTerm(initialSearchTerm)
      setSearchResults([])
      setError(null)
      setConnectionError(null)
      setSelectedAgent(null)

      if (initialSearchTerm) {
        handleSearch()
      }
    }
  }, [open, initialSearchTerm])

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setError("Please enter a search term")
      return
    }

    setIsSearching(true)
    setError(null)
    setConnectionError(null)
    setSearchResults([])

    console.log(`[Agent Search] Starting search with term: "${searchTerm}"`)

    try {
      // Log that we're about to make the API call
      console.log(
        `[Agent Search] Calling searchDistributors with term: "${searchTerm}", onlyActive: true, offset: 0, limit: 10`,
      )

      // Make the API call
      const results = await searchDistributors(searchTerm, true, 0, 10)

      console.log(`[Agent Search] Search completed. Results count: ${results?.count || 0}`)
      console.log(`[Agent Search] Results:`, results)

      // Check if results is defined and has the expected structure
      if (results && results.results) {
        setSearchResults(results.results)

        if (results.results.length === 0) {
          setError("No agents found matching your search criteria")
        }
      } else {
        // Handle case where results are missing or malformed
        setError("Invalid response format from search API")
        console.error("[Agent Search] Invalid search results format:", results)
      }
    } catch (err) {
      console.error("[Agent Search] Error:", err)
      if (err instanceof Error) {
        if (err.message.includes("API error") || err.message.includes("Failed to fetch")) {
          setConnectionError(
            "Failed to connect to the policy admin system. Please check your connection and try again.",
          )
        } else {
          setError(`An error occurred while searching for agents: ${err.message}`)
        }
      } else {
        setError("An unexpected error occurred while searching for agents")
      }
    } finally {
      setIsSearching(false)
    }
  }

  const handleSelectAgent = (agent: DistributorSearchResult) => {
    setSelectedAgent(agent)
  }

  const handleConfirmSelection = () => {
    if (selectedAgent) {
      onAgentSelect(selectedAgent)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Agent Search Results</DialogTitle>
          <DialogDescription>Select an agent from the search results to add to this firm.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex items-end gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="searchTerm">Search Term</Label>
              <Input
                id="searchTerm"
                placeholder="Enter agent name, NPN, or tax ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} disabled={isSearching || !searchTerm.trim()} className="mb-px">
              {isSearching ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </>
              )}
            </Button>
          </div>

          {connectionError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Connection Error</p>
                <p>{connectionError}</p>
                <p className="text-sm mt-2">
                  Make sure the API environment variables are correctly configured in the Admin section.
                </p>
              </div>
            </div>
          )}

          {error && !connectionError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">{error}</div>
          )}

          {searchResults.length > 0 && (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[30px]"></TableHead>
                    <TableHead>Agent Name</TableHead>
                    <TableHead>Firm Name</TableHead>
                    <TableHead>NPN</TableHead>
                    <TableHead>Distributor ID</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {searchResults.map((agent) => (
                    <TableRow
                      key={agent.distributor.id}
                      className={`cursor-pointer hover:bg-gray-50 ${
                        selectedAgent?.distributor.id === agent.distributor.id ? "bg-blue-50" : ""
                      }`}
                      onClick={() => handleSelectAgent(agent)}
                    >
                      <TableCell>
                        <div
                          className={`h-4 w-4 rounded-full border ${
                            selectedAgent?.distributor.id === agent.distributor.id
                              ? "bg-[#007AFF] border-[#007AFF]"
                              : "border-gray-300"
                          }`}
                        >
                          {selectedAgent?.distributor.id === agent.distributor.id && (
                            <div className="h-full w-full flex items-center justify-center">
                              <div className="h-2 w-2 rounded-full bg-white"></div>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{agent.name}</TableCell>
                      <TableCell>{agent.firmNames.join(", ") || "N/A"}</TableCell>
                      <TableCell>{agent.nationalProducerNumber}</TableCell>
                      <TableCell>{agent.distributor.id}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirmSelection} disabled={!selectedAgent}>
            Select Agent
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
