import { NextResponse } from "next/server"
import axios from "axios"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")

  if (!query) {
    return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
  }

  try {
    // First, get a fresh access token
    const tokenResponse = await axios.post("https://accounts.spotify.com/api/token", 
      new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: process.env.SPOTIFY_REFRESH_TOKEN!,
        client_id: process.env.SPOTIFY_CLIENT_ID!,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET!,
      }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    const access_token = tokenResponse.data.access_token

    // Then use it to search
    const searchResponse = await axios.get(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=5`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    )

    return NextResponse.json(searchResponse.data)
  } catch (error) {
    console.error("Failed to search songs:", error)
    return NextResponse.json({ error: "Failed to search songs" }, { status: 500 })
  }
} 