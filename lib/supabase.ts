import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const isConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey)
}

export const isDemoMode = () => {
  return !isConfigured()
}

// Mock user for demo mode
export const mockUser = {
  id: "demo-user-id",
  email: "demo@example.com",
  created_at: new Date().toISOString(),
}

export const mockSession = {
  access_token: "demo-token",
  refresh_token: "demo-refresh",
  expires_in: 3600,
  token_type: "bearer",
  user: mockUser,
}

// Level system
export const getUserLevel = (xp: number) => {
  const levels = [
    { level: 1, name: "Seedling Thinker", minXP: 0, color: "text-green-400" },
    { level: 2, name: "Idea Sprout", minXP: 100, color: "text-blue-400" },
    { level: 3, name: "Mind Mapper", minXP: 250, color: "text-purple-400" },
    { level: 4, name: "Thought Architect", minXP: 500, color: "text-orange-400" },
    { level: 5, name: "Concept Master", minXP: 1000, color: "text-red-400" },
    { level: 6, name: "Mind Flow Guru", minXP: 2000, color: "text-yellow-400" },
  ]

  for (let i = levels.length - 1; i >= 0; i--) {
    if (xp >= levels[i].minXP) {
      return levels[i]
    }
  }
  return levels[0]
}

// Calculate streak
export const calculateStreak = (lastActivity: string) => {
  const now = new Date()
  const last = new Date(lastActivity)
  const diffDays = Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 1 // Same day
  if (diffDays === 1) return 1 // Next day, maintain streak
  return 0 // Streak broken
}

// User profile functions
export const createUserProfile = async (userId: string, email: string) => {
  return await supabase.from("user_profiles").insert({
    user_id: userId,
    email,
    xp: 25, // Welcome bonus
    level: 1,
    streak_count: 1,
    last_activity: new Date().toISOString(),
  })
}

export const getUserProfile = async (userId: string) => {
  return await supabase.from("user_profiles").select("*").eq("user_id", userId).single()
}

export const updateUserXP = async (userId: string, xpAmount: number, reason: string) => {
  const { data: profile } = await getUserProfile(userId)
  if (!profile) throw new Error("Profile not found")

  const newXP = profile.xp + xpAmount
  const oldLevel = getUserLevel(profile.xp).level
  const newLevel = getUserLevel(newXP).level
  const leveledUp = newLevel > oldLevel

  const { data, error } = await supabase
    .from("user_profiles")
    .update({
      xp: newXP,
      level: newLevel,
      last_activity: new Date().toISOString(),
    })
    .eq("user_id", userId)
    .select()
    .single()

  return {
    data,
    error,
    xpGained: xpAmount,
    newLevel: leveledUp,
  }
}
