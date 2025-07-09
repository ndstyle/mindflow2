"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Trophy, Star } from "lucide-react"

interface XPNotificationProps {
  xpGained: number
  reason: string
  newLevel?: boolean
  onComplete?: () => void
}

export function XPNotification({ xpGained, reason, newLevel, onComplete }: XPNotificationProps) {
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
          exit={{ opacity: 0, y: -50, scale: 0.8 }}
          className="fixed top-4 right-4 z-50"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-4 shadow-lg border border-blue-500/20">
            <div className="flex items-center gap-3">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.5 }} className="flex-shrink-0">
                <Plus className="w-6 h-6" />
              </motion.div>

              <div className="flex-1">
                <div className="font-bold text-lg">+{xpGained} XP</div>
                <div className="text-sm opacity-90">{reason}</div>
              </div>

              {newLevel && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5, repeat: 2 }}
                  className="flex items-center gap-1 bg-yellow-500/20 rounded-full px-2 py-1"
                >
                  <Trophy className="w-4 h-4 text-yellow-400" />
                  <span className="text-xs font-bold">LEVEL UP!</span>
                </motion.div>
              )}
            </div>

            {newLevel && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-2 flex justify-center"
              >
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        scale: [1, 1.5, 1],
                        rotate: [0, 180, 360],
                      }}
                      transition={{
                        delay: i * 0.1,
                        duration: 0.5,
                      }}
                    >
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
