"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { requestNewLicense, getStatesWithoutLicenses } from "@/app/actions/update-state-license"
import { useToast } from "@/hooks/use-toast"
import { AlertCircle, Loader2 } from "lucide-react"
import { useEffect } from "react"

interface NewLicenseModalProps {
  agentId: number
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function NewLicenseModal({ agentId, open, onOpenChange, onSuccess }: NewLicenseModalProps) {
  const [state, setState] = useState<string>("")
  const [availableStates, setAvailableStates] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (open) {
      fetchAvailableStates()
    }
  }, [open])

  const fetchAvailableStates = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await getStatesWithoutLicenses(agentId)
      if (result.success) {
        setAvailableStates(result.availableStates)
        if (result.availableStates.length === 0) {
          setError("No available states found. The agent already has licenses for all states.")
        }
      } else {
        setError(result.message || "Failed to fetch available states")
      }
    } catch (err) {
      setError("An unexpected error occurred while fetching available states")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!state) {
      setError("Please select a state")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const result = await requestNewLicense(agentId, state)

      if (result.success) {
        toast({
          variant: "success",
          title: "Success",
          description: result.message,
        })
        onOpenChange(false)
        if (onSuccess) onSuccess()
      } else {
        setError(result.message || "Failed to request license")
        toast({
          variant: "destructive",
          title: "Error",
          description: result.message,
        })
      }
    } catch (err) {
      setError("An unexpected error occurred")
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      })
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Request New License</DialogTitle>
          <DialogDescription>Select a state to request a new license for this agent.</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center py-6">
            <Loader2 className="h-6 w-6 animate-spin text-[#007AFF]" />
            <span className="ml-2">Loading available states...</span>
          </div>
        ) : error && availableStates.length === 0 ? (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 my-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        ) : (
          <div className="py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Select value={state} onValueChange={setState}>
                  <SelectTrigger id="state">
                    <SelectValue placeholder="Select a state" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableStates.map((stateCode) => (
                      <SelectItem key={stateCode} value={stateCode}>
                        {stateCode}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || isLoading || availableStates.length === 0}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Request"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
