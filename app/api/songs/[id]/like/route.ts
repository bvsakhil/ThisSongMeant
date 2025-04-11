import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await request.json()
    const { id: songId} = await params

    // Check if like already exists
    const { data: existingLike, error: checkError } = await supabase
      .from('likes')
      .select()
      .eq('song_id', songId)
      .eq('user_id', userId)
      .single()

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is the "not found" error code
      throw checkError
    }

    if (existingLike) {
      // Unlike if already liked
      const { error: deleteError } = await supabase
        .from('likes')
        .delete()
        .eq('song_id', songId)
        .eq('user_id', userId)

      if (deleteError) throw deleteError
      return NextResponse.json({ liked: false })
    } else {
      // Add new like
      const { data: newLike, error: insertError } = await supabase
        .from('likes')
        .insert([
          {
            song_id: songId,
            user_id: userId
          }
        ])
      if (insertError) throw insertError
      return NextResponse.json({ liked: true })
    }
  } catch (error) {
    console.error('Error toggling like:', error)
    return NextResponse.json(
      { error: 'Failed to toggle like' },
      { status: 500 }
    )
  }
} 