"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, Volume2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/context/AuthContext"

interface VoiceInputProps {
  onTranscript: (text: string) => void
  disabled?: boolean
}

export function VoiceInput({ onTranscript, disabled }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [transcript, setTranscript] = useState("")
  const recognitionRef = useRef<any | null>(null)
  const { addXP } = useAuth()

  useEffect(() => {
    // Check if speech recognition is supported
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      setIsSupported(!!SpeechRecognition)

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition()
        recognition.continuous = true
        recognition.interimResults = true
        recognition.lang = "en-US"

        recognition.onstart = () => {
          setIsListening(true)
        }

        recognition.onresult = (event) => {
          let finalTranscript = ""
          let interimTranscript = ""

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript
            if (event.results[i].isFinal) {
              finalTranscript += transcript
            } else {
              interimTranscript += transcript
            }
          }

          const fullTranscript = finalTranscript || interimTranscript
          setTranscript(fullTranscript)
          onTranscript(fullTranscript)
        }

        recognition.onend = () => {
          setIsListening(false)
          if (transcript.trim()) {
            // Award XP for using voice input
            addXP(3, "Voice input used")
          }
        }

        recognition.onerror = (event) => {
          console.error("Speech recognition error:", event.error)
          setIsListening(false)
        }

        recognitionRef.current = recognition
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [onTranscript, transcript, addXP])

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setTranscript("")
      recognitionRef.current.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
    }
  }

  if (!isSupported) {
    return <div className="text-sm text-gray-500 text-center p-2">Voice input not supported in this browser</div>
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          variant={isListening ? "destructive" : "outline"}
          size="lg"
          className={`relative h-16 w-16 rounded-full ${
            isListening ? "bg-red-600 hover:bg-red-700 border-red-500" : "border-gray-600 hover:bg-gray-800"
          }`}
          onMouseDown={startListening}
          onMouseUp={stopListening}
          onMouseLeave={stopListening}
          onTouchStart={startListening}
          onTouchEnd={stopListening}
          disabled={disabled}
        >
          <AnimatePresence mode="wait">
            {isListening ? (
              <motion.div
                key="listening"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="flex items-center justify-center"
              >
                <MicOff className="w-6 h-6" />
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="flex items-center justify-center"
              >
                <Mic className="w-6 h-6" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pulsing animation when listening */}
          {isListening && (
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-red-400"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [1, 0, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
          )}
        </Button>
      </motion.div>

      <div className="text-center">
        <div className="text-sm font-medium text-gray-300">{isListening ? "Listening..." : "Hold to Record"}</div>
        <div className="text-xs text-gray-500 mt-1">+3 XP for voice input</div>
      </div>

      {/* Live transcript display */}
      <AnimatePresence>
        {isListening && transcript && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-2 p-3 bg-gray-800/50 border border-gray-700 rounded-lg max-w-md"
          >
            <div className="flex items-center gap-2 mb-1">
              <Volume2 className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-400">Live Transcript</span>
            </div>
            <p className="text-sm text-gray-300">{transcript}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
