/**
 * Agent API Service
 * Handles all API operations related to agent operations
 */

// Type definitions for API responses
export interface DistributorSearchResult {
  name: string
  lastFourTaxId: string
  nationalProducerNumber: string
  firmNames: string[]
  distributor: {
    id: number
    name: string
    searchName: string
    source: string
    isPerson: boolean
    nationalProducerNumber: string
    lastFourTaxId: string
    taxId: string
    crdNumber: string | null
    firstName?: string
    middleName?: string
    lastName?: string
    birthDate?: string
    sex?: string
  }
}

export interface DistributorSearchResponse {
  count: number
  results: DistributorSearchResult[]
}

export interface Address {
  addressLine1: string
  addressLine2: string
  addressLine3: string
  city: string
  countryCode: string
  countryName: string
  id: number
  stateCode: string
  stateName: string
  zipCode: string
  zipExtension: string
}

export interface Phone {
  countryCode: string
  id: number
  phoneExtension: string
  phoneNumber: string
}

export interface SellingAgreementAddress {
  address: Address
  addressType: string
  effectiveDateRange: {
    lower: string
    upper: string
  }
}

export interface SellingAgreementEmail {
  email: string
  emailType: string
  effectiveDateRange: {
    lower: string
    upper: string
  }
}

export interface SellingAgreementPhone {
  phone: Phone
  phoneType: string
  effectiveDateRange: {
    lower: string
    upper: string
  }
}

export interface DistributorSellingAgreement {
  topLevelFirmExternalId: string
  adminLegacyId: string
  externalId: string
  distributorType: string
  distributorStatus: string
  firmProfile: {
    externalId: string
  }
  activeDistributorSellingAgreementAddresses: SellingAgreementAddress[]
  activeDistributorSellingAgreementEmails: SellingAgreementEmail[]
  activeDistributorSellingAgreementPhones: SellingAgreementPhone[]
  effectiveDateRange: {
    lower: string
    upper: string
  }
  terminationReason: string | null
}

export interface DistributorDetails {
  cdwId: string | null
  crdNumber: string | null
  distributorAmlTrainingList: any[]
  distributorEoTrainingList: any[]
  distributorProductTrainingList: any[]
  distributorStateTrainingList: any[]
  distributorStateLicenseList: any[]
  distributorStateAppointmentList: any[]
  distributorSellingAgreementList: DistributorSellingAgreement[]
  id: number
  entityId: string | null
  finraNumber: string | null
  nationalProducerNumber: string
  taxId: string
  searchName: string
  isPerson: boolean
  isBanned: boolean
  lastFourTaxId: string
  prefix?: string | null
  sex?: string
  firstName?: string
  middleName?: string | null
  lastName?: string
  suffix?: string | null
  birthDate?: string
}

// API base URL from environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL || ""
// Use only server-side environment variables for sensitive data
const TOKEN_URL = process.env.TOKEN_URL || ""
const API_CLIENT_ID = process.env.API_CLIENT_ID || ""
const API_CLIENT_SECRET = process.env.API_CLIENT_SECRET || ""

// Check if we should use the mock API
const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === "true" || false

