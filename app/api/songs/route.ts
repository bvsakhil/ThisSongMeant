import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { 
      id: spotify_id, 
      title, 
      artist, 
      album, 
      albumCover: album_cover,
      note,
      username,
      color,
      spotifyUrl: spotify_url,
      userId: user_id 
    } = body

    // Insert the song
    const { data, error } = await supabase
      .from('songs')
      .insert([
        {
          spotify_id,
          title,
          artist,
          album,
          album_cover,
          note,
          username,
          color,
          spotify_url,
          user_id
        }
      ])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error saving song:', error)
    return NextResponse.json(
      { error: 'Failed to save song' },
      { status: 500 }
    )
  }
}

// Get all songs with their like counts
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = 9
    const start = (page - 1) * limit
    const end = start + limit - 1

    // First get total count
    const { count: totalCount } = await supabase
      .from('songs')
      .select('*', { count: 'exact', head: true })

    // Then get paginated songs
    const { data: songs, error: songsError } = await supabase
      .from('songs')
      .select(`
        *,
        likes: likes(count)
      `)
      .order('created_at', { ascending: false })
      .range(start, end)

    if (songsError) throw songsError

    // Get user likes
    let userLikes: Record<string, boolean> = {}
    if (userId) {
      const { data: likes, error: likesError } = await supabase
        .from('likes')
        .select('song_id')
        .eq('user_id', userId)

      if (likesError) throw likesError

      userLikes = likes.reduce((acc: Record<string, boolean>, like) => {
        acc[like.song_id] = true
        return acc
      }, {})
    }

    // Transform the data
    const songsWithLikes = songs.map(song => ({
      ...song,
      likes: song.likes[0]?.count || 0,
      user_likes: !!userLikes[song.id]
    }))

    return NextResponse.json({
      songs: songsWithLikes,
      hasMore: totalCount ? totalCount > (page * limit) : false,
      total: totalCount
    })
  } catch (error) {
    console.error('Error fetching songs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch songs' },
      { status: 500 }
    )
  }
} 

