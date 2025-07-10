"use client"

import { useAuth } from "@/context/AuthContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function DebugAuthPage() {
  const { user, userProfile, loading } = useAuth()

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold mb-8">Auth Debug Info</h1>
        
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle>Auth Context State</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Badge variant={loading ? "destructive" : "default"} className="mb-2">
                  Loading: {loading ? "true" : "false"}
                </Badge>
                <p className="text-sm text-gray-400">Auth context loading state</p>
              </div>
              <div>
                <Badge variant={user ? "default" : "secondary"} className="mb-2">
                  User: {user ? "authenticated" : "null"}
                </Badge>
                <p className="text-sm text-gray-400">Current user state</p>
              </div>
            </div>
            
            {user && (
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">User Details:</h3>
                <pre className="text-xs text-gray-300 overflow-auto">
                  {JSON.stringify(user, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle>User Profile</CardTitle>
          </CardHeader>
          <CardContent>
            {userProfile ? (
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <pre className="text-xs text-gray-300 overflow-auto">
                  {JSON.stringify(userProfile, null, 2)}
                </pre>
              </div>
            ) : (
              <p className="text-gray-400">No user profile found</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle>Supabase Config</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-400">URL:</span> {process.env.NEXT_PUBLIC_SUPABASE_URL || "not set"}</p>
              <p><span className="text-gray-400">Anon Key:</span> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "set" : "not set"}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
