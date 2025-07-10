"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/context/AuthContext"

export default function CurrentUserInfo() {
  const { user } = useAuth()

  if (!user) {
    return null
  }

  return (
    <div className="flex items-center gap-2">
      <Avatar className="h-8 w-8">
        <AvatarImage src={user.user_metadata?.avatar_url} />
        <AvatarFallback>
          {user.email?.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <span className="text-sm font-medium">{user.email}</span>
    </div>
  )
} 