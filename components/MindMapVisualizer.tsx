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
  Settings,
  Share2,
  Check
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { XP_REWARDS, makeMindMapPublic } from '@/lib/supabase'
import { exportToPDF } from '@/lib/export-utils'

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
    id?: string // Added for public sharing
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
  const { addXP, user } = useAuth()
  const [exportingPDF, setExportingPDF] = useState(false)
  const mapRef = useRef<HTMLDivElement>(null)
  const [shareStatus, setShareStatus] = useState<'idle' | 'sharing' | 'success' | 'error'>("idle")
  const [shareError, setShareError] = useState<string | null>(null)
  const [publicLink, setPublicLink] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [showShare, setShowShare] = useState(false)

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
      // Award XP for edit
      addXP(XP_REWARDS.EDIT_NODE, "Node edited")
      // Track selected node
      changes.forEach(change => {
        if (change.type === 'select' && change.selected) {
          setSelectedNode(change.id)
        } else if (change.type === 'select' && !change.selected) {
          setSelectedNode(null)
        }
      })
    },
    [onNodesChange, addXP]
  )

  const addNode = () => {
    const newNode: MindMapNode = {
      id: `node-${Date.now()}`,
      type: 'custom',
      position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
      data: { label: 'New Node' }
    } as MindMapNode
    setNodes((prev: Node[]) => [...prev, newNode])
    addXP(XP_REWARDS.EDIT_NODE, "Node added")
  }

  const deleteNode = () => {
    if (selectedNode) {
      setNodes((prev: Node[]) => prev.filter(node => node.id !== selectedNode))
      setEdges((prev: Edge[]) => prev.filter(edge => 
        edge.source !== selectedNode && edge.target !== selectedNode
      ))
      setSelectedNode(null)
      addXP(XP_REWARDS.EDIT_NODE, "Node deleted")
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

  const exportPDF = async () => {
    if (!mapRef.current) return
    setExportingPDF(true)
    try {
      await exportToPDF(mapRef.current, initialData?.metadata?.title ? `${initialData.metadata.title}.pdf` : undefined)
    } catch (e) {
      // Optionally show error
    } finally {
      setExportingPDF(false)
    }
  }

  const handleShare = async () => {
    if (!user || !initialData?.metadata?.id) return
    setShareStatus('sharing')
    setShareError(null)
    try {
      const data = await makeMindMapPublic(initialData.metadata.id, user.id)
      if (data && data.share_token) {
        const link = `${window.location.origin}/map/public/${data.share_token}`
        setPublicLink(link)
        setShareStatus('success')
        setShowShare(true)
      } else {
        setShareError('Failed to generate public link.')
        setShareStatus('error')
      }
    } catch (e: any) {
      setShareError(e.message || 'Failed to share mind map.')
      setShareStatus('error')
    }
  }
  const handleCopy = async () => {
    if (publicLink) {
      await navigator.clipboard.writeText(publicLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }
  }

  return (
    <div ref={mapRef} className="h-screen w-full bg-black">
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
                onClick={exportPDF}
                size="sm"
                variant="outline"
                className="border-pink-500/20 text-pink-400 hover:bg-pink-500/10"
                disabled={exportingPDF}
              >
                <Download className="w-4 h-4" />
                {exportingPDF ? 'Exporting PDF...' : 'PDF'}
              </Button>
              <Button
                onClick={() => setShowControls(!showControls)}
                size="sm"
                variant="outline"
              >
                <Settings className="w-4 h-4" />
              </Button>
              {user && initialData?.metadata?.id && (
                <Button
                  onClick={handleShare}
                  size="sm"
                  variant="outline"
                  className="border-purple-500/20 text-purple-400 hover:bg-purple-500/10"
                  disabled={shareStatus === 'sharing'}
                >
                  <Share2 className="w-4 h-4" />
                  {shareStatus === 'sharing' ? 'Sharing...' : 'Share'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Share Modal/Popover */}
      {showShare && publicLink && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-black/60">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 max-w-md w-full text-center">
            <h2 className="text-lg font-bold mb-2">Public Link</h2>
            <p className="text-gray-400 mb-4">Anyone with this link can view your mind map:</p>
            <div className="flex items-center gap-2 justify-center mb-4">
              <input
                type="text"
                value={publicLink}
                readOnly
                className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white text-sm"
                onFocus={e => e.target.select()}
              />
              <Button onClick={handleCopy} size="icon" variant="outline" className="border-blue-500/20">
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            <Button onClick={() => setShowShare(false)} className="w-full bg-blue-600 hover:bg-blue-700 mt-2">Close</Button>
            {shareError && <div className="text-red-400 text-xs mt-2">{shareError}</div>}
          </div>
        </div>
      )}

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
