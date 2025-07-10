import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Check if Supabase is configured
export function isSupabaseConfigured(): boolean {
  return !!(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== "your-supabase-url" &&
    supabaseAnonKey !== "your-supabase-anon-key"
  )
}

// Level system
export function getUserLevel(xp: number) {
  const levels = [
    { level: 1, name: "Seedling Thinker", minXP: 0, color: "text-green-400" },
    { level: 2, name: "Idea Sprout", minXP: 100, color: "text-blue-400" },
    { level: 3, name: "Mind Gardener", minXP: 250, color: "text-purple-400" },
    { level: 4, name: "Thought Architect", minXP: 500, color: "text-orange-400" },
    { level: 5, name: "Concept Master", minXP: 1000, color: "text-red-400" },
    { level: 6, name: "Mind Flow Guru", minXP: 2000, color: "text-yellow-400" },
  ]

  for (let i = levels.length - 1; i >= 0; i--) {
    if (xp >= levels[i].minXP) {
      return {
        ...levels[i],
        progress:
          i < levels.length - 1 ? ((xp - levels[i].minXP) / (levels[i + 1].minXP - levels[i].minXP)) * 100 : 100,
        nextLevelXP: i < levels.length - 1 ? levels[i + 1].minXP : null,
      }
    }
  }

  return { ...levels[0], progress: 0, nextLevelXP: levels[1].minXP }
}

// Calculate streak based on last activity
export function calculateStreak(lastActivity: string): number {
  const lastDate = new Date(lastActivity)
  const today = new Date()
  const diffTime = Math.abs(today.getTime() - lastDate.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays <= 1) {
    return 1 // Same day or yesterday
  } else if (diffDays === 2) {
    return 1 // Reset but give them today
  } else {
    return 1 // Reset streak
  }
}
