"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export function MainNav() {
  const pathname = usePathname()

  const navItems = [
    { name: "Dashboard", href: "/" },
    { name: "Firms", href: "/firms" },
    { name: "Advisor Firms", href: "/advisor-firms" },
    { name: "Agents", href: "/agents" },
    { name: "Advisors", href: "/advisors" },
    { name: "Licensing & Appointments", href: "/licensing" },
    { name: "Reports", href: "/reports" },
    { name: "Admin", href: "/admin" },
  ]

  return (
    <nav className="flex px-6 border-b">
      {navItems.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex h-12 items-center px-4 text-sm font-medium transition-colors ${
              isActive ? "border-b-2 border-[#007AFF] text-[#007AFF]" : "text-[#212121] hover:text-[#007AFF]"
            }`}
          >
            {item.name}
          </Link>
        )
      })}
    </nav>
  )
}
