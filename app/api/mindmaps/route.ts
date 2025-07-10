import { type NextRequest, NextResponse } from "next/server"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  if (!isSupabaseConfigured() || !supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 })
  }

  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: mind_maps, error } = await supabase
      .from("mind_maps")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to fetch mind maps" }, { status: 500 })
    }

    return NextResponse.json({ mind_maps })
  } catch (error) {
    console.error("Error fetching mind maps:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured() || !supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 })
  }

  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, content, node_count } = await request.json()

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 })
    }

    const { data: mindmap, error } = await supabase
      .from("mind_maps")
      .insert({
        user_id: user.id,
        title,
        content,
        node_count: node_count || 0,
      })
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to save mind map" }, { status: 500 })
    }

    return NextResponse.json({ mindmap })
  } catch (error) {
    console.error("Error saving mind map:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
