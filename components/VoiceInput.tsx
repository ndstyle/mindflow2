"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, Volume2 } from "lucide-react"
import { cn } from "@/lib/utils"

// Extend Window interface for speech recognition
declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

interface VoiceInputProps {
  onTranscript: (text: string) => void
  onXPEarned?: (amount: number) => void
  className?: string
}

export default function VoiceInput({ onTranscript, onXPEarned, className }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [error, setError] = useState<string | null>(null)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    setIsSupported(!!SpeechRecognition)

    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = "en-US"

      recognitionRef.current.onresult = (event: any) => {
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

        setTranscript(finalTranscript + interimTranscript)

        if (finalTranscript) {
          onTranscript(finalTranscript)
          onXPEarned?.(3) // Award 3 XP for voice input
        }
      }

      recognitionRef.current.onerror = (event: any) => {
        if (event.error === 'network') {
          setError('Speech recognition failed due to a network issue. Please check your internet connection or try a different browser.')
        } else {
          setError(`Speech recognition error: ${event.error}`)
        }
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [onTranscript, onXPEarned])

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setTranscript("")
      setError(null)
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  if (!isSupported) {
    return (
      <div className={cn("text-center p-4 bg-gray-100 rounded-lg", className)}>
        <MicOff className="w-8 h-8 mx-auto mb-2 text-gray-400" />
        <p className="text-sm text-gray-600">Voice input not supported in this browser</p>
      </div>
    )
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-center">
        <Button
          onMouseDown={startListening}
          onMouseUp={stopListening}
          onTouchStart={startListening}
          onTouchEnd={stopListening}
          className={cn(
            "w-16 h-16 rounded-full transition-all duration-200",
            isListening ? "bg-red-500 hover:bg-red-600 scale-110 animate-pulse" : "bg-blue-500 hover:bg-blue-600",
          )}
          size="lg"
        >
          {isListening ? <Volume2 className="w-6 h-6 text-white" /> : <Mic className="w-6 h-6 text-white" />}
        </Button>
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-600 mb-2">
          {isListening ? "Listening... (hold to continue)" : "Hold to speak"}
        </p>
        {transcript && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-800">{transcript}</p>
          </div>
        )}
        {error && (
          <div className="text-red-500 text-sm mt-2">{error}</div>
        )}
      </div>

      {isListening && (
        <div className="flex justify-center">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          </div>
        </div>
      )}
    </div>
  )
}
