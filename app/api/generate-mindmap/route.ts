import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 })
    }

<<<<<<< Updated upstream
    const { text: result } = await generateText({
      model: openai("gpt-4o"),
      system: `You are an expert at analyzing unstructured text and creating mind maps. 
      Extract key concepts, relationships, and hierarchies from the given text.
      Return a JSON structure representing a mind map with nodes and connections.
      
      Format:
      {
        "title": "Main topic",
        "nodes": [
          {
            "id": "unique_id",
            "label": "Node text",
            "type": "main|subtopic|task|note",
            "x": 0,
            "y": 0,
            "color": "#color"
          }
        ],
        "connections": [
          {
            "from": "node_id",
            "to": "node_id",
            "type": "relates_to|part_of|leads_to"
          }
        ]
      }`,
      prompt: `Analyze this text and create a mind map structure: ${text}`,
    })

    // Parse the AI response as JSON
    const mindMapData = JSON.parse(result)
=======
    // Check if OpenAI API key is configured
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey || apiKey === "your-openai-api-key") {
      // Return fallback data for demo mode
      return NextResponse.json({
        nodes: [
          { id: "1", label: "main topic", x: 0, y: 0, level: 0 },
          { id: "2", label: "subtopic 1", x: 200, y: -100, level: 1 },
          { id: "3", label: "subtopic 2", x: 200, y: 100, level: 1 },
          { id: "4", label: "detail 1", x: 400, y: -150, level: 2 },
          { id: "5", label: "detail 2", x: 400, y: -50, level: 2 },
        ],
        edges: [
          { id: "e1-2", source: "1", target: "2" },
          { id: "e1-3", source: "1", target: "3" },
          { id: "e2-4", source: "2", target: "4" },
          { id: "e2-5", source: "2", target: "5" },
        ],
        metadata: {
          title: "demo mind map",
          description: "generated from your notes",
          created_at: new Date().toISOString(),
        },
      })
    }

    // Use OpenAI to generate mind map structure with improved prompting
    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: `You are an expert mind mapping specialist. Your task is to analyze the provided notes and create a comprehensive, well-structured mind map that organizes information hierarchically and visually.

CRITICAL REQUIREMENTS:
1. Return ONLY valid JSON - no explanations, no markdown, no code blocks
2. Follow the exact structure specified below
3. Create meaningful, hierarchical relationships
4. Position nodes for optimal visual layout
5. Extract the main topic and organize subtopics logically

JSON STRUCTURE:
{
  "nodes": [
    {
      "id": "1",
      "label": "Main Topic",
      "x": 0,
      "y": 0,
      "level": 0
    },
    {
      "id": "2", 
      "label": "Subtopic 1",
      "x": 200,
      "y": -100,
      "level": 1
    }
  ],
  "edges": [
    {
      "id": "e1-2",
      "source": "1",
      "target": "2"
    }
  ],
  "metadata": {
    "title": "Descriptive Title",
    "description": "Brief description of the mind map"
  }
}

RULES:
- Create 5-20 nodes maximum
- Use hierarchical levels: 0 (main), 1 (subtopic), 2 (detail), 3 (sub-detail)
- Position nodes with x,y coordinates for visual layout (x: -400 to 400, y: -300 to 300)
- Main topic should be at center (0,0)
- Connect related concepts with edges
- Make labels concise but descriptive (2-8 words max)
- Extract key themes and organize them logically
- Ensure all nodes are connected to the main topic either directly or indirectly
- Use clear, professional language
- Avoid redundant or overlapping concepts`,
      prompt: `Analyze these notes and create a comprehensive mind map structure:

NOTES:
${notes}

Generate a mind map that captures the main concepts, relationships, and hierarchy from these notes.`,
    })

    let mindMapData
    try {
      mindMapData = JSON.parse(text)
      
      // Validate the structure
      if (!mindMapData.nodes || !Array.isArray(mindMapData.nodes) || mindMapData.nodes.length === 0) {
        throw new Error("Invalid nodes structure")
      }
      if (!mindMapData.edges || !Array.isArray(mindMapData.edges)) {
        mindMapData.edges = []
      }
      if (!mindMapData.metadata) {
        mindMapData.metadata = {}
      }
      
      // Ensure all nodes have required fields
      mindMapData.nodes = mindMapData.nodes.map((node: any, index: number) => ({
        id: node.id || `node-${index + 1}`,
        label: node.label || "Untitled",
        x: typeof node.x === 'number' ? node.x : 0,
        y: typeof node.y === 'number' ? node.y : 0,
        level: typeof node.level === 'number' ? node.level : 0,
        ...node
      }))
      
      // Ensure all edges have required fields
      mindMapData.edges = mindMapData.edges.map((edge: any, index: number) => ({
        id: edge.id || `edge-${index + 1}`,
        source: edge.source,
        target: edge.target,
        ...edge
      }))
      
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError)
      console.error("Raw response:", text)
      
      // Return fallback structure if parsing fails
      mindMapData = {
        nodes: [
          { id: "1", label: "Main Concept", x: 0, y: 0, level: 0 },
          { id: "2", label: "Key Point 1", x: 200, y: -100, level: 1 },
          { id: "3", label: "Key Point 2", x: 200, y: 100, level: 1 },
          { id: "4", label: "Detail 1", x: 400, y: -150, level: 2 },
          { id: "5", label: "Detail 2", x: 400, y: -50, level: 2 },
        ],
        edges: [
          { id: "e1-2", source: "1", target: "2" },
          { id: "e1-3", source: "1", target: "3" },
          { id: "e2-4", source: "2", target: "4" },
          { id: "e2-5", source: "2", target: "5" },
        ],
        metadata: {
          title: "Generated Mind Map",
          description: "Organized from your notes",
          created_at: new Date().toISOString(),
        },
      }
    }
>>>>>>> Stashed changes

    return NextResponse.json({ mindMap: mindMapData })
  } catch (error) {
    console.error("Error generating mind map:", error)
    return NextResponse.json({ error: "Failed to generate mind map" }, { status: 500 })
  }
}
