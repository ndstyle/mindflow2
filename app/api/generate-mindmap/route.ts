import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: NextRequest) {
  try {
    const { notes } = await request.json()

    if (!notes || typeof notes !== "string") {
      return NextResponse.json({ error: "notes are required" }, { status: 400 })
    }

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

    // Use OpenAI to generate mind map structure
    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: `you are a mind mapping expert. analyze the provided notes and create a structured mind map.

return a JSON object with this exact structure:
{
  "nodes": [
    {"id": "1", "label": "main topic", "x": 0, "y": 0, "level": 0},
    {"id": "2", "label": "subtopic", "x": 200, "y": -100, "level": 1}
  ],
  "edges": [
    {"id": "e1-2", "source": "1", "target": "2"}
  ],
  "metadata": {
    "title": "mind map title",
    "description": "brief description"
  }
}

rules:
- create 5-15 nodes maximum
- use hierarchical levels (0=main, 1=subtopic, 2=detail)
- position nodes with x,y coordinates for visual layout
- connect related concepts with edges
- extract key themes and organize them logically
- make labels concise but meaningful`,
      prompt: `analyze these notes and create a mind map structure:\n\n${notes}`,
    })

    let mindMapData
    try {
      mindMapData = JSON.parse(text)
    } catch (parseError) {
      console.error("failed to parse ai response:", parseError)
      // Return fallback structure if parsing fails
      mindMapData = {
        nodes: [
          { id: "1", label: "main concept", x: 0, y: 0, level: 0 },
          { id: "2", label: "key point 1", x: 200, y: -100, level: 1 },
          { id: "3", label: "key point 2", x: 200, y: 100, level: 1 },
        ],
        edges: [
          { id: "e1-2", source: "1", target: "2" },
          { id: "e1-3", source: "1", target: "3" },
        ],
        metadata: {
          title: "generated mind map",
          description: "organized from your notes",
          created_at: new Date().toISOString(),
        },
      }
    }

    // Try to save to DB if possible
    if (isSupabaseConfigured()) {
      // Extract access token from cookies (works for Supabase auth v2)
      const cookieHeader = request.headers.get('cookie') || ''
      const accessToken = cookieHeader.split(';').find(c => c.trim().startsWith('sb-access-token='))?.split('=')[1]
      let user = null
      let supabaseWithAuth = supabase
      if (accessToken) {
        supabaseWithAuth = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
          global: { headers: { Authorization: `Bearer ${accessToken}` } }
        })
        const { data, error } = await supabaseWithAuth.auth.getUser()
        if (!error && data?.user) {
          user = data.user
        }
      }
      if (user) {
        const { title, description } = mindMapData.metadata || {}
        const { data, error } = await supabaseWithAuth
          .from("mind_maps")
          .insert({
            user_id: user.id,
            title: title || "Untitled Mind Map",
            description: description || "",
            original_text: notes,
            mind_map_data: mindMapData,
          })
          .select()
          .single()
        if (!error && data) {
          return NextResponse.json({ id: data.id, ...mindMapData })
        }
      }
    }
    // If not authenticated or DB error, just return the generated mind map
    return NextResponse.json(mindMapData)
  } catch (error) {
    console.error("error generating mind map:", error)
    return NextResponse.json({ error: "failed to generate mind map" }, { status: 500 })
  }
}
