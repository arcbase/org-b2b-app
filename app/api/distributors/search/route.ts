import { NextResponse } from "next/server"

// Mock data for distributor search (used when API connection is not available)
const mockDistributors = [
  {
    name: "JOSEPH LEE MOSES",
    lastFourTaxId: "1144",
    nationalProducerNumber: "3104203",
    firmNames: ["Halo Securities, LLC"],
    distributor: {
      id: 33,
      name: "JOSEPH LEE MOSES",
      searchName: "JOSEPH LEE MOSES",
      source: "onyx",
      isPerson: true,
      nationalProducerNumber: "3104203",
      lastFourTaxId: "1144",
      taxId: "415921144",
      crdNumber: null,
      prefix: null,
      firstName: "Joseph",
      middleName: "Lee",
      sex: "M",
      lastName: "Moses",
      suffix: null,
      birthDate: "1957-10-09",
      __typename: "Agent",
    },
  },
  {
    name: "YUSUF KHALEEQ",
    lastFourTaxId: "8746",
    nationalProducerNumber: "19041328",
    firmNames: ["RETIRE ONE"],
    distributor: {
      id: 39,
      name: "YUSUF KHALEEQ",
      searchName: "YUSUF KHALEEQ",
      source: "onyx",
      isPerson: true,
      nationalProducerNumber: "19041328",
      lastFourTaxId: "8746",
      taxId: "122478746",
      crdNumber: null,
      prefix: null,
      firstName: "Yusuf",
      middleName: null,
      sex: "M",
      lastName: "Khaleeq",
      suffix: null,
      birthDate: "1987-10-09",
      __typename: "Agent",
    },
  },
  {
    name: "MIKE TEST COATES",
    lastFourTaxId: "8691",
    nationalProducerNumber: "651984",
    firmNames: ["RETIRE ONE"],
    distributor: {
      id: 20,
      name: "MIKE TEST COATES",
      searchName: "MIKE TEST COATES",
      source: "onyx",
      isPerson: true,
      nationalProducerNumber: "651984",
      lastFourTaxId: "8691",
      taxId: "035388691",
      crdNumber: null,
      prefix: null,
      firstName: "Mike",
      middleName: "Test",
      sex: "M",
      lastName: "Coates",
      suffix: null,
      birthDate: "1958-01-31",
      __typename: "Agent",
    },
  },
]

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { variables } = body
    const { searchTerm, pagingContext } = variables

    // Filter distributors based on search term
    const filteredDistributors = mockDistributors.filter((distributor) => {
      const term = searchTerm.toLowerCase()
      return (
        distributor.name.toLowerCase().includes(term) ||
        distributor.nationalProducerNumber.includes(term) ||
        distributor.lastFourTaxId.includes(term)
      )
    })

    // Apply pagination
    const { offset = 0, limit = 10 } = pagingContext || {}
    const paginatedDistributors = filteredDistributors.slice(offset, offset + limit)

    return NextResponse.json({
      data: {
        distributorSearch: {
          count: filteredDistributors.length,
          results: paginatedDistributors,
        },
      },
    })
  } catch (error) {
    console.error("Error in distributor search API:", error)
    return NextResponse.json({ error: "Failed to process distributor search" }, { status: 500 })
  }
}
