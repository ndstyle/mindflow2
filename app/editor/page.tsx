"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '@/components/ProtectedRoute'
import { Button } from '@/components/ui/button'
import { 
  Plus, 
  Trash2, 
  Download, 
  Save, 
  Undo, 
  Redo, 
  Settings,
  Share2,
  Eye,
  EyeOff
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import CurrentUserInfo from "@/components/CurrentUserInfo";
import SignOutButton from "@/components/SignOutButton";

interface Node {
  id: string
  label: string
  x: number
  y: number
  parentId?: string
}

interface Edge {
  id: string
  sourceId: string
  targetId: string
}

export default function EditorPage() {
  const [nodes, setNodes] = useState<Node[]>([
    { id: '1', label: 'Main Topic', x: 400, y: 300 }
  ])
  const [edges, setEdges] = useState<Edge[]>([])
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [showGrid, setShowGrid] = useState(true)
  const [zoom, setZoom] = useState(1)
  const router = useRouter()
  const [title, setTitle] = useState('Untitled Mind Map')
  const [description, setDescription] = useState('')
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>("idle")
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Add new node
  const addNode = () => {
    const newNodeId = (nodes.length + 1).toString()
    const newNode: Node = {
      id: newNodeId,
      label: `Node ${newNodeId}`,
      x: Math.random() * 600 + 100,
      y: Math.random() * 400 + 100
    }
    setNodes([...nodes, newNode])
  }

  // Remove selected node
  const removeNode = () => {
    if (selectedNode) {
      setNodes(nodes.filter(node => node.id !== selectedNode))
      setEdges(edges.filter(edge => 
        edge.sourceId !== selectedNode && edge.targetId !== selectedNode
      ))
      setSelectedNode(null)
    }
  }

  // Connect nodes
  const connectNodes = (sourceId: string, targetId: string) => {
    const newEdge: Edge = {
      id: `${sourceId}-${targetId}`,
      sourceId,
      targetId
    }
    setEdges([...edges, newEdge])
  }

  // Export mind map data
  const exportData = () => {
    const data = {
      nodes,
      edges,
      timestamp: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json'
    })
    
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `mindmap-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Save mind map
  const saveMindMap = async () => {
    setSaveStatus('saving')
    setErrorMsg(null)
    try {
      const { data, error } = await supabase
        .from('mind_maps')
        .insert({
          title: title || 'Untitled Mind Map',
          description,
          original_text: '',
          mind_map_data: { nodes, edges },
          is_public: false,
        })
        .select()
        .single()
      if (error) {
        setErrorMsg(error.message)
        setSaveStatus('error')
      } else {
        setSaveStatus('success')
        setTimeout(() => setSaveStatus('idle'), 2000)
      }
    } catch (error: any) {
      setErrorMsg(error.message || 'Failed to save mind map.')
      setSaveStatus('error')
    }
  }

  // Undo/Redo functionality (placeholder)
  const undo = () => {
    // TODO: Implement undo functionality
    console.log('Undo')
  }

  const redo = () => {
    // TODO: Implement redo functionality
    console.log('Redo')
  }

  return (
    <ProtectedRoute>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <CurrentUserInfo />
        <SignOutButton />
      </div>
      <div className="min-h-screen bg-black text-white flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-900/50 border-r border-gray-800 p-4 flex flex-col">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-xl font-bold mb-2">Mind Map Editor</h1>
            <p className="text-gray-400 text-sm">Create and organize your ideas</p>
            <div className="mt-4 space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={title} onChange={e => setTitle(e.target.value)} className="bg-gray-800 border-gray-700 text-white" />
              <Label htmlFor="desc">Description</Label>
              <Input id="desc" value={description} onChange={e => setDescription(e.target.value)} className="bg-gray-800 border-gray-700 text-white" />
            </div>
          </div>

          {/* Node Management */}
          <div className="space-y-4 mb-6">
            <h3 className="text-sm font-medium text-gray-300">Node Management</h3>
            <div className="flex gap-2">
              <Button onClick={addNode} size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-1" />
                Add Node
              </Button>
              <Button onClick={removeNode} size="sm" variant="destructive" disabled={!selectedNode}>
                <Trash2 className="w-4 h-4 mr-1" />
                Remove
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-4 mb-6">
            <h3 className="text-sm font-medium text-gray-300">Actions</h3>
            <div className="flex gap-2">
              <Button onClick={saveMindMap} size="sm" className="bg-green-600 hover:bg-green-700" disabled={saveStatus === 'saving'}>
                <Save className="w-4 h-4 mr-1" />
                {saveStatus === 'saving' ? 'Saving...' : 'Save'}
              </Button>
              <Button onClick={exportData} size="sm" className="bg-purple-600 hover:bg-purple-700">
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>
            </div>
          </div>

          {/* View Controls */}
          <div className="space-y-4 mb-6">
            <h3 className="text-sm font-medium text-gray-300">View</h3>
            <div className="flex gap-2">
              <Button 
                onClick={() => setShowGrid(!showGrid)} 
                size="sm" 
                variant={showGrid ? "default" : "outline"}
              >
                {showGrid ? <Eye className="w-4 h-4 mr-1" /> : <EyeOff className="w-4 h-4 mr-1" />}
                Grid
              </Button>
            </div>
          </div>

          {/* Status */}
          {errorMsg && (
            <div className="mt-4 p-3 bg-red-900/50 border border-red-700 rounded text-red-300 text-sm">
              {errorMsg}
            </div>
          )}
          
          {saveStatus === 'success' && (
            <div className="mt-4 p-3 bg-green-900/50 border border-green-700 rounded text-green-300 text-sm">
              Mind map saved successfully!
            </div>
          )}
        </div>

        {/* Canvas */}
        <div className="flex-1 relative overflow-hidden">
          <div className="absolute inset-0 bg-gray-900">
            {/* Grid */}
            {showGrid && (
              <div className="absolute inset-0 opacity-20">
                <svg className="w-full h-full">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>
            )}
            
            {/* Nodes */}
            {nodes.map(node => (
              <div
                key={node.id}
                className={`absolute cursor-pointer p-2 bg-blue-600 rounded border-2 ${
                  selectedNode === node.id ? 'border-yellow-400' : 'border-transparent'
                }`}
                style={{
                  left: node.x,
                  top: node.y,
                  transform: 'translate(-50%, -50%)'
                }}
                onClick={() => setSelectedNode(node.id)}
              >
                {node.label}
              </div>
            ))}
            
            {/* Edges */}
            <svg className="absolute inset-0 pointer-events-none">
              {edges.map(edge => {
                const source = nodes.find(n => n.id === edge.sourceId)
                const target = nodes.find(n => n.id === edge.targetId)
                if (!source || !target) return null
                
                return (
                  <line
                    key={edge.id}
                    x1={source.x}
                    y1={source.y}
                    x2={target.x}
                    y2={target.y}
                    stroke="white"
                    strokeWidth="2"
                  />
                )
              })}
            </svg>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
