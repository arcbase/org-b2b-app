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
import { requestAppointment } from "@/app/actions/update-state-license"
import { useToast } from "@/hooks/use-toast"
import { AlertCircle, Loader2 } from "lucide-react"

interface StateLicense {
  id: number
  agent_id: number
  state: string
  status: string
  expiration_date: string | null
  appointment_status: string
}

interface RequestAppointmentModalProps {
  licenses: StateLicense[]
  agentId: number
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function RequestAppointmentModal({
  licenses,
  agentId,
  open,
  onOpenChange,
  onSuccess,
}: RequestAppointmentModalProps) {
  const [selectedLicenseId, setSelectedLicenseId] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // Filter licenses that are eligible for appointment requests
  // (those that are Active but not already Appointed or Pending)
  const eligibleLicenses = licenses.filter(
    (license) => license.status === "Active" && license.appointment_status === "Not Appointed",
  )

  const handleSubmit = async () => {
    if (!selectedLicenseId) {
      setError("Please select a state")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const result = await requestAppointment(Number.parseInt(selectedLicenseId), agentId)

      if (result.success) {
        toast({
          variant: "success",
          title: "Success",
          description: result.message,
        })
        onOpenChange(false)
        if (onSuccess) onSuccess()
      } else {
        setError(result.message || "Failed to request appointment")
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
          <DialogTitle>Request Appointment</DialogTitle>
          <DialogDescription>Select a state to request an appointment for this agent.</DialogDescription>
        </DialogHeader>

        {eligibleLicenses.length === 0 ? (
          <div className="bg-amber-50 border border-amber-200 rounded-md p-4 my-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
              <p className="text-sm text-amber-700">
                No eligible licenses found. The agent must have active licenses that are not already appointed or
                pending appointment.
              </p>
            </div>
          </div>
        ) : (
          <div className="py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="license">State</Label>
                <Select value={selectedLicenseId} onValueChange={setSelectedLicenseId}>
                  <SelectTrigger id="license">
                    <SelectValue placeholder="Select a state" />
                  </SelectTrigger>
                  <SelectContent>
                    {eligibleLicenses.map((license) => (
                      <SelectItem key={license.id} value={license.id.toString()}>
                        {license.state}
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
          <Button onClick={handleSubmit} disabled={isSubmitting || eligibleLicenses.length === 0}>
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
