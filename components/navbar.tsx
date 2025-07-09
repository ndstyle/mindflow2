"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-6">
      <Link href="/" className="text-2xl font-bold">
        mindflow
      </Link>

      <div className="hidden md:flex items-center space-x-8">
        <Link href="/" className="text-white/80 hover:text-white transition-colors">
          Home
        </Link>
        <Link href="/input" className="text-white/80 hover:text-white transition-colors">
          Create
        </Link>
        <Link href="/dashboard" className="text-white/80 hover:text-white transition-colors">
          Dashboard
        </Link>
        <Link href="/history" className="text-white/80 hover:text-white transition-colors">
          History
        </Link>
        <Link href="/login" className="text-white/80 hover:text-white transition-colors">
          Sign In
        </Link>
      </div>
    </nav>
  )
}
