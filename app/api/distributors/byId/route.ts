import { NextResponse } from "next/server"

// Mock data for distributor by ID
const mockDistributorDetails = {
  cdwId: null,
  crdNumber: null,
  distributorAmlTrainingList: [],
  distributorEoTrainingList: [],
  distributorProductTrainingList: [],
  distributorStateTrainingList: [],
  distributorStateLicenseList: [],
  distributorStateAppointmentList: [],
  distributorSellingAgreementList: [
    {
      topLevelFirmExternalId: "RETIREONETEST",
      adminLegacyId: "RETIREONETEST000001",
      externalId: "RETIREONETEST000001",
      distributorType: "LOA",
      distributorStatus: "ACTIVE",
      firmProfile: {
        externalId: "RETIREONETEST",
        __typename: "FirmProfile",
      },
      activeDistributorSellingAgreementAddresses: [
        {
          address: {
            __typename: "Address",
            addressLine1: "222 FIRST ST",
            addressLine2: "SUITE 600",
            addressLine3: "",
            city: "LOUISEVILLE",
            countryCode: "USA",
            countryName: "United States",
            id: 13,
            stateCode: "KY",
            stateName: "Kentucky",
            zipCode: "40202",
            zipExtension: "",
          },
          addressType: "HOME",
          effectiveDateRange: {
            lower: "2024-10-15",
            upper: "9999-12-31",
            __typename: "DateRange",
          },
          __typename: "SellingAgreementAddress",
        },
      ],
      activeDistributorSellingAgreementEmails: [
        {
          email: "mike@retireone.com",
          emailType: "PERSONAL",
          effectiveDateRange: {
            lower: "2024-10-15",
            upper: "9999-12-31",
            __typename: "DateRange",
          },
          __typename: "SellingAgreementEmail",
        },
      ],
      activeDistributorSellingAgreementPhones: [
        {
          phone: {
            __typename: "Phone",
            countryCode: "+1",
            id: 10,
            phoneExtension: "",
            phoneNumber: "4013695966",
          },
          phoneType: "BUSINESS",
          effectiveDateRange: {
            lower: "2024-10-15",
            upper: "9999-12-31",
            __typename: "DateRange",
          },
          __typename: "SellingAgreementPhone",
        },
      ],
      effectiveDateRange: {
        lower: "2024-10-15",
        upper: "9999-12-31",
        __typename: "DateRange",
      },
      terminationReason: null,
      __typename: "DistributorSellingAgreement",
    },
  ],
  id: 20,
  entityId: null,
  finraNumber: null,
  nationalProducerNumber: "651984",
  taxId: "035388691",
  searchName: "MIKE TEST COATES",
  isPerson: true,
  isBanned: false,
  lastFourTaxId: "8691",
  prefix: null,
  sex: "M",
  firstName: "Mike",
  middleName: "Test",
  lastName: "Coates",
  suffix: null,
  birthDate: "1958-01-31",
  __typename: "Agent",
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { variables } = body
    const { distributorId } = variables

    // In a real implementation, you would fetch the distributor by ID
    // For now, we'll return the mock data
    return NextResponse.json({
      data: {
        distributorById: mockDistributorDetails,
      },
    })
  } catch (error) {
    console.error("Error in distributor by ID API:", error)
    return NextResponse.json({ error: "Failed to get distributor by ID" }, { status: 500 })
  }
}
