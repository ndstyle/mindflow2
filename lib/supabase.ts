import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// XP and Level System
export const XP_REWARDS = {
  CREATE_MINDMAP: 10,
  VOICE_INPUT: 3,
  EDIT_NODE: 2,
  COMPLETE_ONBOARDING: 25,
  DAILY_STREAK: 5,
}

export const LEVELS = [
  { name: "Seedling Thinker", minXP: 0, color: "#10b981" },
  { name: "Idea Sprout", minXP: 50, color: "#3b82f6" },
  { name: "Mind Gardener", minXP: 150, color: "#8b5cf6" },
  { name: "Thought Architect", minXP: 300, color: "#f59e0b" },
  { name: "Concept Master", minXP: 500, color: "#ef4444" },
  { name: "Mind Flow Guru", minXP: 1000, color: "#eab308" },
]

export function getUserLevel(xp: number) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXP) {
      return {
        ...LEVELS[i],
        level: i + 1,
        progress:
          i < LEVELS.length - 1 ? ((xp - LEVELS[i].minXP) / (LEVELS[i + 1].minXP - LEVELS[i].minXP)) * 100 : 100,
      }
    }
  }
  return { ...LEVELS[0], level: 1, progress: 0 }
}

export function getXPToNextLevel(xp: number) {
  const currentLevel = getUserLevel(xp)
  const nextLevelIndex = currentLevel.level

  if (nextLevelIndex >= LEVELS.length) {
    return 0 // Max level reached
  }

  return LEVELS[nextLevelIndex].minXP - xp
}

export function calculateStreak(lastActivity: string): number {
  const now = new Date()
  const lastDate = new Date(lastActivity)
  const diffTime = Math.abs(now.getTime() - lastDate.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays <= 1) {
    return 1 // Same day or yesterday
  } else {
    return 1 // Reset streak
  }
}

export function isSupabaseConfigured() {
  const hasUrl = Boolean(supabaseUrl && supabaseUrl.length > 0)
  const hasKey = Boolean(supabaseAnonKey && supabaseAnonKey.length > 0)
  
  console.log('Supabase config check:', {
    hasUrl,
    hasKey,
    urlLength: supabaseUrl?.length,
    keyLength: supabaseAnonKey?.length
  })
  
  if (!hasUrl) {
    console.warn('Supabase URL not configured')
  }
  if (!hasKey) {
    console.warn('Supabase anon key not configured')
  }
  
  return hasUrl && hasKey
}

// Database functions
export async function createUserProfile(userId: string, email: string) {
  const { data, error } = await supabase
    .from("user_profiles")
    .insert([
      {
        id: userId,
        email: email,
        total_xp: XP_REWARDS.COMPLETE_ONBOARDING,
        current_streak: 1,
        last_login: new Date().toISOString(),
      },
    ])
    .select()
    .single()

  if (error) {
    console.error("Error creating user profile:", error)
    return null
  }

  return data
}

export async function getUserProfile(userId: string) {
  console.log('Fetching user profile for userId:', userId)
  
  const { data, error } = await supabase.from("user_profiles").select("*").eq("id", userId).single()

  if (error) {
    console.error("Error fetching user profile:", error)
    console.error("Error details:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code
    })
    return null
  }

  console.log('User profile fetched successfully:', data)
  return data
}

export async function updateUserXP(userId: string, xpToAdd: number, reason: string) {
  const profile = await getUserProfile(userId)
  if (!profile) return null

  const newXP = profile.total_xp + xpToAdd

  const { data, error } = await supabase
    .from("user_profiles")
    .update({
      total_xp: newXP,
      last_login: new Date().toISOString(),
    })
    .eq("id", userId)
    .select()
    .single()

  if (error) {
    console.error("Error updating user XP:", error)
    return null
  }

  return data
}

export async function makeMindMapPublic(id: string, userId: string) {
  // Generate a simple random share token
  const share_token = Math.random().toString(36).substring(2, 10) + Date.now().toString(36)
  const { data, error } = await supabase
    .from('mind_maps')
    .update({ is_public: true, share_token })
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single()
  if (error) {
    console.error('Error making mind map public:', error)
    return null
  }
  return data
}

export async function getMindMapByShareToken(token: string) {
  const { data, error } = await supabase
    .from('mind_maps')
    .select('*')
    .eq('share_token', token)
    .eq('is_public', true)
    .single()
  if (error) {
    console.error('Error fetching mind map by share token:', error)
    return null
  }
  return data
}
