"use client"

import { createContext, useContext, type ReactNode } from "react"

type DataSource = "api" | "database"

interface DataSourceContextType {
  source: DataSource
}

const DataSourceContext = createContext<DataSourceContextType>({
  source: "database", // Default to database
})

export function useDataSource() {
  return useContext(DataSourceContext)
}

interface DataSourceProviderProps {
  children: ReactNode
  source: DataSource
}

export function DataSourceProvider({ children, source }: DataSourceProviderProps) {
  return <DataSourceContext.Provider value={{ source }}>{children}</DataSourceContext.Provider>
}
