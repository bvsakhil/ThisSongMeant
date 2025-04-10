import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const username = decodeURIComponent(searchParams.get('username') || '')
    const songCount = searchParams.get('songCount') || '0'

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '1200px',
            height: '630px',
            backgroundColor: '#FFF8E1',
            padding: '40px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <h1
              style={{
                fontSize: '64px',
                fontFamily: 'sans-serif',
                color: '#333333',
                margin: '0',
                textAlign: 'center',
              }}
            >
              {username}&apos;s Music Scrapbook
            </h1>
            <p
              style={{
                fontSize: '32px',
                fontFamily: 'sans-serif',
                color: '#666666',
                marginTop: '20px',
              }}
            >
              {songCount} songs meant something
            </p>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e: any) {
    console.error('OG Image generation error:', e.message)
    return new Response(
      JSON.stringify({ error: 'Failed to generate image', details: e.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
} 