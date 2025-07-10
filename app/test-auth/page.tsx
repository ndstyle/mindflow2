"use client"

import { useAuth } from "@/context/AuthContext"
import { useEffect } from "react"

export default function TestAuthPage() {
  const { user, userProfile, loading } = useAuth()

  useEffect(() => {
    console.log('Test Auth Page - Auth State:', {
      user: user ? { id: user.id, email: user.email } : null,
      userProfile: userProfile ? { id: userProfile.id, email: userProfile.email, xp: userProfile.xp } : null,
      loading
    })
  }, [user, loading])

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Auth Test Page</h1>
        
        <div className="space-y-4">
          <div className="bg-gray-900 p-4 rounded">
            <h2 className="text-xl font-semibold mb-2">Current Auth State</h2>
            <div className="space-y-2 text-sm">
              <p>Loading: {loading ? 'true' : 'false'}</p>
              <p>User: {user ? user.email : 'null'}</p>
              <p>User Profile: {userProfile ? userProfile.email : 'null'}</p>
            </div>
          </div>

          <div className="bg-gray-900 p-4 rounded">
            <h2 className="text-xl font-semibold mb-2">Raw Data</h2>
            <pre className="text-xs overflow-auto">
              {JSON.stringify({
                user: user ? { id: user.id, email: user.email } : null,
                userProfile: userProfile ? { id: userProfile.id, email: userProfile.email, xp: userProfile.xp } : null,
                loading
              }, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
} 