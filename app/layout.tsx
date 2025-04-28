import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { MainNav } from "@/components/main-nav"
import { SearchBar } from "@/components/search-bar"
import { UserNav } from "@/components/user-nav"
import { Suspense } from "react"
import { Toaster } from "@/components/ui/toaster"
import { DataSourceProvider } from "@/lib/data-source-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "B2B Operations Portal",
  description: "Manage firms, advisors, agents, and licensing in one place",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-40 border-b bg-white">
              <div className="flex h-16 items-center justify-between px-6">
                <div className="flex items-center gap-4">
                  <img src="/gainbridge-logo.png" alt="Gainbridge" className="h-8" />
                  <span className="font-semibold">B2B Operations Portal</span>
                </div>
                <div className="flex flex-1 items-center justify-center px-6">
                  <Suspense>
                    <SearchBar />
                  </Suspense>
                </div>
                <UserNav />
              </div>
              <MainNav />
            </header>
            <main className="flex-1 bg-[#F5F5F7]">
              <DataSourceProvider source="database">{children}</DataSourceProvider>
            </main>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
