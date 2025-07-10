"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Brain, Mic, Type, Sparkles, ArrowRight } from "lucide-react"
import VoiceInput from "@/components/VoiceInput"
import XPDisplay from "@/components/XPDisplay"
import XPNotification from "@/components/XPNotification"
import { useAuth } from "@/context/AuthContext"
import { updateUserXP, XP_REWARDS } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function InputPage() {
  const [input, setInput] = useState("")
  const [inputMethod, setInputMethod] = useState<"text" | "voice">("text")
  const [isGenerating, setIsGenerating] = useState(false)
  const [xpNotification, setXpNotification] = useState<{
    xpGained: number
    reason: string
    currentXP: number
  } | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const { user, userProfile, refreshProfile } = useAuth()
  const router = useRouter()

  const handleVoiceTranscript = (transcript: string) => {
    setInput((prev) => prev + " " + transcript)
  }

  const handleXPEarned = async (amount: number) => {
    if (user && userProfile) {
      await updateUserXP(user.id, amount, "Voice input used")
      await refreshProfile()

      setXpNotification({
        xpGained: amount,
        reason: "Voice input used",
        currentXP: userProfile.xp + amount,
      })
    }
  }

  const handleGenerate = async () => {
    if (!input.trim()) return

    setIsGenerating(true)
    setErrorMsg(null)

    try {
      const response = await fetch("/api/generate-mindmap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notes: input }),
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        setErrorMsg(errData.error || "Failed to generate mind map")
        return
      }

      const data = await response.json()

      // Award XP for creating mind map
      if (user && userProfile) {
        await updateUserXP(user.id, XP_REWARDS.CREATE_MINDMAP, "Mind map created")
        await refreshProfile()

        setXpNotification({
          xpGained: XP_REWARDS.CREATE_MINDMAP,
          reason: "Mind map created",
          currentXP: userProfile.xp + XP_REWARDS.CREATE_MINDMAP,
        })
      }

      // Redirect to the generated mind map
      router.push(`/map/${data.id}`)
    } catch (error: any) {
      setErrorMsg(error.message || "Error generating mind map")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {/* XP Display */}
        {userProfile && (
          <div className="mb-6">
            <XPDisplay currentXP={userProfile.xp} />
          </div>
        )}
        {/* Error Alert */}
        {errorMsg && (
          <Alert variant="destructive" className="mb-6 bg-red-500/10 border-red-500/20">
            <AlertDescription>{errorMsg}</AlertDescription>
          </Alert>
        )}
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            create your mind map
          </h1>
          <p className="text-gray-400 text-lg">
            describe your topic and let AI transform it into a structured visual map
          </p>
        </div>

        {/* Input Method Toggle */}
        <div className="flex justify-center mb-6">
          <div className="flex bg-gray-800 rounded-lg p-1">
            <Button
              variant={inputMethod === "text" ? "default" : "ghost"}
              size="sm"
              onClick={() => setInputMethod("text")}
              className="flex items-center gap-2"
            >
              <Type className="w-4 h-4" />
              Text Input
            </Button>
            <Button
              variant={inputMethod === "voice" ? "default" : "ghost"}
              size="sm"
              onClick={() => setInputMethod("voice")}
              className="flex items-center gap-2"
            >
              <Mic className="w-4 h-4" />
              Voice Input
              <Badge variant="secondary" className="text-xs">
                +3 XP
              </Badge>
            </Button>
          </div>
        </div>

        {/* Input Section */}
        <Card className="bg-gray-900/50 border-gray-800 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-blue-400" />
              <span className="text-white">{inputMethod === "text" ? "describe your topic" : "speak your ideas"}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {inputMethod === "text" ? (
              <Textarea
                placeholder="e.g., 'Project management workflow for a software development team' or 'The causes and effects of climate change'"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-[120px] bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              />
            ) : (
              <div className="space-y-4">
                <VoiceInput
                  onTranscript={handleVoiceTranscript}
                  onXPEarned={handleXPEarned}
                  className="bg-gray-800 rounded-lg p-6"
                />
                {input && (
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <p className="text-sm text-gray-400 mb-2">Captured text:</p>
                    <p className="text-white">{input}</p>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Sparkles className="w-4 h-4" />
                <span>AI will structure your ideas into a visual mind map</span>
              </div>
              <Button
                onClick={handleGenerate}
                disabled={!input.trim() || isGenerating}
                className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    Generate Mind Map
                    <ArrowRight className="w-4 h-4" />
                    <Badge variant="secondary" className="text-xs">
                      +10 XP
                    </Badge>
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tips */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-3 text-blue-400">💡 Tips for better mind maps:</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>• Be specific about your topic or question</li>
              <li>• Include context or background information</li>
              <li>• Mention any specific aspects you want to explore</li>
              <li>• Use voice input to earn bonus XP while describing your ideas</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* XP Notification */}
      {xpNotification && (
        <XPNotification
          xpGained={xpNotification.xpGained}
          reason={xpNotification.reason}
          currentXP={xpNotification.currentXP}
          onComplete={() => setXpNotification(null)}
        />
      )}
    </div>
  )
}
