'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import ProtectedRoute from '@/components/ProtectedRoute'
import MindMapVisualizer from '@/components/MindMapVisualizer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Loader2, 
  AlertCircle, 
  ArrowLeft,
  Save,
  Share2
} from 'lucide-react'

interface MindMapData {
  nodes: any[]
  edges: any[]
  metadata?: {
    title?: string
    description?: string
  }
}

export default function MindMapPage() {
  const { id } = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user } = useAuth()
  const [mindMapData, setMindMapData] = useState<MindMapData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    const loadMindMap = async () => {
      try {
        setLoading(true)
        setError(null)

        if (id === 'temp') {
          // Load from URL parameters (for temporary data)
          const dataParam = searchParams.get('data')
          if (dataParam) {
            const data = JSON.parse(decodeURIComponent(dataParam))
            setMindMapData(data)
          } else {
            setError('No mind map data found')
          }
        } else {
          // Load from database
          const { data, error } = await supabase
            .from('mind_maps')
            .select('*')
            .eq('id', id)
            .eq('user_id', user?.id)
            .single()

          if (error) {
            throw error
          }

          if (data) {
            setMindMapData({
              nodes: data.nodes || [],
              edges: data.edges || [],
              metadata: {
                title: data.title,
                description: data.description
              }
            })
          } else {
            setError('Mind map not found')
          }
        }
      } catch (err) {
        console.error('Error loading mind map:', err)
        setError(err instanceof Error ? err.message : 'Failed to load mind map')
      } finally {
        setLoading(false)
      }
    }

    if (user || id === 'temp') {
      loadMindMap()
    }
  }, [id, user, searchParams])

  const handleSave = async (data: MindMapData) => {
    if (!user || id === 'temp') return

    try {
      setSaving(true)
      setSaveSuccess(false)

      const { error } = await supabase
        .from('mind_maps')
        .update({
          nodes: data.nodes,
          edges: data.edges,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) {
        throw error
      }

      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err) {
      console.error('Error saving mind map:', err)
      setError('Failed to save mind map')
    } finally {
      setSaving(false)
    }
  }

  const handleExport = (data: MindMapData) => {
    // Export functionality is handled in the MindMapVisualizer component
    console.log('Exporting mind map:', data)
  }

  const handleBack = () => {
    router.push('/dashboard')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
          <span className="text-lg">Loading mind map...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 py-12">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4">Error Loading Mind Map</h1>
            <Alert variant="destructive" className="bg-red-500/10 border-red-500/20 mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button onClick={handleBack} className="bg-blue-600 hover:bg-blue-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!mindMapData) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Mind Map Not Found</h1>
            <p className="text-gray-400 mb-6">The mind map you're looking for doesn't exist or you don't have permission to view it.</p>
            <Button onClick={handleBack} className="bg-blue-600 hover:bg-blue-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="h-screen w-full bg-black">
        {/* Header */}
        <div className="absolute top-4 left-4 z-20">
          <Card className="bg-gray-900/80 border-gray-700">
            <CardContent className="p-3">
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleBack}
                  variant="outline"
                  size="sm"
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                
                {mindMapData.metadata?.title && (
                  <div className="text-white font-medium">
                    {mindMapData.metadata.title}
                  </div>
                )}
                
                {user && id !== 'temp' && (
                  <Button
                    onClick={() => handleSave(mindMapData)}
                    disabled={saving}
                    size="sm"
                    variant="outline"
                    className="border-green-500/20 text-green-400 hover:bg-green-500/10"
                  >
                    {saving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Save Success Message */}
        {saveSuccess && (
          <div className="absolute top-4 right-4 z-20">
            <Alert className="bg-green-500/10 border-green-500/20">
              <AlertDescription className="text-green-400">
                Mind map saved successfully!
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Mind Map Visualizer */}
        <MindMapVisualizer
          initialData={mindMapData}
          onSave={handleSave}
          onExport={handleExport}
          readOnly={false}
        />
      </div>
    </ProtectedRoute>
  )
} 