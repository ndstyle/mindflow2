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
  total_mindmaps: number
  total_nodes: number
  xp: number
  streak: number
}

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  loading: boolean
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

  useEffect(() => {
    console.log('AuthContext: Initializing auth state...')
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('AuthContext: Got initial session:', session?.user?.email || 'no session')
      setUser(session?.user ?? null)
      if (session?.user) {
        loadUserProfile(session.user.id, session.user.email)
      } else {
        // No user signed in
        console.log('AuthContext: No session, setting loading to false')
        setLoading(false)
      }
    }).catch((error) => {
      console.error('AuthContext: Error getting initial session:', error)
      setLoading(false)
    })

    // Force loading to false after a short delay
    const forceLoadingTimeout = setTimeout(() => {
      console.log('AuthContext: Forcing loading to false after delay')
      setLoading(false)
    }, 500)

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email)
      setUser(session?.user ?? null)

      if (session?.user) {
        await loadUserProfile(session.user.id, session.user.email)
      } else {
        // User signed out
        setUserProfile(null)
        setLoading(false)
      }
    })

    return () => {
      clearTimeout(forceLoadingTimeout) // Cleanup timeout on unmount
      subscription.unsubscribe()
    }
  }, [])

  const loadUserProfile = async (userId: string, userEmail?: string) => {
    console.log('Loading user profile for:', userId, 'email:', userEmail)
    
    // Set a timeout for the profile loading
    const profileTimeoutId = setTimeout(() => {
      console.log('Profile loading timeout, setting loading to false')
      setLoading(false)
    }, 3000) // 3 second timeout for profile loading
    
    try {
      const profile = await getUserProfile(userId)
      clearTimeout(profileTimeoutId) // Clear timeout since we got a response
      
      if (profile) {
        console.log('Found existing profile:', profile)
        setUserProfile({
          ...profile,
          xp: profile.total_xp,
          streak: profile.current_streak,
          total_mindmaps: profile.total_mindmaps ?? 0,
          total_nodes: profile.total_nodes ?? 0,
        })
      } else {
        // Profile doesn't exist yet, create it
        console.log('User profile not found, creating new profile for user:', userId)
        const email = userEmail || user?.email || ''
        const newProfile = await createUserProfile(userId, email)
        if (newProfile) {
          console.log('Created new profile:', newProfile)
          setUserProfile({
            ...newProfile,
            xp: newProfile.total_xp,
            streak: newProfile.current_streak,
            total_mindmaps: newProfile.total_mindmaps ?? 0,
            total_nodes: newProfile.total_nodes ?? 0,
          })
        } else {
          console.error('Failed to create user profile for user:', userId)
          setUserProfile(null)
        }
      }
    } catch (error) {
      console.error('Error loading user profile:', error)
      setUserProfile(null)
    } finally {
      console.log('Setting loading to false')
      clearTimeout(profileTimeoutId) // Clear timeout in finally block too
      setLoading(false)
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
      await loadUserProfile(data.user.id, email)
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
    try {
      console.log('Signing out user...')
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Error signing out:', error)
      } else {
        console.log('User signed out successfully')
      }
      setUser(null)
      setUserProfile(null)
      // Force reload to clear all state and cookies
      if (typeof window !== 'undefined') {
        window.location.reload()
      }
    } catch (error) {
      console.error('Error in signOut function:', error)
      // Still clear the local state even if there's an error
      setUser(null)
      setUserProfile(null)
      if (typeof window !== 'undefined') {
        window.location.reload()
      }
    }
  }

  const refreshProfile = async () => {
    if (user) {
      await loadUserProfile(user.id, user.email)
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
