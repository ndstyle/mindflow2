'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Upload, 
  Loader2, 
  BarChart3, 
  AlertCircle, 
  CheckCircle,
  ChevronRight,
  ChevronDown,
  Copy,
  Download,
  TrendingUp,
  Network,
  Layers,
  Target
} from 'lucide-react'

interface MindMapNode {
  id: string
  label: string
  children?: MindMapNode[]
  level?: number
  x?: number
  y?: number
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

interface AnalysisResult {
  totalNodes: number
  totalEdges: number
  maxDepth: number
  averageConnections: number
  nodeTypes: Record<string, number>
  complexity: 'low' | 'medium' | 'high'
  suggestions: string[]
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
                      isExpanded={level < 2}
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

// Analyze mind map structure
function analyzeMindMap(data: MindMapData): AnalysisResult {
  const nodes = data.nodes || []
  const edges = data.edges || []
  
  // Calculate metrics
  const totalNodes = nodes.length
  const totalEdges = edges.length
  const maxDepth = calculateMaxDepth(nodes)
  const averageConnections = totalNodes > 0 ? totalEdges / totalNodes : 0
  
  // Analyze node types (by label length, content, etc.)
  const nodeTypes: Record<string, number> = {
    short: nodes.filter(n => n.label.length < 10).length,
    medium: nodes.filter(n => n.label.length >= 10 && n.label.length < 30).length,
    long: nodes.filter(n => n.label.length >= 30).length,
  }
  
  // Determine complexity
  let complexity: 'low' | 'medium' | 'high' = 'low'
  if (totalNodes > 20 || maxDepth > 4) complexity = 'high'
  else if (totalNodes > 10 || maxDepth > 2) complexity = 'medium'
  
  // Generate suggestions
  const suggestions: string[] = []
  if (totalNodes < 5) suggestions.push('Consider adding more nodes for better organization')
  if (averageConnections < 1) suggestions.push('Add more connections between related concepts')
  if (maxDepth > 5) suggestions.push('Consider flattening the structure for better readability')
  if (nodeTypes.long > totalNodes * 0.3) suggestions.push('Some node labels are quite long - consider shorter, more concise labels')
  
  return {
    totalNodes,
    totalEdges,
    maxDepth,
    averageConnections,
    nodeTypes,
    complexity,
    suggestions
  }
}

function calculateMaxDepth(nodes: MindMapNode[], currentDepth = 1): number {
  let maxDepth = currentDepth
  
  for (const node of nodes) {
    if (node.children && node.children.length > 0) {
      const childDepth = calculateMaxDepth(node.children, currentDepth + 1)
      maxDepth = Math.max(maxDepth, childDepth)
    }
  }
  
  return maxDepth
}

export default function MindMapAnalyzer() {
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [mindMapData, setMindMapData] = useState<MindMapData | null>(null)
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [copied, setCopied] = useState(false)

  // Example mind map data for demonstration
  const exampleData = {
    nodes: [
      {
        id: "1",
        label: "Project Management",
        children: [
          {
            id: "2",
            label: "Planning",
            children: [
              { id: "3", label: "Requirements Gathering" },
              { id: "4", label: "Timeline Creation" },
              { id: "5", label: "Resource Allocation" }
            ]
          },
          {
            id: "6",
            label: "Execution",
            children: [
              { id: "7", label: "Development" },
              { id: "8", label: "Testing" },
              { id: "9", label: "Deployment" }
            ]
          },
          {
            id: "10",
            label: "Monitoring",
            children: [
              { id: "11", label: "Progress Tracking" },
              { id: "12", label: "Performance Metrics" }
            ]
          }
        ]
      }
    ],
    edges: [
      { source: "1", target: "2" },
      { source: "1", target: "6" },
      { source: "1", target: "10" },
      { source: "2", target: "3" },
      { source: "2", target: "4" },
      { source: "2", target: "5" },
      { source: "6", target: "7" },
      { source: "6", target: "8" },
      { source: "6", target: "9" },
      { source: "10", target: "11" },
      { source: "10", target: "12" }
    ],
    metadata: {
      title: "Project Management Mind Map",
      description: "A comprehensive project management structure",
      generatedAt: new Date().toISOString()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!input.trim()) {
      setError('Please paste mind map JSON data to analyze.')
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccess(false)
    setMindMapData(null)
    setAnalysis(null)

    try {
      // Parse the JSON input
      const parsedData = JSON.parse(input.trim())
      setMindMapData(parsedData)
      
      // Analyze the mind map
      const analysisResult = analyzeMindMap(parsedData)
      setAnalysis(analysisResult)
      setSuccess(true)
    } catch (err) {
      console.error('Error parsing mind map data:', err)
      setError('Invalid JSON format. Please check your mind map data.')
    } finally {
      setIsLoading(false)
    }
  }

  const loadExample = () => {
    setInput(JSON.stringify(exampleData, null, 2))
    setError(null)
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

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'low': return 'text-green-400'
      case 'medium': return 'text-yellow-400'
      case 'high': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Input Section */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Mind Map Analyzer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste your mind map JSON data here to analyze its structure, complexity, and get optimization suggestions..."
                className="min-h-[200px] bg-gray-800/50 border-gray-700 text-white placeholder-gray-400"
                disabled={isLoading}
              />
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                type="submit" 
                disabled={isLoading || !input.trim()}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Analyze Mind Map
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
            Mind map analyzed successfully! View the insights and structure below.
          </AlertDescription>
        </Alert>
      )}

      {/* Analysis Results */}
      {analysis && mindMapData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Analysis Metrics */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Analysis Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Network className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-gray-400">Total Nodes</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{analysis.totalNodes}</div>
                </div>
                
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-gray-400">Total Edges</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{analysis.totalEdges}</div>
                </div>
                
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Layers className="w-4 h-4 text-purple-400" />
                    <span className="text-sm text-gray-400">Max Depth</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{analysis.maxDepth}</div>
                </div>
                
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm text-gray-400">Avg Connections</span>
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {analysis.averageConnections.toFixed(1)}
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-gray-400">Complexity Level</span>
                </div>
                <div className={`text-lg font-semibold ${getComplexityColor(analysis.complexity)}`}>
                  {analysis.complexity.charAt(0).toUpperCase() + analysis.complexity.slice(1)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Suggestions */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Optimization Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analysis.suggestions.length > 0 ? (
                <ul className="space-y-2">
                  {analysis.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-blue-400 mt-1">•</span>
                      <span className="text-gray-300">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400 text-sm">
                  Your mind map structure looks well-balanced! No specific suggestions at this time.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* JSON Tree View */}
      {mindMapData && (
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Mind Map Structure
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                className="text-xs"
              >
                <Copy className="w-3 h-3 mr-1" />
                {copied ? 'Copied!' : 'Copy JSON'}
              </Button>
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
              <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
              <span className="text-gray-300">
                Analyzing mind map structure and generating insights...
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
