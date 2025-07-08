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
        <Link href="/" className="text-white/80 hover:text-white transition-colors underline">
          Home
        </Link>
        <Link href="/dashboard" className="text-white/80 hover:text-white transition-colors underline">
          Dashboard
        </Link>
        <Link href="/maps" className="text-white/80 hover:text-white transition-colors underline">
          My Maps
        </Link>
        <Link href="/pricing" className="text-white/80 hover:text-white transition-colors underline">
          Pricing
        </Link>
        <Button variant="outline" className="border-white/20 text-white hover:bg-white hover:text-black bg-transparent">
          Sign In
        </Button>
      </div>
    </nav>
  )
}
