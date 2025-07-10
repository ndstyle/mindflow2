"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { supabase, getUserLevel, calculateStreak } from "@/lib/supabase"
import type { User, Session } from "@supabase/supabase-js"

interface UserProfile {
  id: string
  user_id: string
  xp: number
  level: number
  streak: number
  last_activity: string
  total_mindmaps: number
  total_nodes: number
  created_at: string
  updated_at: string
}

interface AuthContextType {
  user: User | null
  session: Session | null
  userProfile: UserProfile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signUp: (email: string, password: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>
  addXP: (amount: number, reason?: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        loadUserProfile(session.user.id)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        await loadUserProfile(session.user.id)
      } else {
        setUserProfile(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase.from("user_profiles").select("*").eq("user_id", userId).single()

      if (error && error.code === "PGRST116") {
        // Profile doesn't exist, create one
        const newProfile = {
          user_id: userId,
          xp: 25, // Welcome bonus
          level: 1,
          streak: 1,
          last_activity: new Date().toISOString(),
          total_mindmaps: 0,
          total_nodes: 0,
        }

        const { data: createdProfile, error: createError } = await supabase
          .from("user_profiles")
          .insert(newProfile)
          .select()
          .single()

        if (!createError && createdProfile) {
          setUserProfile(createdProfile)
        }
      } else if (!error && data) {
        // Update streak based on last activity
        const currentStreak = calculateStreak(data.last_activity)
        if (currentStreak !== data.streak) {
          const { data: updatedProfile } = await supabase
            .from("user_profiles")
            .update({
              streak: currentStreak,
              last_activity: new Date().toISOString(),
            })
            .eq("user_id", userId)
            .select()
            .single()

          if (updatedProfile) {
            setUserProfile(updatedProfile)
          }
        } else {
          setUserProfile(data)
        }
      }
    } catch (err) {
      console.error("Error loading user profile:", err)
    }
  }

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!user || !userProfile) return

    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id)
        .select()
        .single()

      if (!error && data) {
        setUserProfile(data)
      }
    } catch (err) {
      console.error("Error updating user profile:", err)
    }
  }

  const addXP = async (amount: number, reason?: string) => {
    if (!userProfile) return

    const newXP = userProfile.xp + amount
    const newLevel = getUserLevel(newXP).level

    await updateUserProfile({
      xp: newXP,
      level: newLevel,
      last_activity: new Date().toISOString(),
    })

    console.log(`+${amount} XP${reason ? ` for ${reason}` : ""}`)
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      return { error: error?.message }
    } catch (err) {
      return { error: "Network error - please try again" }
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })
      return { error: error?.message }
    } catch (err) {
      return { error: "Network error - please try again" }
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        userProfile,
        loading,
        signIn,
        signUp,
        signOut,
        updateUserProfile,
        addXP,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
