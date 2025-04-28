import { NextResponse } from "next/server"
import { fetchWithAuth } from "@/lib/api-utils"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // Get the API base URL from environment variables
    const apiBaseUrl = process.env.API_BASE_URL

    // Check if the API base URL is set
    if (!apiBaseUrl) {
      return NextResponse.json(
        {
          error: "API_BASE_URL environment variable is not set",
        },
        { status: 400 },
      )
    }

    // Get the distributor ID from the URL
    const distributorId = Number.parseInt(params.id, 10)

    if (isNaN(distributorId)) {
      return NextResponse.json(
        {
          error: "Invalid distributor ID",
        },
        { status: 400 },
      )
    }

    // Ensure we're using the /graphql endpoint
    const graphqlEndpoint = `${apiBaseUrl}/graphql`

    console.log("[Proxy] Sending GraphQL request to get distributor by ID:", {
      url: graphqlEndpoint,
      distributorId,
    })

    // Forward the request to the API using GraphQL
    const response = await fetchWithAuth(graphqlEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          query distributorById($distributorId: Int!) {
            distributorById(distributorId: $distributorId) {
              cdwId
              crdNumber
              distributorAmlTrainingList {
                id
                expirationDate
                status
              }
              distributorEoTrainingList {
                id
                expirationDate
                status
              }
              distributorProductTrainingList {
                id
                productName
                status
              }
              distributorStateTrainingList {
                id
                state
                status
              }
              distributorStateLicenseList {
                id
                state
                status
                expirationDate
              }
              distributorStateAppointmentList {
                id
                state
                status
                expirationDate
              }
              distributorSellingAgreementList {
                topLevelFirmExternalId
                adminLegacyId
                externalId
                distributorType
                distributorStatus
                firmProfile {
                  externalId
                }
                activeDistributorSellingAgreementAddresses {
                  address {
                    addressLine1
                    addressLine2
                    addressLine3
                    city
                    countryCode
                    countryName
                    id
                    stateCode
                    stateName
                    zipCode
                    zipExtension
                  }
                  addressType
                  effectiveDateRange {
                    lower
                    upper
                  }
                }
                activeDistributorSellingAgreementEmails {
                  email
                  emailType
                  effectiveDateRange {
                    lower
                    upper
                  }
                }
                activeDistributorSellingAgreementPhones {
                  phone {
                    countryCode
                    id
                    phoneExtension
                    phoneNumber
                  }
                  phoneType
                  effectiveDateRange {
                    lower
                    upper
                  }
                }
                effectiveDateRange {
                  lower
                  upper
                }
                terminationReason
              }
              id
              entityId
              finraNumber
              nationalProducerNumber
              taxId
              searchName
              isPerson
              isBanned
              lastFourTaxId
              prefix
              sex
              firstName
              middleName
              lastName
              suffix
              birthDate
            }
          }
        `,
        variables: {
          distributorId,
        },
      }),
    })

    // Get the response data
    const data = await response.json()

    // Log the response for debugging
    console.log("[Proxy] GraphQL API response status for distributor by ID:", response.status)
    console.log("[Proxy] GraphQL API response preview:", JSON.stringify(data).substring(0, 200) + "...")

    // Check if the response is successful
    if (!response.ok) {
      return NextResponse.json(
        {
          error: `Failed to get distributor with ID ${distributorId} from API`,
          status: response.status,
          details: data,
        },
        { status: response.status },
      )
    }

    // Return the distributor details
    return NextResponse.json(data)
  } catch (error) {
    console.error(`[Proxy] Error in distributor/${params.id} proxy:`, error)
    return NextResponse.json(
      {
        error: "An unexpected error occurred while getting distributor details",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
