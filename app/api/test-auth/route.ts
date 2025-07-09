import { NextResponse } from "next/server"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      configured: false,
      message: "Supabase environment variables not configured",
    })
  }

  if (!supabase) {
    return NextResponse.json({
      configured: false,
      message: "Supabase client not initialized",
    })
  }

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    return NextResponse.json({
      configured: true,
      authenticated: !!user,
      user: user ? { id: user.id, email: user.email } : null,
      error: error?.message || null,
    })
  } catch (error) {
    return NextResponse.json({
      configured: true,
      authenticated: false,
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
