import { NextRequest, NextResponse } from 'next/server'
import { OpenAI } from 'openai'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { notes } = await request.json()

    if (!notes || typeof notes !== 'string') {
      return NextResponse.json(
        { error: 'Notes are required and must be a string' },
        { status: 400 }
      )
    }

    // Create a prompt for mind map generation
    const prompt = `Analyze the following notes and create a structured mind map. 
    
Notes:
${notes}

Please create a mind map with the following structure:
1. Identify the main topic or central idea
2. Extract key concepts and organize them hierarchically
3. Create logical connections between related concepts
4. Use clear, concise labels for each node

Return the result as a JSON object with this exact structure:
{
  "nodes": [
    {
      "id": "1",
      "label": "Main Topic",
      "position": { "x": 400, "y": 300 },
      "data": { "label": "Main Topic" }
    }
  ],
  "edges": [
    {
      "id": "edge-1-2",
      "source": "1",
      "target": "2"
    }
  ],
  "metadata": {
    "title": "Generated Mind Map",
    "description": "AI-generated from user notes"
  }
}

Ensure all nodes have unique IDs and all edges reference valid node IDs. Position nodes in a logical layout with the main topic in the center.`

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert at analyzing text and creating structured mind maps. Always return valid JSON that can be parsed by JavaScript."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    })

    const responseText = completion.choices[0]?.message?.content

    if (!responseText) {
      throw new Error('No response from AI')
    }

    // Try to extract JSON from the response
    let mindMapData
    try {
      // Look for JSON in the response (it might be wrapped in markdown)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        mindMapData = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('No JSON found in response')
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', responseText)
      // Fallback: create a simple mind map structure
      mindMapData = createFallbackMindMap(notes)
    }

    // Validate and clean the data
    const validatedData = validateMindMapData(mindMapData)

    return NextResponse.json(validatedData)

  } catch (error) {
    console.error('Error generating mind map:', error)
    
    // Return a fallback mind map if AI fails
    const fallbackData = createFallbackMindMap('Notes processing failed')
    
    return NextResponse.json(fallbackData, { status: 200 })
  }
}

function createFallbackMindMap(notes: string) {
  // Create a simple fallback mind map
  const lines = notes.split('\n').filter(line => line.trim().length > 0)
  const nodes: any[] = []
  const edges: any[] = []

  // Create main topic node
  nodes.push({
    id: "1",
    label: "Main Topic",
    position: { x: 400, y: 300 },
    data: { label: "Main Topic" }
  })

  // Create nodes for each line
  lines.slice(0, 5).forEach((line, index) => {
    const nodeId = (index + 2).toString()
    const angle = (index * 72) * (Math.PI / 180) // Distribute nodes in a circle
    const radius = 200
    
    nodes.push({
      id: nodeId,
      label: line.trim().substring(0, 50),
      position: { 
        x: 400 + radius * Math.cos(angle), 
        y: 300 + radius * Math.sin(angle) 
      },
      data: { label: line.trim().substring(0, 50) }
    })

    edges.push({
      id: `edge-1-${nodeId}`,
      source: "1",
      target: nodeId
    })
  })

  return {
    nodes,
    edges,
    metadata: {
      title: "Generated Mind Map",
      description: "AI-generated from user notes"
    }
  }
}

function validateMindMapData(data: any) {
  // Ensure required fields exist
  if (!data.nodes || !Array.isArray(data.nodes)) {
    data.nodes = []
  }

  if (!data.edges || !Array.isArray(data.edges)) {
    data.edges = []
  }

  if (!data.metadata) {
    data.metadata = {
      title: "Generated Mind Map",
      description: "AI-generated from user notes"
    }
  }

  // Ensure all nodes have required fields
  data.nodes = data.nodes.map((node: any, index: number) => ({
    id: node.id || `node-${index + 1}`,
    label: node.label || node.data?.label || "Untitled",
    position: node.position || { x: Math.random() * 800, y: Math.random() * 600 },
    data: {
      label: node.label || node.data?.label || "Untitled",
      ...node.data
    }
  }))

  // Ensure all edges have required fields
  data.edges = data.edges.map((edge: any, index: number) => ({
    id: edge.id || `edge-${index + 1}`,
    source: edge.source,
    target: edge.target
  }))

  return data
}
