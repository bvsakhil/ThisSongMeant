import { ImageResponse } from 'next/og'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'edge'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

function truncateText(text: string | null | undefined, maxLength: number) {
  if (!text) return ''
  if (text.length <= maxLength) return text

  return `${text.slice(0, maxLength).trim()}...`
}

function arrayBufferToBase64(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer)
  let binary = ''

  for (let i = 0; i < bytes.byteLength; i += 1) {
    binary += String.fromCharCode(bytes[i])
  }

  return btoa(binary)
}

async function getAlbumCoverDataUrl(albumCover: string | null | undefined) {
  if (!albumCover || albumCover.includes('placeholder.svg')) {
    return null
  }

  try {
    const response = await fetch(albumCover)
    if (!response.ok) return null

    const contentType = response.headers.get('content-type') || 'image/jpeg'
    if (!contentType.startsWith('image/')) return null

    const buffer = await response.arrayBuffer()
    const base64 = arrayBufferToBase64(buffer)

    return `data:${contentType};base64,${base64}`
  } catch {
    return null
  }
}

export async function GET(
  _request: Request,
  { params }: { params: { songId: string } }
) {
  try {
    const { songId } = await params

    const { data: song, error } = await supabase
      .from('songs')
      .select('id, title, artist, album_cover, note, username')
      .eq('id', songId)
      .single()

    if (error || !song) {
      return new Response('Story not found', { status: 404 })
    }

    const title = truncateText(song.title, 58)
    const artist = truncateText(song.artist, 42)
    const note = truncateText(song.note, 360)
    const username = truncateText(song.username, 28)
    const albumCover = await getAlbumCoverDataUrl(song.album_cover)

    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            background: '#FFF8E1',
            color: '#2f2f2f',
            padding: '72px',
            fontFamily: 'Georgia, serif',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '34px',
            }}
          >
            <div
              style={{
                display: 'flex',
                width: '220px',
                height: '220px',
                borderRadius: '18px',
                overflow: 'hidden',
                background: '#f1e7c8',
                boxShadow: '0 18px 40px rgba(0,0,0,0.18)',
                flexShrink: 0,
              }}
            >
              {albumCover ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={albumCover}
                  alt=""
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#2f2f2f',
                    fontSize: 92,
                  }}
                >
                  ♪
                </div>
              )}
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                minWidth: 0,
                flex: 1,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  fontSize: 58,
                  lineHeight: 1,
                  fontWeight: 700,
                  letterSpacing: '-0.01em',
                  marginBottom: '18px',
                }}
              >
                {title}
              </div>
              <div
                style={{
                  display: 'flex',
                  fontFamily: 'Arial, sans-serif',
                  fontSize: 32,
                  lineHeight: 1.2,
                  color: '#666',
                }}
              >
                {artist}
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              borderTop: '2px solid rgba(47,47,47,0.12)',
              borderBottom: '2px solid rgba(47,47,47,0.12)',
              padding: '52px 0',
              margin: '44px 0 36px',
            }}
          >
            <div
              style={{
                display: 'flex',
                fontSize: 46,
                lineHeight: 1.22,
                color: '#333',
              }}
            >
              “{note}”
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontFamily: 'Arial, sans-serif',
            }}
          >
            <div
              style={{
                display: 'flex',
                fontSize: 30,
                color: '#666',
              }}
            >
              shared by {username || 'someone'}
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: 30,
                fontWeight: 700,
                color: '#333',
              }}
            >
              <span style={{ fontFamily: 'Georgia, serif', fontSize: 36 }}>♪</span>
              thissongmeant
            </div>
          </div>
        </div>
      ),
      {
        width: 1080,
        height: 1080,
      }
    )
  } catch (error: any) {
    console.error('Failed to generate share card:', error)
    return new Response(`Failed to generate share card: ${error.message}`, {
      status: 500,
    })
  }
}
