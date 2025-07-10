import { NextResponse } from "next/server"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      success: false,
      message: "Supabase environment variables not configured",
    })
  }

  if (!supabase) {
    return NextResponse.json({
      success: false,
      message: "Supabase client not initialized",
    })
  }

  try {
    // Test database connection by querying the mind_maps table
    const { data, error } = await supabase.from("mind_maps").select("count(*)").limit(1)

    if (error) {
      return NextResponse.json({
        success: false,
        message: "Database query failed",
        error: error.message,
      })
    }

    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      data,
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Database connection failed",
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
