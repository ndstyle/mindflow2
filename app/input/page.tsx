"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import ProtectedRoute from "@/components/ProtectedRoute"
import VoiceInput from "@/components/VoiceInput"
import XPDisplay from "@/components/XPDisplay"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Loader2, Sparkles } from "lucide-react"

export default function InputPage() {
  const [input, setInput] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const { addXP } = useAuth()
  const router = useRouter()

  const handleVoiceTranscript = (transcript: string) => {
    setInput((prev) => prev + " " + transcript)
  }

  const handleGenerate = async () => {
    if (!input.trim()) return

    setIsGenerating(true)
    try {
      const response = await fetch("/api/generate-mindmap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: input.trim() }),
      })

      if (response.ok) {
        const data = await response.json()
        // Award XP for creating a mind map
        await addXP(10, "Created mind map")

        // Redirect to view the generated mind map
        router.push(`/map/${data.id}`)
      } else {
        console.error("Failed to generate mind map")
      }
    } catch (error) {
      console.error("Error generating mind map:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black text-white">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Brain className="w-8 h-8 text-blue-400" />
              <h1 className="text-3xl font-bold">Create Mind Map</h1>
            </div>
            <p className="text-gray-400">Transform your thoughts into structured mind maps using AI</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Input Section */}
            <div className="lg:col-span-2">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                    Your Ideas
                  </CardTitle>
                  <CardDescription>Type your thoughts or use voice input to capture your ideas</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Text Input */}
                  <div>
                    <Textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Enter your thoughts, notes, or ideas here... You can also use voice input below!"
                      className="min-h-[200px] bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 resize-none"
                    />
                  </div>

                  {/* Voice Input */}
                  <div className="flex flex-col items-center gap-4 py-6 border-t border-gray-800">
                    <h3 className="text-lg font-medium text-gray-300">Voice Input</h3>
                    <VoiceInput onTranscript={handleVoiceTranscript} disabled={isGenerating} />
                  </div>

                  {/* Generate Button */}
                  <Button
                    onClick={handleGenerate}
                    disabled={!input.trim() || isGenerating}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    size="lg"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Generating Mind Map...
                      </>
                    ) : (
                      <>
                        <Brain className="w-5 h-5 mr-2" />
                        Generate Mind Map (+10 XP)
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* XP Display */}
            <div className="lg:col-span-1">
              <XPDisplay />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
