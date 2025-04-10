import { ImageResponse } from 'next/og'

export const runtime = 'edge'

async function loadGoogleFont(font: string, text: string) {
  const url = `https://fonts.googleapis.com/css2?family=${font}&text=${encodeURIComponent(text)}`
  const css = await (await fetch(url)).text()
  const resource = css.match(/src: url\((.+)\) format\('(opentype|truetype)'\)/)

  if (resource) {
    const response = await fetch(resource[1])
    if (response.status == 200) {
      return await response.arrayBuffer()
    }
  }

  throw new Error('failed to load font data')
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get('username')

    if (!username) {
      return new Response('Missing username parameter', { status: 400 })
    }

    const text = `${username}'s Music Scrapbook`
    const fontData = await loadGoogleFont('Instrument+Serif', text)

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#FDF8F0',
            padding: '60px 40px',
          }}
        >
          {/* Title Section */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'center',
              width: '100%',
              marginBottom: '40px',
            }}
          >
            <div
              style={{
                display: 'flex',
                fontSize: 92,
                fontFamily: 'Instrument Serif',
                fontWeight: '400',
                color: '#2D2D2D',
                lineHeight: '1',
                marginBottom: '8px',
              }}
            >
              {username}'s
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: 120,
                fontFamily: 'Instrument Serif',
                fontWeight: '400',
                color: '#2D2D2D',
                lineHeight: '1',
              }}
            >
              Music Scrapbook
            </div>
          </div>

          {/* Album Covers Section */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '24px',
              alignItems: 'center',
              width: '100%',
              height: '180px',
            }}
          >
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  width: '180px',
                  height: '180px',
                  backgroundColor: '#e0e0e0',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  flexShrink: 0,
                  position: 'relative',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`${process.env.PRODUCTION_URL ? process.env.PRODUCTION_URL : ''}/images/coverphoto_${String(i + 1).padStart(2, '0')}.png`}
                  alt={`Album cover ${i + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'Instrument Serif',
            data: fontData,
            style: 'normal',
          },
        ],
      }
    )
  } catch (e: any) {
    console.log(`${e.message}`)
    return new Response(`Failed to generate the image: ${e.message}`, {
      status: 500,
    })
  }
}
