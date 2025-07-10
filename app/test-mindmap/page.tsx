"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Sparkles } from "lucide-react"
import MindMapVisualizer from "@/components/MindMapVisualizer"

export default function TestMindMapPage() {
  const [input, setInput] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [mindMapData, setMindMapData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!input.trim()) return

    setIsGenerating(true)
    setError(null)

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
        setError(errData.error || "Failed to generate mind map")
        return
      }

      const data = await response.json()
      setMindMapData(data)
    } catch (error: any) {
      setError(error.message || "Error generating mind map")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Mind Map Test
          </h1>
          <p className="text-gray-400">Test the mind map generation and visualization</p>
        </div>

        {!mindMapData ? (
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-blue-400" />
                Generate Test Mind Map
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Enter some text to generate a mind map from..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-[120px] bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              />
              
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded p-3">
                  <p className="text-red-400">{error}</p>
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
                      Generate Test Mind Map
                      <Brain className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Generated Mind Map</h2>
              <Button
                onClick={() => setMindMapData(null)}
                variant="outline"
                size="sm"
              >
                Generate New
              </Button>
            </div>
            
            <div className="h-[600px] border border-gray-800 rounded-lg overflow-hidden">
              <MindMapVisualizer 
                initialData={mindMapData}
                readOnly={false}
              />
            </div>

            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle>Generated Data</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-xs text-gray-300 overflow-auto max-h-40">
                  {JSON.stringify(mindMapData, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
} 