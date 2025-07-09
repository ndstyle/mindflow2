import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    
    // Test sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
        code: error.status,
        details: error
      }, { status: 400 })
    }
    
    return NextResponse.json({
      success: true,
      user: data.user?.email,
      session: !!data.session
    })
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Unexpected error',
      details: error
    }, { status: 500 })
  }
} 