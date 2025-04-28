/**
 * Client-side API service for making requests to our proxy endpoints
 */

// Base URL for our proxy API routes
const API_BASE_URL = "/api/proxy"

/**
 * Generic fetch function with error handling
 */
async function fetchAPI<T>(url: string, options: RequestInit = {}): Promise<T> {
  try {
    const response = await fetch(url, options)

    if (!response.ok) {
      // Try to get error details from the response
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `HTTP error! Status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`API request failed: ${url}`, error)
    throw error
  }
}

/**
 * Firms API
 */
export const firmsAPI = {
  // Get all firms
  getAll: async (params?: Record<string, string>) => {
    const queryString = params ? "?" + new URLSearchParams(params).toString() : ""
    return fetchAPI(`${API_BASE_URL}/firms${queryString}`)
  },

  // Get a specific firm by ID
  getById: async (id: number | string) => {
    return fetchAPI(`${API_BASE_URL}/firms/${id}`)
  },

  // Create a new firm
  create: async (data: any) => {
    return fetchAPI(`${API_BASE_URL}/firms`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
  },

  // Update a firm
  update: async (id: number | string, data: any) => {
    return fetchAPI(`${API_BASE_URL}/firms/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
  },
}

/**
 * Agents API
 */
export const agentsAPI = {
  // Get all agents
  getAll: async (params?: Record<string, string>) => {
    const queryString = params ? "?" + new URLSearchParams(params).toString() : ""
    return fetchAPI(`${API_BASE_URL}/agents${queryString}`)
  },

  // Get a specific agent by ID
  getById: async (id: number | string) => {
    return fetchAPI(`${API_BASE_URL}/agents/${id}`)
  },

  // Create a new agent
  create: async (data: any) => {
    return fetchAPI(`${API_BASE_URL}/agents`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
  },

  // Update an agent
  update: async (id: number | string, data: any) => {
    return fetchAPI(`${API_BASE_URL}/agents/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
  },
}
