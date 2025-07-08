import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 })
    }

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

    return NextResponse.json({ mindMap: mindMapData })
  } catch (error) {
    console.error("Error generating mind map:", error)
    return NextResponse.json({ error: "Failed to generate mind map" }, { status: 500 })
  }
}
