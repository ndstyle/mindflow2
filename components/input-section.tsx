"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Upload, Wand2, FileText } from "lucide-react"

export function InputSection() {
  const [input, setInput] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    if (!input.trim()) return

    setIsGenerating(true)
    // Simulate AI processing
    setTimeout(() => {
      setIsGenerating(false)
      // Here you would redirect to the mind map view
      console.log("Generating mind map for:", input)
    }, 2000)
  }

  const exampleText = `Project: Launch new mobile app
- Market research needed
- Design wireframes and mockups
- Develop MVP features: user auth, core functionality, payment integration
- Testing phase: unit tests, user testing, bug fixes
- Marketing strategy: social media, influencer partnerships, app store optimization
- Launch timeline: 3 months
- Budget considerations: development costs, marketing spend, ongoing maintenance
- Team: 2 developers, 1 designer, 1 marketing specialist`

  return (
    <section className="px-8 py-20 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Try It Now</h2>
        <p className="text-white/70">Paste your messy notes below and watch the magic happen</p>
      </div>

      <Card className="bg-white/5 border-white/10 p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-white/60" />
            <span className="text-sm text-white/60">Input your unstructured notes or ideas</span>
          </div>

          <Textarea
            placeholder="Paste your messy notes, ideas, or project thoughts here... 

Example:
- Need to plan marketing campaign
- Budget around $10k
- Target audience: young professionals
- Social media focus
- Launch in Q2
- Need designer and copywriter
- Track metrics: engagement, conversions"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[200px] bg-black/50 border-white/20 text-white placeholder:text-white/40 resize-none"
          />

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleGenerate}
              disabled={!input.trim() || isGenerating}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 flex-1"
            >
              {isGenerating ? (
                <>
                  <Wand2 className="mr-2 w-4 h-4 animate-spin" />
                  Generating Mind Map...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 w-4 h-4" />
                  Generate Mind Map
                </>
              )}
            </Button>

            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
              <Upload className="mr-2 w-4 h-4" />
              Upload File
            </Button>
          </div>

          <Button
            variant="ghost"
            onClick={() => setInput(exampleText)}
            className="text-white/60 hover:text-white hover:bg-white/5 w-full"
          >
            Try Example Text
          </Button>
        </div>
      </Card>
    </section>
  )
}
