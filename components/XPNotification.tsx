"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Star, Trophy, Zap } from "lucide-react"

interface XPNotificationProps {
  xpGained: number
  reason: string
  levelUp?: boolean
  onComplete?: () => void
}

export default function XPNotification({ xpGained, reason, levelUp, onComplete }: XPNotificationProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      onComplete?.()
    }, 3000)

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.8 }}
          className="fixed top-4 right-4 z-50"
        >
          <div
            className={`
            p-4 rounded-lg border shadow-lg backdrop-blur-sm
            ${
              levelUp
                ? "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30"
                : "bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/30"
            }
          `}
          >
            <div className="flex items-center gap-3">
              {levelUp ? <Trophy className="w-6 h-6 text-yellow-400" /> : <Zap className="w-6 h-6 text-blue-400" />}

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold">+{xpGained} XP</span>
                  {levelUp && (
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: 2 }}>
                      <Star className="w-4 h-4 text-yellow-400" />
                    </motion.div>
                  )}
                </div>
                <div className="text-sm text-gray-300">{reason}</div>
                {levelUp && <div className="text-sm font-bold text-yellow-400">🎉 Level Up!</div>}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
