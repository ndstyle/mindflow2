"use client"

import { useAuth } from "@/context/AuthContext"
import { getUserLevel } from "@/lib/supabase"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Flame, Star, Trophy } from "lucide-react"

export default function XPDisplay() {
  const { userProfile } = useAuth()

  if (!userProfile) {
    return null
  }

  const levelInfo = getUserLevel(userProfile.xp)

  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 space-y-3">
      {/* Level and XP */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-400" />
          <div>
            <div className="text-sm font-medium text-white">Level {levelInfo.level}</div>
            <div className={`text-xs ${levelInfo.color}`}>{levelInfo.name}</div>
          </div>
        </div>
        <Badge variant="outline" className="border-blue-500/20 text-blue-400">
          {userProfile.xp} XP
        </Badge>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-gray-400">
          <span>Progress to next level</span>
          <span>{levelInfo.nextLevelXP ? `${userProfile.xp}/${levelInfo.nextLevelXP}` : "Max Level"}</span>
        </div>
        <Progress value={levelInfo.progress} className="h-2" />
      </div>

      {/* Streak */}
      <div className="flex items-center gap-2">
        <Flame className="w-4 h-4 text-orange-400" />
        <span className="text-sm text-gray-300">{userProfile.streak} day streak</span>
        {userProfile.streak >= 7 && <Star className="w-4 h-4 text-yellow-400" />}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-800">
        <div className="text-center">
          <div className="text-lg font-bold text-white">{userProfile.total_mindmaps}</div>
          <div className="text-xs text-gray-400">Mind Maps</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-white">{userProfile.total_nodes}</div>
          <div className="text-xs text-gray-400">Nodes Created</div>
        </div>
      </div>
    </div>
  )
}
