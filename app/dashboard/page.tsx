'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from "@/components/navbar"
import { DashboardContent } from "@/components/dashboard-content"
import MindMapGenerator from "@/components/MindMapGenerator"
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Plus, 
  FileText, 
  Calendar, 
  Share2, 
  Edit, 
  Eye, 
  Trash2,
  Loader2,
  AlertCircle,
  PlusCircle
} from 'lucide-react'

interface MindMap {
  id: string
  title: string
  description?: string
  nodes: any[]
  edges?: any[]
  created_at: string
  updated_at: string
  user_id: string
}

interface DashboardStats {
  totalMaps: number
  thisWeek: number
  shared: number
  totalNodes: number
}

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [mindMaps, setMindMaps] = useState<MindMap[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalMaps: 0,
    thisWeek: 0,
    shared: 0,
    totalNodes: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch user's mind maps
  const fetchMindMaps = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('mind_maps')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10)

      if (error) {
        throw error
      }

      setMindMaps(data || [])
      
      // Calculate stats
      const totalMaps = data?.length || 0
      const thisWeek = data?.filter(map => {
        const createdAt = new Date(map.created_at)
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        return createdAt >= weekAgo
      }).length || 0
      
      const totalNodes = data?.reduce((sum, map) => {
        return sum + (map.nodes?.length || 0)
      }, 0) || 0

      setStats({
        totalMaps,
        thisWeek,
        shared: 0, // TODO: Implement sharing functionality
        totalNodes
      })

    } catch (err) {
      console.error('Error fetching mind maps:', err)
      setError('Failed to load your mind maps. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Delete mind map
  const deleteMindMap = async (id: string) => {
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

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours} hours ago`
    if (diffInHours < 48) return 'Yesterday'
    return date.toLocaleDateString()
  }

  useEffect(() => {
    if (user) {
      fetchMindMaps()
    }
  }, [user])

  const handleCreateNew = () => {
    router.push('/editor')
  }

  const handleOpenMap = (id: string) => {
    router.push(`/editor?id=${id}`)
  }

  const handleEditMap = (id: string) => {
    router.push(`/editor?id=${id}&mode=edit`)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
      <div className="relative z-10">
        <Navbar />
        
        <div className="px-8 py-12 max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
              <p className="text-white/70">Manage your mind maps and project plans</p>
            </div>
            <Button 
              onClick={handleCreateNew}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              <Plus className="mr-2 w-4 h-4" />
              Create New Map
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <Card className="bg-white/5 border-white/10 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{stats.totalMaps}</p>
                  <p className="text-white/60 text-sm">Total Maps</p>
                </div>
                <FileText className="w-8 h-8 text-blue-400" />
              </div>
            </Card>

            <Card className="bg-white/5 border-white/10 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{stats.thisWeek}</p>
                  <p className="text-white/60 text-sm">This Week</p>
                </div>
                <Calendar className="w-8 h-8 text-green-400" />
              </div>
            </Card>

            <Card className="bg-white/5 border-white/10 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{stats.shared}</p>
                  <p className="text-white/60 text-sm">Shared</p>
                </div>
                <Share2 className="w-8 h-8 text-purple-400" />
              </div>
            </Card>

            <Card className="bg-white/5 border-white/10 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{stats.totalNodes}</p>
                  <p className="text-white/60 text-sm">Total Nodes</p>
                </div>
                <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full" />
              </div>
            </Card>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="bg-red-500/10 border-red-500/20 mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Recent Mind Maps */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Recent Mind Maps</h2>
            
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-400 mr-3" />
                <span className="text-gray-300">Loading your mind maps...</span>
              </div>
            ) : mindMaps.length === 0 ? (
              <Card className="bg-white/5 border-white/10 p-12 text-center">
                <div className="mb-4">
                  <PlusCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No mind maps yet</h3>
                  <p className="text-white/60 mb-6">
                    Create your first mind map to get started
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
              <div className="space-y-4">
                {mindMaps.map((map) => (
                  <Card
                    key={map.id}
                    className="bg-white/5 border-white/10 p-6 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                          <FileText className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{map.title}</h3>
                          <p className="text-white/60 text-sm">
                            {map.nodes?.length || 0} nodes • Created {formatDate(map.created_at)}
                          </p>
                          {map.description && (
                            <p className="text-white/40 text-sm mt-1">{map.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleOpenMap(map.id)}
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
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Mind Map Generator Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Generate from Notes</h2>
            <MindMapGenerator />
          </div>
        </div>
      </div>
    </div>
  )
}