// Function to get access token
async function getAccessToken(): Promise<string> {
  try {
    // Always use the API proxy for token requests from client-side
    const tokenEndpoint = typeof window !== "undefined" ? "/api/auth/token" : TOKEN_URL

    const response = await fetch(tokenEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: API_CLIENT_ID,
        client_secret: API_CLIENT_SECRET,
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to get access token: ${response.status}`)
    }

    const data = await response.json()
    return data.access_token
  } catch (error) {
    console.error("Error getting access token:", error)
    throw new Error("Failed to authenticate with the API")
  }
}

/**
 * Search for distributors/agents based on search term
 * @param searchTerm - The term to search for (name, NPN, etc.)
 * @param onlyActive - Whether to only return active distributors
 * @param offset - Pagination offset
 * @param limit - Pagination limit
 * @returns Promise with search results
 */
export async function searchDistributors(
  searchTerm: string,
  onlyActive = true,
  offset = 0,
  limit = 10,
): Promise<DistributorSearchResponse> {
  try {
    console.log(`[Agent API] searchDistributors called with:`, { searchTerm, onlyActive, offset, limit })
    console.log(`[Agent API] USE_MOCK_API setting:`, USE_MOCK_API)
    console.log(`[Agent API] API_BASE_URL:`, API_BASE_URL ? `Set (${API_BASE_URL.substring(0, 20)}...)` : "Not set")

    // Use mock API only if explicitly configured
    if (USE_MOCK_API) {
      console.log("[Agent API] Using mock API for distributor search (explicitly configured)")
      return await searchDistributorsMock(searchTerm, onlyActive, offset, limit)
    }

    // Use the real API
    console.log("[Agent API] Using real API for distributor search")
    return await searchDistributorsReal(searchTerm, onlyActive, offset, limit)
  } catch (error) {
    console.error("[Agent API] Error searching distributors:", error)

    // Only fall back to mock if explicitly configured to do so
    if (!USE_MOCK_API && process.env.NEXT_PUBLIC_FALLBACK_TO_MOCK === "true") {
      console.log("[Agent API] Real API failed, falling back to mock API")
      try {
        return await searchDistributorsMock(searchTerm, onlyActive, offset, limit)
      } catch (mockError) {
        console.error("[Agent API] Mock API also failed:", mockError)
      }
    }

    throw error
  }
}

/**
 * Search for distributors using the mock API
 */
async function searchDistributorsMock(
  searchTerm: string,
  onlyActive = true,
  offset = 0,
  limit = 10,
): Promise<DistributorSearchResponse> {
  console.log(`[Agent API] searchDistributorsMock called with:`, { searchTerm, onlyActive, offset, limit })

  const requestBody = {
    variables: {
      searchTerm,
      onlyActive,
      pagingContext: {
        offset,
        limit,
      },
    },
  }

  console.log(`[Agent API] Mock API request:`, {
    url: "/api/distributors/search",
    method: "POST",
    body: JSON.stringify(requestBody),
  })

  const response = await fetch("/api/distributors/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  })

  if (!response.ok) {
    const errorText = await response.text().catch(() => "Could not read error response")
    console.error(`[Agent API] Mock API error: ${response.status}`, errorText)
    throw new Error(`Mock API error: ${response.status}`)
  }

  const data = await response.json()
  console.log(`[Agent API] Mock API response:`, data)
  return data.data.distributorSearch
}

// Update the searchDistributorsReal function to ensure it's properly connecting to the API

async function searchDistributorsReal(
  searchTerm: string,
  onlyActive = true,
  offset = 0,
  limit = 10,
): Promise<DistributorSearchResponse> {
  console.log(`[Agent API] searchDistributorsReal called with:`, { searchTerm, onlyActive, offset, limit })

  // Get access token for the real API
  console.log(`[Agent API] Getting access token...`)
  const accessToken = await getAccessToken()
  console.log(`[Agent API] Access token obtained successfully`)

  // For client-side, we need to use the API proxy
  const apiEndpoint = typeof window !== "undefined" ? "/api/proxy/distributors/search" : `${API_BASE_URL}/graphql`

  console.log(`[Agent API] Using API endpoint:`, apiEndpoint)

  const requestBody = {
    query: `
      query distributorSearch(
        $searchTerm: String!
        $onlyActive: Boolean
        $pagingContext: PagingContextInput
      ) {
        distributorSearch(
          searchTerm: $searchTerm
          onlyActive: $onlyActive
          pagingContext: $pagingContext
        ) {
          count
          results {
            name
            lastFourTaxId
            nationalProducerNumber
            firmNames
            distributor {
              id
              name
              searchName
              source
              isPerson
              nationalProducerNumber
              lastFourTaxId
              taxId
              crdNumber
              ... on Agency {
                name
                __typename
              }
              ... on Agent {
                prefix
                firstName
                middleName
                sex
                lastName
                suffix
                birthDate
                __typename
              }
            }
          }
        }
      }
    `,
    variables: {
      searchTerm,
      onlyActive,
      pagingContext: {
        offset,
        limit,
      },
    },
  }

  console.log(`[Agent API] Real API request:`, {
    url: apiEndpoint,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(typeof window === "undefined" ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify(requestBody),
  })

  try {
    // Make the real API call
    const response = await fetch(apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(typeof window === "undefined" ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify(requestBody),
    })

    console.log(`[Agent API] Response status: ${response.status} ${response.statusText}`)

    // Check content type to ensure we're getting JSON back
    const contentType = response.headers.get("content-type")
    if (contentType && !contentType.includes("application/json")) {
      console.error(`[Agent API] Unexpected content type: ${contentType}`)

      // Try to get the response text for debugging
      const responseText = await response.text()
      console.error("[Agent API] Non-JSON response:", responseText.substring(0, 500))

      throw new Error(`API returned non-JSON response with content type: ${contentType}`)
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error(`[Agent API] Real API error: ${response.status}`, errorData)
      throw new Error(`API error: ${response.status} - ${JSON.stringify(errorData)}`)
    }

    const data = await response.json()
    console.log(`[Agent API] Real API response:`, data)

    // Check if the response has the expected structure
    if (!data.data || !data.data.distributorSearch) {
      console.error(`[Agent API] Unexpected response structure:`, data)
      throw new Error(`Unexpected API response structure`)
    }

    return data.data.distributorSearch
  } catch (error) {
    console.error("[Agent API] Error in searchDistributorsReal:", error)
    throw error
  }
}

/**
 * Get detailed information about a distributor by ID
 * @param distributorId - The ID of the distributor to retrieve
 * @returns Promise with distributor details
 */
export async function getDistributorById(distributorId: number): Promise<DistributorDetails> {
  try {
    console.log(`[Agent API] getDistributorById called with ID:`, distributorId)
    console.log(`[Agent API] USE_MOCK_API setting:`, USE_MOCK_API)

    // Use mock API only if explicitly configured
    if (USE_MOCK_API) {
      console.log("[Agent API] Using mock API for distributor details (explicitly configured)")
      return await getDistributorByIdMock(distributorId)
    }

    // Use the real API
    console.log("[Agent API] Using real API for distributor details")
    return await getDistributorByIdReal(distributorId)
  } catch (error) {
    console.error("[Agent API] Error getting distributor details:", error)

    // Only fall back to mock if explicitly configured to do so
    if (!USE_MOCK_API && process.env.NEXT_PUBLIC_FALLBACK_TO_MOCK === "true") {
      console.log("[Agent API] Real API failed, falling back to mock API")
      try {
        return await getDistributorByIdMock(distributorId)
      } catch (mockError) {
        console.error("Mock API also failed:", mockError)
      }
    }

    throw error
  }
}

/**
 * Get distributor details using the mock API
 */
async function getDistributorByIdMock(distributorId: number): Promise<DistributorDetails> {
  const response = await fetch("/api/distributors/byId", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `query distributorById($distributorId: Int!) {
        distributorById(distributorId: $distributorId)
      }`,
      variables: {
        distributorId,
      },
    }),
  })

  if (!response.ok) {
    throw new Error(`Mock API error: ${response.status}`)
  }

  const data = await response.json()
  return data.data.distributorById
}

/**
 * Get distributor details using the real API
 */
async function getDistributorByIdReal(distributorId: number): Promise<DistributorDetails> {
  // Get access token for the real API
  const accessToken = await getAccessToken()

  // For client-side, we need to use the API proxy
  const apiEndpoint =
    typeof window !== "undefined"
      ? `/api/proxy/distributors/${distributorId}`
      : `${API_BASE_URL}/distributors/${distributorId}`

  // Make the real API call
  const response = await fetch(apiEndpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(typeof window === "undefined" ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }

  const data = await response.json()
  return data.data.distributorById
}

/**
 * Create a new agent and associate it with a firm
 * @param firmId - The ID of the firm to associate the agent with
 * @param agentData - The agent data to create
 * @returns Promise with the created agent
 */
export async function createAgentForFirm(firmId: number, agentData: any): Promise<any> {
  try {
    // Insert the agent into the database
    const response = await fetch("/api/agents", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firmId,
        ...agentData,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! Status: ${response.status}`)
    }

    return data
  } catch (error) {
    console.error("Error creating agent:", error)
    throw error
  }
}
