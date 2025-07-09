"use client"
import { useAuth } from "@/context/AuthContext"
import { getUserLevel } from "@/lib/supabase"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Flame, Star, Trophy } from "lucide-react"

export function XPDisplay() {
  const { userProfile } = useAuth()

  if (!userProfile) return null

  const currentLevel = getUserLevel(userProfile.xp)
  const nextLevel = getUserLevel(userProfile.xp + 1)
  const isMaxLevel = currentLevel.level === 6

  // Calculate progress to next level
  const currentLevelXP = currentLevel.minXP
  const nextLevelXP = isMaxLevel ? currentLevel.minXP + 1000 : nextLevel.minXP
  const progressXP = userProfile.xp - currentLevelXP
  const totalXPNeeded = nextLevelXP - currentLevelXP
  const progressPercentage = Math.min((progressXP / totalXPNeeded) * 100, 100)

  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 space-y-4">
      {/* Level and XP */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-400" />
          <span className={`font-bold ${currentLevel.color}`}>Level {currentLevel.level}</span>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-400">Total XP</div>
          <div className="font-bold text-white">{userProfile.xp}</div>
        </div>
      </div>

      {/* Level Name */}
      <div className="text-center">
        <Badge variant="outline" className={`${currentLevel.color} border-current`}>
          {currentLevel.name}
        </Badge>
      </div>

      {/* Progress Bar */}
      {!isMaxLevel && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Progress to Level {nextLevel.level}</span>
            <span className="text-gray-400">
              {progressXP} / {totalXPNeeded} XP
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      )}

      {/* Streak */}
      <div className="flex items-center justify-center gap-2 pt-2 border-t border-gray-800">
        <Flame className="w-4 h-4 text-orange-400" />
        <span className="text-sm text-gray-300">{userProfile.streak_count} day streak</span>
        <Star className="w-4 h-4 text-yellow-400" />
      </div>
    </div>
  )
}
