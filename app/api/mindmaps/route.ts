import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all mind maps for the user
    const { data, error } = await supabase
      .from('mind_maps')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching mind maps:', error)
    return NextResponse.json(
      { error: 'Failed to fetch mind maps' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { title, description, nodes, edges, metadata } = await request.json()

    // Validate required fields
    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    // Create new mind map
    const { data, error } = await supabase
      .from('mind_maps')
      .insert({
        title,
        description,
        nodes: nodes || [],
        edges: edges || [],
        metadata: metadata || {},
        user_id: user.id
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error creating mind map:', error)
    return NextResponse.json(
      { error: 'Failed to create mind map' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, title, description, nodes, edges, metadata } = await request.json()

    if (!id) {
      return NextResponse.json(
        { error: 'Mind map ID is required' },
        { status: 400 }
      )
    }

    // Update mind map
    const { data, error } = await supabase
      .from('mind_maps')
      .update({
        title,
        description,
        nodes: nodes || [],
        edges: edges || [],
        metadata: metadata || {},
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating mind map:', error)
    return NextResponse.json(
      { error: 'Failed to update mind map' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Mind map ID is required' },
        { status: 400 }
      )
    }

    // Delete mind map
    const { error } = await supabase
      .from('mind_maps')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting mind map:', error)
    return NextResponse.json(
      { error: 'Failed to delete mind map' },
      { status: 500 }
    )
  }
} 