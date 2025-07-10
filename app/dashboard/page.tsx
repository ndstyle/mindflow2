"use client"

import ProtectedRoute from "@/components/ProtectedRoute"
import DashboardContent from "@/components/dashboard-content"
import { Button } from "@/components/ui/button"
import CurrentUserInfo from "@/components/CurrentUserInfo";
import SignOutButton from "@/components/SignOutButton";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <CurrentUserInfo />
        <SignOutButton />
      </div>
      <DashboardContent />
    </ProtectedRoute>
  )
}
