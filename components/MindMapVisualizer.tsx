'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
  NodeTypes,
  Connection,
  NodeChange,
  EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Download, 
  Copy, 
  Save, 
  Edit, 
  Eye,
  Trash2,
  Plus,
  Settings
} from 'lucide-react'

interface MindMapNode extends Node {
  data: {
    label: string
    color?: string
    priority?: number
  }
}

interface MindMapData {
  nodes: MindMapNode[]
  edges: Edge[]
  metadata?: {
    title?: string
    description?: string
  }
}

interface MindMapVisualizerProps {
  initialData?: MindMapData
  onSave?: (data: MindMapData) => void
  onExport?: (data: MindMapData) => void
  readOnly?: boolean
}

// Custom node component for inline editing
const CustomNode = ({ data, selected }: { data: any; selected: boolean }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [label, setLabel] = useState(data.label)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleDoubleClick = () => {
    setIsEditing(true)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setIsEditing(false)
      data.label = label
    } else if (e.key === 'Escape') {
      setIsEditing(false)
      setLabel(data.label)
    }
  }

  const handleBlur = () => {
    setIsEditing(false)
    data.label = label
  }

  return (
    <div
      className={`px-4 py-2 rounded-lg border-2 min-w-[120px] text-center ${
        selected ? 'border-blue-400 shadow-lg' : 'border-gray-600'
      } ${data.color ? `bg-${data.color}-500/20` : 'bg-gray-800/50'}`}
      onDoubleClick={handleDoubleClick}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className="bg-transparent border-none outline-none text-center w-full text-white"
        />
      ) : (
        <div className="text-white font-medium">{label}</div>
      )}
    </div>
  )
}

const nodeTypes: NodeTypes = {
  custom: CustomNode,
}

export default function MindMapVisualizer({
  initialData,
  onSave,
  onExport,
  readOnly = false
}: MindMapVisualizerProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(
    initialData?.nodes || []
  )
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    initialData?.edges || []
  )
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [showControls, setShowControls] = useState(true)

  // Convert nodes to custom type
  useEffect(() => {
    if (initialData?.nodes) {
      const customNodes = initialData.nodes.map(node => ({
        ...node,
        type: 'custom',
        data: {
          ...node.data,
          label: node.data.label || 'Untitled'
        }
      }))
      setNodes(customNodes)
    }
  }, [initialData])

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds: Edge[]) => addEdge(params, eds)),
    [setEdges]
  )

  const handleNodeChanges = useCallback(
    (changes: NodeChange[]) => {
      onNodesChange(changes)
      // Track selected node
      changes.forEach(change => {
        if (change.type === 'select' && change.selected) {
          setSelectedNode(change.id)
        } else if (change.type === 'select' && !change.selected) {
          setSelectedNode(null)
        }
      })
    },
    [onNodesChange]
  )

  const addNode = () => {
    const newNode: MindMapNode = {
      id: `node-${Date.now()}`,
      type: 'custom',
      position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
      data: { label: 'New Node' }
    } as MindMapNode
    setNodes((prev: Node[]) => [...prev, newNode])
  }

  const deleteNode = () => {
    if (selectedNode) {
      setNodes((prev: Node[]) => prev.filter(node => node.id !== selectedNode))
      setEdges((prev: Edge[]) => prev.filter(edge => 
        edge.source !== selectedNode && edge.target !== selectedNode
      ))
      setSelectedNode(null)
    }
  }

  const saveMindMap = () => {
    if (onSave) {
      const data: MindMapData = {
        nodes: nodes as MindMapNode[],
        edges,
        metadata: initialData?.metadata
      }
      onSave(data)
    }
  }

  const exportJSON = () => {
    const data: MindMapData = {
      nodes: nodes as MindMapNode[],
      edges,
      metadata: initialData?.metadata
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

  const exportPNG = () => {
    // Simple PNG export using html2canvas
    import('html2canvas').then(({ default: html2canvas }) => {
      const flowElement = document.querySelector('.react-flow__viewport')
      if (flowElement) {
        html2canvas(flowElement as HTMLElement, {
          backgroundColor: '#000000',
          scale: 2
        }).then((canvas: HTMLCanvasElement) => {
          const link = document.createElement('a')
          link.download = `mindmap-${Date.now()}.png`
          link.href = canvas.toDataURL()
          link.click()
        })
      }
    })
  }

  return (
    <div className="h-screen w-full bg-black">
      {/* Toolbar */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <Card className="bg-gray-900/80 border-gray-700">
          <CardContent className="p-2">
            <div className="flex gap-2">
              {!readOnly && (
                <>
                  <Button
                    onClick={addNode}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={deleteNode}
                    disabled={!selectedNode}
                    size="sm"
                    variant="destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </>
              )}
              <Button
                onClick={saveMindMap}
                size="sm"
                variant="outline"
                className="border-green-500/20 text-green-400 hover:bg-green-500/10"
              >
                <Save className="w-4 h-4" />
              </Button>
              <Button
                onClick={exportJSON}
                size="sm"
                variant="outline"
                className="border-blue-500/20 text-blue-400 hover:bg-blue-500/10"
              >
                <Copy className="w-4 h-4" />
              </Button>
              <Button
                onClick={exportPNG}
                size="sm"
                variant="outline"
                className="border-purple-500/20 text-purple-400 hover:bg-purple-500/10"
              >
                <Download className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => setShowControls(!showControls)}
                size="sm"
                variant="outline"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* React Flow */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodeChanges}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        className="bg-black"
        nodesDraggable={!readOnly}
        nodesConnectable={!readOnly}
        elementsSelectable={!readOnly}
      >
        {showControls && (
          <>
            <Controls className="bg-gray-900/80 border-gray-700" />
            <MiniMap 
              className="bg-gray-900/80 border-gray-700"
              nodeColor="#3b82f6"
              maskColor="rgba(0, 0, 0, 0.5)"
            />
          </>
        )}
        <Background 
          color="#374151" 
          gap={20}
          size={1}
        />
      </ReactFlow>

      {/* Info Panel */}
      <div className="absolute bottom-4 right-4 z-10">
        <Card className="bg-gray-900/80 border-gray-700">
          <CardContent className="p-3">
            <div className="text-sm text-gray-300">
              <div>Nodes: {nodes.length}</div>
              <div>Connections: {edges.length}</div>
              {selectedNode && <div>Selected: {selectedNode}</div>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 