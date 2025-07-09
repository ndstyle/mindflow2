'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import ProtectedRoute from '@/components/ProtectedRoute'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Loader2, 
  AlertCircle, 
  FileText, 
  Eye, 
  Edit, 
  Trash2,
  Plus,
  Calendar,
  Search,
  Filter
} from 'lucide-react'

interface MindMap {
  id: string
  title: string
  description?: string
  nodes: any[]
  edges: any[]
  created_at: string
  updated_at: string
  user_id: string
}

export default function HistoryPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [mindMaps, setMindMaps] = useState<MindMap[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'recent' | 'oldest'>('all')

  useEffect(() => {
    if (user) {
      fetchMindMaps()
    }
  }, [user])

  const fetchMindMaps = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('mind_maps')
        .select('*')
        .eq('user_id', user?.id)
        .order('updated_at', { ascending: false })

      if (error) {
        throw error
      }

      setMindMaps(data || [])
    } catch (err) {
      console.error('Error fetching mind maps:', err)
      setError('Failed to load your mind maps. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const deleteMindMap = async (id: string) => {
    if (!confirm('Are you sure you want to delete this mind map? This action cannot be undone.')) {
      return
    }

    try {
      const { error } = await supabase
        .from('mind_maps')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id)

      if (error) {
        throw error
      }

      // Refresh the list
      fetchMindMaps()
    } catch (err) {
      console.error('Error deleting mind map:', err)
      setError('Failed to delete mind map. Please try again.')
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours} hours ago`
    if (diffInHours < 48) return 'Yesterday'
    return date.toLocaleDateString()
  }

  const getNodeCount = (nodes: any[]) => {
    return nodes?.length || 0
  }

  const getConnectionCount = (edges: any[]) => {
    return edges?.length || 0
  }

  const filteredMindMaps = mindMaps
    .filter(map => 
      map.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      map.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (filterType) {
        case 'recent':
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        case 'oldest':
          return new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime()
        default:
          return 0
      }
    })

  const handleCreateNew = () => {
    router.push('/input')
  }

  const handleViewMap = (id: string) => {
    router.push(`/map/${id}`)
  }

  const handleEditMap = (id: string) => {
    router.push(`/map/${id}?mode=edit`)
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black text-white">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
        
        <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Your Mind Maps</h1>
              <p className="text-white/70">View and manage all your saved mind maps</p>
            </div>
            <Button 
              onClick={handleCreateNew}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              <Plus className="mr-2 w-4 h-4" />
              Create New Map
            </Button>
          </div>

          {/* Search and Filter */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search mind maps..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="all">All</option>
              <option value="recent">Most Recent</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="bg-red-500/10 border-red-500/20 mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-400 mr-3" />
              <span className="text-gray-300">Loading your mind maps...</span>
            </div>
          ) : filteredMindMaps.length === 0 ? (
            <Card className="bg-gray-900/50 border-gray-800 p-12 text-center">
              <div className="mb-4">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  {searchTerm ? 'No mind maps found' : 'No mind maps yet'}
                </h3>
                <p className="text-white/60 mb-6">
                  {searchTerm 
                    ? 'Try adjusting your search terms'
                    : 'Create your first mind map to get started'
                  }
                </p>
                <Button 
                  onClick={handleCreateNew}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                >
                  <Plus className="mr-2 w-4 h-4" />
                  Create Your First Map
                </Button>
              </div>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredMindMaps.map((map) => (
                <Card
                  key={map.id}
                  className="bg-gray-900/50 border-gray-800 hover:bg-gray-900/70 transition-colors"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                          <FileText className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1">{map.title}</h3>
                          {map.description && (
                            <p className="text-white/60 text-sm mb-2">{map.description}</p>
                          )}
                          <div className="flex items-center gap-4 text-sm text-white/40">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Updated {formatDate(map.updated_at)}
                            </span>
                            <span>{getNodeCount(map.nodes)} nodes</span>
                            <span>{getConnectionCount(map.edges)} connections</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewMap(map.id)}
                          className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditMap(map.id)}
                          className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteMindMap(map.id)}
                          className="border-red-500/20 text-red-400 hover:bg-red-500/10 bg-transparent"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Stats */}
          {mindMaps.length > 0 && (
            <div className="mt-8 text-center">
              <p className="text-white/40 text-sm">
                Showing {filteredMindMaps.length} of {mindMaps.length} mind maps
              </p>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
