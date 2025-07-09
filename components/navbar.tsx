"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"
import { LogOut, User, Menu, X } from "lucide-react"
import { useState } from "react"

export default function Navbar() {
  const { user, signOut, loading, isConfigured } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSignOut = async () => {
    if (isConfigured) {
      await signOut()
    }
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <>
      {/* demo mode banner */}
      {!isConfigured && (
        <div className="bg-yellow-500/20 border-b border-yellow-500/30 text-yellow-200 text-center py-2 text-sm">
          demo mode - supabase not configured. authentication and data persistence disabled.
        </div>
      )}

      <nav className="bg-black/80 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* logo */}
            <Link href="/" className="text-2xl font-bold text-white hover:text-gray-300 transition-colors">
              mindflow
            </Link>

            {/* desktop navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                home
              </Link>
              <Link href="/input" className="text-gray-300 hover:text-white transition-colors">
                create
              </Link>
              {user && (
                <>
                  <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors">
                    dashboard
                  </Link>
                  <Link href="/history" className="text-gray-300 hover:text-white transition-colors">
                    history
                  </Link>
                </>
              )}
            </div>

            {/* desktop auth buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {loading ? (
                <div className="w-8 h-8 border-2 border-gray-600 border-t-white rounded-full animate-spin"></div>
              ) : user ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-gray-300">
                    <User size={16} />
                    <span className="text-sm">{user.email}</span>
                  </div>
                  <Button
                    onClick={handleSignOut}
                    variant="outline"
                    size="sm"
                    className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white bg-transparent"
                  >
                    <LogOut size={16} className="mr-2" />
                    sign out
                  </Button>
                </div>
              ) : isConfigured ? (
                <div className="flex items-center space-x-4">
                  <Link href="/login">
                    <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-gray-800">
                      sign in
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button size="sm" className="bg-white text-black hover:bg-gray-200">
                      sign up
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="text-gray-400 text-sm">demo mode</div>
              )}
            </div>

            {/* mobile menu button */}
            <div className="md:hidden">
              <Button
                onClick={toggleMobileMenu}
                variant="ghost"
                size="sm"
                className="text-gray-300 hover:text-white hover:bg-gray-800"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </Button>
            </div>
          </div>
        </div>

        {/* mobile navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-black/95 border-t border-gray-800">
            <div className="px-4 py-4 space-y-4">
              <Link
                href="/"
                className="block text-gray-300 hover:text-white transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                home
              </Link>
              <Link
                href="/input"
                className="block text-gray-300 hover:text-white transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                create
              </Link>
              {user && (
                <>
                  <Link
                    href="/dashboard"
                    className="block text-gray-300 hover:text-white transition-colors py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    dashboard
                  </Link>
                  <Link
                    href="/history"
                    className="block text-gray-300 hover:text-white transition-colors py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    history
                  </Link>
                </>
              )}

              {/* mobile auth section */}
              <div className="border-t border-gray-800 pt-4">
                {loading ? (
                  <div className="flex justify-center">
                    <div className="w-6 h-6 border-2 border-gray-600 border-t-white rounded-full animate-spin"></div>
                  </div>
                ) : user ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-gray-300 py-2">
                      <User size={16} />
                      <span className="text-sm">{user.email}</span>
                    </div>
                    <Button
                      onClick={handleSignOut}
                      variant="outline"
                      size="sm"
                      className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white bg-transparent"
                    >
                      <LogOut size={16} className="mr-2" />
                      sign out
                    </Button>
                  </div>
                ) : isConfigured ? (
                  <div className="space-y-3">
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-gray-300 hover:text-white hover:bg-gray-800"
                      >
                        sign in
                      </Button>
                    </Link>
                    <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                      <Button size="sm" className="w-full bg-white text-black hover:bg-gray-200">
                        sign up
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="text-gray-400 text-sm text-center py-2">demo mode</div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}
