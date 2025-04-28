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
import { Loader2 } from "lucide-react"
import { getDistributorById, type DistributorDetails, type DistributorSearchResult } from "@/lib/api/agent-api"

interface AgentDetailsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedAgent: DistributorSearchResult | null
  onConfirm: (agentDetails: DistributorDetails) => void
}

export function AgentDetailsModal({ open, onOpenChange, selectedAgent, onConfirm }: AgentDetailsModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [agentDetails, setAgentDetails] = useState<DistributorDetails | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open && selectedAgent) {
      fetchAgentDetails(selectedAgent.distributor.id)
    }
  }, [open, selectedAgent])

  const fetchAgentDetails = async (distributorId: number) => {
    setIsLoading(true)
    setError(null)

    try {
      const details = await getDistributorById(distributorId)
      setAgentDetails(details)
    } catch (err) {
      setError("An error occurred while fetching agent details")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleConfirm = () => {
    if (agentDetails) {
      onConfirm(agentDetails)
      onOpenChange(false)
    }
  }

  // Get the primary address from agent details
  const getPrimaryAddress = () => {
    if (!agentDetails || !agentDetails.distributorSellingAgreementList.length) return "No address available"

    const addresses = agentDetails.distributorSellingAgreementList[0].activeDistributorSellingAgreementAddresses
    if (!addresses.length) return "No address available"

    const address = addresses[0].address
    return [address.addressLine1, address.addressLine2, `${address.city}, ${address.stateCode} ${address.zipCode}`]
      .filter(Boolean)
      .join(", ")
  }

  // Get the primary email from agent details
  const getPrimaryEmail = () => {
    if (!agentDetails || !agentDetails.distributorSellingAgreementList.length) return "No email available"

    const emails = agentDetails.distributorSellingAgreementList[0].activeDistributorSellingAgreementEmails
    if (!emails.length) return "No email available"

    return emails[0].email
  }

  // Get the primary phone from agent details
  const getPrimaryPhone = () => {
    if (!agentDetails || !agentDetails.distributorSellingAgreementList.length) return "No phone available"

    const phones = agentDetails.distributorSellingAgreementList[0].activeDistributorSellingAgreementPhones
    if (!phones.length) return "No phone available"

    const phone = phones[0].phone
    return `${phone.countryCode} ${phone.phoneNumber}${phone.phoneExtension ? ` ext. ${phone.phoneExtension}` : ""}`
  }

  // Format birthdate
  const formatBirthdate = (dateString?: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Confirm Agent Details</DialogTitle>
          <DialogDescription>Review the agent details before adding to the firm.</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#007AFF]" />
            <span className="ml-2">Loading agent details...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md my-4">{error}</div>
        ) : agentDetails ? (
          <div className="py-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Name</h3>
                  <p className="mt-1">
                    {[
                      agentDetails.prefix,
                      agentDetails.firstName,
                      agentDetails.middleName,
                      agentDetails.lastName,
                      agentDetails.suffix,
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">National Producer Number</h3>
                  <p className="mt-1">{agentDetails.nationalProducerNumber}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Tax ID</h3>
                  <p className="mt-1">xxx-xx-{agentDetails.lastFourTaxId}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Birthdate</h3>
                  <p className="mt-1">{formatBirthdate(agentDetails.birthDate)}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Address</h3>
                <p className="mt-1">{getPrimaryAddress()}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  <p className="mt-1">{getPrimaryEmail()}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                  <p className="mt-1">{getPrimaryPhone()}</p>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={isLoading || !agentDetails}>
            Add Agent to Firm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
