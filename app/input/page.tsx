"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Brain, Sparkles, AlertCircle } from "lucide-react"
import { VoiceInput } from "@/components/VoiceInput"
import { XPDisplay } from "@/components/XPDisplay"
import { XPNotification } from "@/components/XPNotification"
import Navbar from "@/components/navbar"

export default function InputPage() {
  const [input, setInput] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [xpNotification, setXpNotification] = useState<{
    xpGained: number
    reason: string
    newLevel?: boolean
  } | null>(null)

  const { user, addXP } = useAuth()
  const router = useRouter()

  const handleVoiceTranscript = (transcript: string) => {
    setInput(transcript)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch("/api/generate-mindmap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: input.trim() }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate mind map")
      }

      const data = await response.json()

      // Award XP for creating a mind map
      if (user) {
        const result = await addXP(10, "Mind map created")
        if (result.xpGained) {
          setXpNotification({
            xpGained: result.xpGained,
            reason: "Mind map created",
            newLevel: result.newLevel,
          })
        }
      }

      // Redirect to the generated mind map
      router.push(`/map/${data.id}`)
    } catch (err) {
      setError("Failed to generate mind map. Please try again.")
      console.error("Error generating mind map:", err)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Brain className="w-8 h-8 text-blue-400" />
              <h1 className="text-3xl font-bold">Create Mind Map</h1>
              <Sparkles className="w-6 h-6 text-yellow-400" />
            </div>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Transform your messy thoughts into structured mind maps. Type or speak your ideas, and watch AI instantly
              organize them into beautiful, interactive visualizations.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Input Area */}
            <div className="lg:col-span-2">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-blue-400" />
                    Your Ideas
                  </CardTitle>
                  <CardDescription>
                    Paste your notes, thoughts, or research. Or use voice input to speak naturally.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Voice Input */}
                  <div className="flex justify-center py-4 border-b border-gray-800">
                    <VoiceInput onTranscript={handleVoiceTranscript} disabled={isGenerating} />
                  </div>

                  {/* Text Input */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Paste your messy notes here, or use voice input above...

Example:
- Project planning for mobile app
- User research findings
- Feature requirements
- Technical architecture
- Marketing strategy"
                      className="min-h-[300px] bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 resize-none"
                      disabled={isGenerating}
                    />

                    {error && (
                      <Alert variant="destructive" className="bg-red-500/10 border-red-500/20">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <Button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg"
                      disabled={!input.trim() || isGenerating}
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Generating Mind Map...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-5 w-5" />
                          Generate Mind Map (+10 XP)
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* XP Display */}
              {user && <XPDisplay />}

              {/* Tips */}
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-lg">💡 Pro Tips</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-blue-400">🎤</span>
                    <span>Use voice input for natural idea capture (+3 XP)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-400">📝</span>
                    <span>Include bullet points, keywords, and concepts</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-purple-400">🧠</span>
                    <span>AI works best with 50-500 words of content</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-yellow-400">⚡</span>
                    <span>Create mind maps daily to build your streak</span>
                  </div>
                </CardContent>
              </Card>

              {/* XP Rewards */}
              <Card className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-800/50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-400" />
                    Earn XP
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Voice input</span>
                    <span className="text-blue-400">+3 XP</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Create mind map</span>
                    <span className="text-green-400">+10 XP</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Daily streak</span>
                    <span className="text-orange-400">+5 XP</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Edit nodes</span>
                    <span className="text-purple-400">+2 XP</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* XP Notification */}
      {xpNotification && (
        <XPNotification
          xpGained={xpNotification.xpGained}
          reason={xpNotification.reason}
          newLevel={xpNotification.newLevel}
          onComplete={() => setXpNotification(null)}
        />
      )}
    </div>
  )
}
