"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { supabase, createUserProfile, getUserProfile, updateUserXP } from "@/lib/supabase"

interface UserProfile {
  id: string
  email: string
  total_xp: number
  current_streak: number
  last_login: string
  total_mind_maps: number
  total_nodes: number
  xp: number
  streak: number
}

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  loading: boolean
  isDemoMode: boolean
  signUp: (email: string, password: string) => Promise<{ error: any }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
  addXP: (xp: number, reason: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDemoMode, setIsDemoMode] = useState(false)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        loadUserProfile(session.user.id)
      } else {
        // Demo mode for when no user is signed in
        setIsDemoMode(true)
        setUserProfile({
          id: "demo",
          email: "demo@example.com",
          total_xp: 150,
          current_streak: 3,
          last_login: "2024-01-01T00:00:00.000Z",
          total_mind_maps: 5,
          total_nodes: 25,
          xp: 150,
          streak: 3,
        })
      }
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)

      if (session?.user) {
        setIsDemoMode(false)
        await loadUserProfile(session.user.id)
      } else {
        setIsDemoMode(true)
        setUserProfile({
          id: "demo",
          email: "demo@example.com",
          total_xp: 150,
          current_streak: 3,
          last_login: "2024-01-01T00:00:00.000Z",
          total_mind_maps: 5,
          total_nodes: 25,
          xp: 150,
          streak: 3,
        })
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadUserProfile = async (userId: string) => {
    try {
      const profile = await getUserProfile(userId)
      if (profile) {
        setUserProfile({
          ...profile,
          xp: profile.total_xp,
          streak: profile.current_streak,
        })
      }
    } catch (error) {
      console.error("Error loading user profile:", error)
    }
  }

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (!error && data.user) {
      // Create user profile with welcome XP
      await createUserProfile(data.user.id, email)
      await loadUserProfile(data.user.id)
    }

    return { error }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    return { error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setUserProfile(null)
  }

  const refreshProfile = async () => {
    if (user) {
      await loadUserProfile(user.id)
    }
  }

  const addXP = async (xp: number, reason: string) => {
    if (user) {
      await updateUserXP(user.id, xp, reason)
      await loadUserProfile(user.id)
    }
  }

  const value = {
    user,
    userProfile,
    loading,
    isDemoMode,
    signUp,
    signIn,
    signOut,
    refreshProfile,
    addXP,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
