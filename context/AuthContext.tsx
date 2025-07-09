'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

// Types
interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null; data: { user: User | null; session: Session | null } }>
  signOut: () => Promise<{ error: AuthError | null }>
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>
}

interface AuthProviderProps {
  children: React.ReactNode
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Auth Provider Component
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  // Initialize auth state
  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setSession(session)
        setUser(session?.user ?? null)
      } catch (error) {
        console.error('Error getting initial session:', error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    // Cleanup subscription
    return () => subscription.unsubscribe()
  }, [])

  // Sign in method
  const signIn = async (email: string, password: string) => {
    try {
      // First check if user is already signed in
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      
      if (currentSession) {
        // User is already signed in, sign them out first
        await supabase.auth.signOut()
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        return { error }
      }
      
      return { error: null }
    } catch (error) {
      return { 
        error: { 
          message: 'An unexpected error occurred', 
          name: 'UnexpectedError',
          status: 500 
        } as AuthError 
      }
    }
  }

  // Sign up method
  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })
      
      return { error, data }
    } catch (error) {
      return { 
        error: { 
          message: 'An unexpected error occurred', 
          name: 'UnexpectedError',
          status: 500 
        } as AuthError,
        data: { user: null, session: null }
      }
    }
  }

  // Sign out method
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      return { error }
    } catch (error) {
      return { 
        error: { 
          message: 'An unexpected error occurred', 
          name: 'UnexpectedError',
          status: 500 
        } as AuthError 
      }
    }
  }

  // Reset password method
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      
      return { error }
    } catch (error) {
      return { 
        error: { 
          message: 'An unexpected error occurred', 
          name: 'UnexpectedError',
          status: 500 
        } as AuthError 
      }
    }
  }

  const value: AuthContextType = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  
  return context
}

// Export the context for direct access if needed
export { AuthContext } 