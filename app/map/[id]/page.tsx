"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import ProtectedRoute from '@/components/ProtectedRoute'
import CurrentUserInfo from "@/components/CurrentUserInfo";
import SignOutButton from "@/components/SignOutButton";
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  ArrowLeft, 
  Share2, 
  Download, 
  Edit, 
  Eye,
  Brain
} from 'lucide-react'
import Link from 'next/link'

interface MindMapData {
  id: string
  title: string
  description: string
  original_text: string
  mind_map_data: any
  is_public: boolean
  share_token?: string
  created_at: string
  updated_at: string
}

export default function MindMapPage() {
  const params = useParams()
  const mindMapId = params.id as string
  const [mindMap, setMindMap] = useState<MindMapData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchMindMap()
  }, [mindMapId])

  const fetchMindMap = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('mind_maps')
        .select('*')
        .eq('id', mindMapId)
        .single()

      if (error) {
        console.error('Error fetching mind map:', error)
        setError('Failed to load mind map. It may not exist or you may not have permission to view it.')
      } else {
        setMindMap(data)
      }
    } catch (err) {
      console.error('Error:', err)
      setError('An unexpected error occurred while loading the mind map.')
    } finally {
      setLoading(false)
    }
  }

  const makePublic = async () => {
    if (!mindMap) return

    try {
      const { data, error } = await supabase
        .from('mind_maps')
        .update({ is_public: true })
        .eq('id', mindMapId)
        .select()
        .single()

      if (error) {
        console.error('Error making mind map public:', error)
      } else {
        setMindMap(data)
      }
    } catch (err) {
      console.error('Error:', err)
    }
  }

  const exportData = () => {
    if (!mindMap) return

    const data = {
      title: mindMap.title,
      description: mindMap.description,
      mindMapData: mindMap.mind_map_data,
      exportedAt: new Date().toISOString()
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json'
    })

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${mindMap.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <CurrentUserInfo />
          <SignOutButton />
        </div>
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
            <p>Loading mind map...</p>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (error || !mindMap) {
    return (
      <ProtectedRoute>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <CurrentUserInfo />
          <SignOutButton />
        </div>
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-center max-w-md">
            <Brain className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Mind Map Not Found</h2>
            <p className="text-gray-400 mb-6">{error || 'The mind map you are looking for does not exist.'}</p>
            <Link href="/history">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to History
              </Button>
            </Link>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <CurrentUserInfo />
        <SignOutButton />
      </div>
      <div className="h-screen w-full bg-black">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-black/80 backdrop-blur-sm border-b border-gray-800">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <Link href="/history">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-semibold">{mindMap.title}</h1>
                {mindMap.description && (
                  <p className="text-gray-400 text-sm">{mindMap.description}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button onClick={makePublic} variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Make Public
              </Button>
              <Button onClick={exportData} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Link href={`/editor`}>
                <Button size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="pt-20 h-full">
          <div className="h-full flex items-center justify-center">
            <Card className="bg-gray-900/50 border-gray-800 max-w-2xl mx-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-blue-400" />
                  Mind Map Visualization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <div className="w-32 h-32 bg-gray-800/50 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Brain className="w-12 h-12 text-gray-400" />
                  </div>
                  <p className="text-gray-400 mb-4">
                    Interactive mind map visualization will be rendered here
                  </p>
                  <div className="text-sm text-gray-500">
                    <p>Created: {formatDate(mindMap.created_at)}</p>
                    {mindMap.updated_at !== mindMap.created_at && (
                      <p>Updated: {formatDate(mindMap.updated_at)}</p>
                    )}
                    <p>Status: {mindMap.is_public ? 'Public' : 'Private'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
