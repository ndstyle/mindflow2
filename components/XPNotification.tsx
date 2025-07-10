"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Zap, Trophy } from "lucide-react"
import { getUserLevel } from "@/lib/supabase"

interface XPNotificationProps {
  xpGained: number
  reason: string
  currentXP: number
  onComplete?: () => void
}

export default function XPNotification({ xpGained, reason, currentXP, onComplete }: XPNotificationProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [showLevelUp, setShowLevelUp] = useState(false)

  const previousLevel = getUserLevel(currentXP - xpGained)
  const currentLevel = getUserLevel(currentXP)
  const leveledUp = currentLevel.level > previousLevel.level

  useEffect(() => {
    if (leveledUp) {
      setShowLevelUp(true)
    }

    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => {
        onComplete?.()
      }, 500)
    }, 3000)

    return () => clearTimeout(timer)
  }, [leveledUp, onComplete])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.8 }}
          className="fixed top-4 right-4 z-50"
        >
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg shadow-lg border border-blue-400/50">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-yellow-300" />
              <span className="font-bold">+{xpGained} XP</span>
            </div>
            <p className="text-sm opacity-90">{reason}</p>

            {showLevelUp && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-3 p-2 bg-yellow-500/20 rounded border border-yellow-400/30"
              >
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-yellow-300" />
                  <span className="text-sm font-bold">Level Up!</span>
                </div>
                <p className="text-xs opacity-90">
                  You're now a {currentLevel.name} (Level {currentLevel.level})
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
