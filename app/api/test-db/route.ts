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
    // Test database connection by querying the user_profiles table
    const { data: profilesData, error: profilesError } = await supabase.from("user_profiles").select("*").limit(1)
    
    // Test mind_maps table as well
    const { data: mindMapsData, error: mindMapsError } = await supabase.from("mind_maps").select("*").limit(1)

    if (profilesError) {
      return NextResponse.json({
        success: false,
        message: "User profiles table query failed",
        error: profilesError.message,
      })
    }

    if (mindMapsError) {
      return NextResponse.json({
        success: false,
        message: "Mind maps table query failed", 
        error: mindMapsError.message,
      })
    }

    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      data: {
        user_profiles_count: profilesData?.length || 0,
        mind_maps_count: mindMapsData?.length || 0,
      },
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Database connection failed",
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
