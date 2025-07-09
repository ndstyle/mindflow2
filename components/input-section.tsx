"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Sparkles } from "lucide-react"
import VoiceInput from "./VoiceInput"
import { useAuth } from "@/context/AuthContext"
import Link from "next/link"

export default function InputSection() {
  const [input, setInput] = useState("")
  const { user } = useAuth()

  const handleVoiceTranscript = (transcript: string) => {
    setInput((prev) => prev + (prev ? " " : "") + transcript)
  }

  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Transform Your Ideas</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Speak or type your thoughts, and watch them become structured mind maps
          </p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              Quick Input
            </CardTitle>
            <CardDescription>
              Share your ideas using voice or text - we'll turn them into beautiful mind maps
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Textarea
                placeholder="Type your ideas here, or use the voice button to speak them..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-[120px] pr-12"
              />
              <div className="absolute bottom-3 right-3">
                <VoiceInput onTranscript={handleVoiceTranscript} />
              </div>
            </div>

            <div className="flex justify-center">
              {user ? (
                <Link href={`/input${input ? `?text=${encodeURIComponent(input)}` : ""}`}>
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                  >
                    Create Mind Map
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <Link href="/signup">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                  >
                    Sign Up to Create
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
