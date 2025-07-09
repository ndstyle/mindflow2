import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Test basic connection by trying to select from mind_maps
    const { data: connectionTest, error: connectionError } = await supabase
      .from('mind_maps')
      .select('id, title')
      .limit(1)
    
    if (connectionError) {
      return NextResponse.json({
        success: false,
        error: connectionError.message,
        details: connectionError,
        note: 'This might be due to RLS policies or missing table'
      }, { status: 500 })
    }

    // Test if we can insert a test record (this will fail if user not authenticated)
    const testData = {
      title: 'Test Mind Map',
      description: 'Test description',
      original_text: 'Test original text',
      mind_map_data: { nodes: [], edges: [] }
    }

    const { data: insertData, error: insertError } = await supabase
      .from('mind_maps')
      .insert(testData)
      .select()

    if (insertError) {
      return NextResponse.json({
        success: true,
        message: 'Database connection successful, but insert failed (expected - user not authenticated)',
        connectionTest,
        insertError: insertError.message,
        note: 'This is normal - you need to be logged in to insert data'
      })
    }

    // Clean up test data if insert succeeded
    if (insertData && insertData[0]) {
      await supabase
        .from('mind_maps')
        .delete()
        .eq('id', insertData[0].id)
    }

    return NextResponse.json({
      success: true,
      message: 'Database connection and table operations successful',
      connectionTest,
      insertTest: insertData
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Unexpected error',
      details: error
    }, { status: 500 })
  }
} 