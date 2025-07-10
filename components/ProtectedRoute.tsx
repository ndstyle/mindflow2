"use client"

import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import LoadingSpinner from "./LoadingSpinner"

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const router = useRouter()

  console.log('ProtectedRoute - user:', user?.email, 'loading:', loading)

  useEffect(() => {
    if (!loading && !user) {
      console.log('Redirecting to login - no user and not loading')
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading) {
    console.log('ProtectedRoute - showing loading state')
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    console.log('ProtectedRoute - no user, returning null')
    return null
  }

  console.log('ProtectedRoute - rendering children')
  return <>{children}</>
}
