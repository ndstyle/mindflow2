import html2canvas from 'html2canvas'

export interface MindMapData {
  nodes: any[]
  edges: any[]
  metadata?: {
    title?: string
    description?: string
  }
}

export const exportToJSON = (data: MindMapData, filename?: string) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json'
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename || `mindmap-${Date.now()}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export const exportToPNG = async (element: HTMLElement, filename?: string) => {
  try {
    const canvas = await html2canvas(element, {
      backgroundColor: '#000000',
      scale: 2,
      useCORS: true,
      allowTaint: true
    })
    
    const link = document.createElement('a')
    link.download = filename || `mindmap-${Date.now()}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  } catch (error) {
    console.error('Error exporting to PNG:', error)
    throw new Error('Failed to export PNG')
  }
}

export const exportToSVG = (data: MindMapData, filename?: string) => {
  // Create SVG representation of the mind map
  const svgContent = generateSVG(data)
  const blob = new Blob([svgContent], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename || `mindmap-${Date.now()}.svg`
  a.click()
  URL.revokeObjectURL(url)
}

const generateSVG = (data: MindMapData): string => {
  const width = 1200
  const height = 800
  const padding = 50
  
  let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`
  svg += `<rect width="${width}" height="${height}" fill="#000000"/>`
  
  // Add nodes
  data.nodes.forEach((node, index) => {
    const x = (node.position?.x || 100) + padding
    const y = (node.position?.y || 100) + padding
    const label = node.data?.label || node.label || 'Untitled'
    
    // Node circle
    svg += `<circle cx="${x}" cy="${y}" r="30" fill="#3b82f6" stroke="#1d4ed8" stroke-width="2"/>`
    
    // Node text
    svg += `<text x="${x}" y="${y + 5}" text-anchor="middle" fill="white" font-family="Arial" font-size="12">${label}</text>`
  })
  
  // Add edges
  data.edges.forEach((edge) => {
    const sourceNode = data.nodes.find(n => n.id === edge.source)
    const targetNode = data.nodes.find(n => n.id === edge.target)
    
    if (sourceNode && targetNode) {
      const x1 = (sourceNode.position?.x || 100) + padding
      const y1 = (sourceNode.position?.y || 100) + padding
      const x2 = (targetNode.position?.x || 100) + padding
      const y2 = (targetNode.position?.y || 100) + padding
      
      svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#6b7280" stroke-width="2"/>`
    }
  })
  
  svg += '</svg>'
  return svg
}

export const copyToClipboard = async (data: MindMapData) => {
  try {
    await navigator.clipboard.writeText(JSON.stringify(data, null, 2))
    return true
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
    return false
  }
}

export const generateShareableLink = (data: MindMapData): string => {
  const encodedData = encodeURIComponent(JSON.stringify(data))
  return `${window.location.origin}/map/temp?data=${encodedData}`
}
