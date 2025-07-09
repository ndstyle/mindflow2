"use client"

import { useAuth } from "@/context/AuthContext"
import ProtectedRoute from "@/components/ProtectedRoute"
import DashboardContent from "@/components/dashboard-content"

export default function DashboardPage() {
  const { user, isDemoMode, userProfile } = useAuth()

  return (
    <ProtectedRoute>
      <DashboardContent user={user} isDemoMode={isDemoMode} userProfile={userProfile} />
    </ProtectedRoute>
  )
}
