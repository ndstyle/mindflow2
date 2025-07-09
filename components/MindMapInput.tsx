'use client'

import { useState } from 'react'
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
  ChevronRight,
  ChevronDown,
  Copy,
  Download
} from 'lucide-react'

interface MindMapNode {
  id: string
  label: string
  children?: MindMapNode[]
  level?: number
}

interface MindMapData {
  nodes: MindMapNode[]
  edges?: Array<{
    source: string
    target: string
  }>
  metadata?: {
    title?: string
    description?: string
    generatedAt?: string
  }
}

interface JsonTreeViewProps {
  data: any
  level?: number
  isExpanded?: boolean
}

// JSON Tree View Component
function JsonTreeView({ data, level = 0, isExpanded = true }: JsonTreeViewProps) {
  const [expanded, setExpanded] = useState(isExpanded)
  
  if (typeof data === 'object' && data !== null) {
    const isArray = Array.isArray(data)
    const keys = Object.keys(data)
    
    return (
      <div className="font-mono text-sm">
        <div className="flex items-center">
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 hover:bg-gray-700 rounded mr-1"
          >
            {expanded ? (
              <ChevronDown className="w-3 h-3" />
            ) : (
              <ChevronRight className="w-3 h-3" />
            )}
          </button>
          <span className="text-blue-400">
            {isArray ? '[' : '{'}
          </span>
          {!expanded && (
            <span className="text-gray-400 ml-1">
              {isArray ? `${keys.length} items` : `${keys.length} properties`}
            </span>
          )}
        </div>
        
        {expanded && (
          <div className="ml-6">
            {keys.map((key, index) => (
              <div key={key} className="my-1">
                <div className="flex items-start">
                  <span className="text-green-400">"{key}"</span>
                  <span className="text-gray-400 mx-2">:</span>
                  <div className="flex-1">
                    <JsonTreeView 
                      data={data[key]} 
                      level={level + 1}
                      isExpanded={level < 2} // Auto-expand first 2 levels
                    />
                  </div>
                </div>
                {index < keys.length - 1 && (
                  <span className="text-gray-400">,</span>
                )}
              </div>
            ))}
          </div>
        )}
        
        <span className="text-blue-400">
          {isArray ? ']' : '}'}
        </span>
      </div>
    )
  }
  
  return (
    <span className={typeof data === 'string' ? 'text-yellow-400' : 'text-purple-400'}>
      {typeof data === 'string' ? `"${data}"` : String(data)}
    </span>
  )
}

export default function MindMapInput() {
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [mindMapData, setMindMapData] = useState<MindMapData | null>(null)
  const [copied, setCopied] = useState(false)

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
    setMindMapData(null)

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
      setMindMapData(data)
      setSuccess(true)
    } catch (err) {
      console.error('Error generating mind map:', err)
      setError(err instanceof Error ? err.message : 'Failed to generate mind map. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async () => {
    if (mindMapData) {
      try {
        await navigator.clipboard.writeText(JSON.stringify(mindMapData, null, 2))
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error('Failed to copy to clipboard:', err)
      }
    }
  }

  const downloadJson = () => {
    if (mindMapData) {
      const blob = new Blob([JSON.stringify(mindMapData, null, 2)], {
        type: 'application/json'
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `mindmap-${Date.now()}.json`
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  const loadExample = () => {
    setInput(exampleInput)
    setError(null)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Input Section */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Input Your Notes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste your messy notes, ideas, or thoughts here... The AI will organize them into a structured mind map."
                className="min-h-[200px] bg-gray-800/50 border-gray-700 text-white placeholder-gray-400"
                disabled={isLoading}
              />
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                type="submit" 
                disabled={isLoading || !input.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating Mind Map...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Generate Mind Map
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
        <Alert variant="destructive" className="bg-red-500/10 border-red-500/20">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Success Alert */}
      {success && (
        <Alert className="bg-green-500/10 border-green-500/20">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Mind map generated successfully! The structured data is displayed below.
          </AlertDescription>
        </Alert>
      )}

      {/* Results Section */}
      {mindMapData && (
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Generated Mind Map Data
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyToClipboard}
                  className="text-xs"
                >
                  <Copy className="w-3 h-3 mr-1" />
                  {copied ? 'Copied!' : 'Copy JSON'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadJson}
                  className="text-xs"
                >
                  <Download className="w-3 h-3 mr-1" />
                  Download
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 overflow-auto max-h-96">
              <JsonTreeView data={mindMapData} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isLoading && (
        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-3">
              <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
              <span className="text-gray-300">
                AI is analyzing your notes and generating a structured mind map...
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
