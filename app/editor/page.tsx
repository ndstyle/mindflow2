'use client'

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
    try {
      // TODO: Implement save to database
      console.log('Saving mind map:', { nodes, edges })
      // Show success message
    } catch (error) {
      console.error('Error saving mind map:', error)
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
      <div className="min-h-screen bg-black text-white flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-900/50 border-r border-gray-800 p-4 flex flex-col">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-xl font-bold mb-2">Mind Map Editor</h1>
            <p className="text-gray-400 text-sm">Create and organize your ideas</p>
          </div>

          {/* Node Management */}
          <div className="space-y-4 mb-6">
            <h3 className="text-sm font-medium text-gray-300">Node Management</h3>
            
            <Button 
              onClick={addNode}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Node
            </Button>
            
            <Button 
              onClick={removeNode}
              disabled={!selectedNode}
              variant="destructive"
              className="w-full"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Remove Node
            </Button>
          </div>

          {/* View Controls */}
          <div className="space-y-4 mb-6">
            <h3 className="text-sm font-medium text-gray-300">View</h3>
            
            <Button 
              onClick={() => setShowGrid(!showGrid)}
              variant="outline"
              className="w-full"
            >
              {showGrid ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              {showGrid ? 'Hide Grid' : 'Show Grid'}
            </Button>
            
            <div className="space-y-2">
              <label className="text-sm text-gray-300">Zoom</label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full"
              />
              <span className="text-xs text-gray-400">{Math.round(zoom * 100)}%</span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-4 mb-6">
            <h3 className="text-sm font-medium text-gray-300">Actions</h3>
            
            <Button 
              onClick={undo}
              variant="outline"
              className="w-full"
            >
              <Undo className="w-4 h-4 mr-2" />
              Undo
            </Button>
            
            <Button 
              onClick={redo}
              variant="outline"
              className="w-full"
            >
              <Redo className="w-4 h-4 mr-2" />
              Redo
            </Button>
          </div>

          {/* Export & Save */}
          <div className="space-y-4 mb-6">
            <h3 className="text-sm font-medium text-gray-300">Export & Save</h3>
            
            <Button 
              onClick={saveMindMap}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            
            <Button 
              onClick={exportData}
              variant="outline"
              className="w-full"
            >
              <Download className="w-4 h-4 mr-2" />
              Export JSON
            </Button>
            
            <Button 
              variant="outline"
              className="w-full"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-auto space-y-2">
            <div className="text-sm text-gray-400">
              Nodes: {nodes.length}
            </div>
            <div className="text-sm text-gray-400">
              Connections: {edges.length}
            </div>
          </div>
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 relative overflow-hidden">
          {/* Background Grid */}
          {showGrid && (
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `
                  linear-gradient(to right, #1a1a1a 1px, transparent 1px),
                  linear-gradient(to bottom, #1a1a1a 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px'
              }}
            />
          )}

          {/* Canvas Container */}
          <div 
            className="absolute inset-0"
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: 'center'
            }}
          >
            {/* Placeholder for Graph Visualization */}
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-32 bg-gray-800/50 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-gray-400 text-sm text-center">
                    Graph<br />Canvas
                  </div>
                </div>
                <p className="text-gray-400 text-sm">
                  Interactive mind map visualization will be rendered here
                </p>
                <p className="text-gray-500 text-xs mt-2">
                  {nodes.length} nodes, {edges.length} connections
                </p>
              </div>
            </div>

            {/* Simple Node Display (for demo) */}
            {nodes.map((node) => (
              <div
                key={node.id}
                className={`absolute w-24 h-24 bg-blue-600/20 border border-blue-500/30 rounded-lg flex items-center justify-center cursor-pointer transition-all ${
                  selectedNode === node.id ? 'ring-2 ring-blue-400' : ''
                }`}
                style={{
                  left: node.x,
                  top: node.y,
                  transform: 'translate(-50%, -50%)'
                }}
                onClick={() => setSelectedNode(node.id)}
              >
                <span className="text-xs text-center px-2">{node.label}</span>
              </div>
            ))}
          </div>

          {/* Zoom Controls */}
          <div className="absolute bottom-4 right-4 flex space-x-2">
            <Button
              onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
              size="sm"
              variant="outline"
            >
              -
            </Button>
            <Button
              onClick={() => setZoom(Math.min(2, zoom + 0.1))}
              size="sm"
              variant="outline"
            >
              +
            </Button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
