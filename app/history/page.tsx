'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import ProtectedRoute from '@/components/ProtectedRoute'
import CurrentUserInfo from '@/components/CurrentUserInfo'
import SignOutButton from '@/components/SignOutButton'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Brain, Clock, Eye, Trash2 } from 'lucide-react'
import Link from 'next/link'

interface MindMap {
  id: string
  title: string
  description: string
  created_at: string
  updated_at: string
}

export default function HistoryPage() {
  const [mindMaps, setMindMaps] = useState<MindMap[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMindMaps()
  }, [])

  const fetchMindMaps = async () => {
    try {
      const { data, error } = await supabase
        .from('mind_maps')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching mind maps:', error)
      } else {
        setMindMaps(data || [])
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteMindMap = async (id: string) => {
    try {
      const { error } = await supabase
        .from('mind_maps')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting mind map:', error)
      } else {
        setMindMaps(mindMaps.filter(map => map.id !== id))
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <ProtectedRoute>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <CurrentUserInfo />
        <SignOutButton />
      </div>
      <div className="min-h-screen bg-black text-white">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />

        <div className="relative z-10 container mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-8">
            <Brain className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl font-bold">Mind Map History</h1>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-gray-400">Loading your mind maps...</p>
            </div>
          ) : mindMaps.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">No mind maps yet</h2>
              <p className="text-gray-400 mb-6">Create your first mind map to see it here</p>
              <Link href="/editor">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Brain className="w-4 h-4 mr-2" />
                  Create Mind Map
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mindMaps.map((mindMap) => (
                <Card key={mindMap.id} className="bg-gray-900/50 border-gray-800 hover:bg-gray-900/70 transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-white text-lg">{mindMap.title}</CardTitle>
                        <p className="text-gray-400 text-sm mt-1">{mindMap.description}</p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Link href={`/map/${mindMap.id}`}>
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => deleteMindMap(mindMap.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs text-gray-500">
                      Created: {formatDate(mindMap.created_at)}
                    </div>
                    {mindMap.updated_at !== mindMap.created_at && (
                      <div className="text-xs text-gray-500 mt-1">
                        Updated: {formatDate(mindMap.updated_at)}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
