"use client"

import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Star, Zap } from "lucide-react"
import { getUserLevel, getXPToNextLevel } from "@/lib/supabase"

interface XPDisplayProps {
  currentXP: number
  className?: string
}

export default function XPDisplay({ currentXP, className }: XPDisplayProps) {
  const levelInfo = getUserLevel(currentXP)
  const xpToNext = getXPToNextLevel(currentXP)

  return (
    <div
      className={`bg-gradient-to-r from-purple-500/10 to-blue-500/10 p-4 rounded-lg border border-purple-500/20 ${className}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5" style={{ color: levelInfo.color }} />
          <Badge variant="outline" style={{ borderColor: levelInfo.color, color: levelInfo.color }}>
            Level {levelInfo.level}
          </Badge>
          <span className="text-sm font-medium">{levelInfo.name}</span>
        </div>
        <div className="flex items-center gap-1">
          <Zap className="w-4 h-4 text-yellow-500" />
          <span className="font-bold">{currentXP} XP</span>
        </div>
      </div>

      {xpToNext > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-600">
            <span>Progress to Level {levelInfo.level + 1}</span>
            <span>{xpToNext} XP needed</span>
          </div>
          <Progress value={levelInfo.progress} className="h-2" />
        </div>
      )}

      {xpToNext === 0 && (
        <div className="text-center">
          <Badge className="bg-yellow-500 text-yellow-900">Max Level Reached!</Badge>
        </div>
      )}
    </div>
  )
}
