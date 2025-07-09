'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Send, 
  Loader2, 
  FileText, 
  AlertCircle, 
  CheckCircle,
  ArrowRight
} from 'lucide-react'

export default function InputPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Example input for demonstration
  const exampleInput = `Project Planning Notes:

- Need to build a new website
  - Frontend: React, TypeScript, Tailwind CSS
  - Backend: Node.js, Express, MongoDB
  - Features: user authentication, dashboard, API integration
  - Timeline: 3 months
  - Budget: $15,000

Marketing Strategy:
- Social media campaigns
- SEO optimization
- Content marketing
- Email newsletters

Team Structure:
- Project Manager
- Frontend Developer
- Backend Developer
- UI/UX Designer
- QA Tester`

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!input.trim()) {
      setError('Please enter some notes to generate a mind map.')
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch('/api/generate-mindmap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notes: input.trim(),
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      // Save to database if user is logged in
      if (user) {
        const saveResponse = await fetch('/api/mindmaps', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: `Mind Map - ${new Date().toLocaleDateString()}`,
            description: input.trim().substring(0, 100) + '...',
            nodes: data.nodes || [],
            edges: data.edges || [],
            metadata: data.metadata || {}
          }),
        })

        if (saveResponse.ok) {
          const savedData = await saveResponse.json()
          router.push(`/map/${savedData.id}`)
        } else {
          // Still show the mind map even if save fails
          router.push(`/map/temp?data=${encodeURIComponent(JSON.stringify(data))}`)
        }
      } else {
        // For non-logged in users, pass data via URL
        router.push(`/map/temp?data=${encodeURIComponent(JSON.stringify(data))}`)
      }
      
      setSuccess(true)
    } catch (err) {
      console.error('Error generating mind map:', err)
      setError(err instanceof Error ? err.message : 'Failed to generate mind map. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const loadExample = () => {
    setInput(exampleInput)
    setError(null)
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black text-white">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Transform Your Notes</h1>
            <p className="text-xl text-gray-300">
              Paste your messy notes and let AI organize them into a structured mind map
            </p>
          </div>

          {/* Input Form */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Your Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Paste your notes, ideas, or thoughts here... The AI will organize them into a structured mind map."
                    className="min-h-[300px] bg-gray-800/50 border-gray-700 text-white placeholder-gray-400"
                    disabled={isLoading}
                  />
                </div>
                
                <div className="flex items-center gap-3">
                  <Button 
                    type="submit" 
                    disabled={isLoading || !input.trim()}
                    className="bg-blue-600 hover:bg-blue-700 px-8"
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Generating Mind Map...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Generate Mind Map
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={loadExample}
                    disabled={isLoading}
                  >
                    Load Example
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="bg-red-500/10 border-red-500/20 mt-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Success Alert */}
          {success && (
            <Alert className="bg-green-500/10 border-green-500/20 mt-6">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Mind map generated successfully! Redirecting to visualization...
              </AlertDescription>
            </Alert>
          )}

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <Card className="bg-gray-900/50 border-gray-800 text-center p-6">
              <FileText className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Paste Any Notes</h3>
              <p className="text-gray-400 text-sm">
                Bullet points, paragraphs, or messy thoughts - we'll organize them all
              </p>
            </Card>
            
            <Card className="bg-gray-900/50 border-gray-800 text-center p-6">
              <Send className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">AI Processing</h3>
              <p className="text-gray-400 text-sm">
                Our AI analyzes your content and creates structured relationships
              </p>
            </Card>
            
            <Card className="bg-gray-900/50 border-gray-800 text-center p-6">
              <ArrowRight className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Visual Mind Map</h3>
              <p className="text-gray-400 text-sm">
                View and edit your organized thoughts in an interactive mind map
              </p>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
} 