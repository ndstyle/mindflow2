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
        <div className="flex justify-center">
          <Link href="/input">
            <Button size="lg" className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
              Go to Mind Map Creator
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
