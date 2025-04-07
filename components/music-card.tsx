"use client"

import { useState } from "react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Song {
  id: string
  title: string
  artist: string
  albumCover: string
  note: string
  username: string
  likes: number
  color?: string
}

interface MusicCardProps {
  song: Song
}

export function MusicCard({ song }: MusicCardProps) {
  const [likes, setLikes] = useState(song.likes)
  const [hasLiked, setHasLiked] = useState(false)

  const handleLike = () => {
    if (hasLiked) {
      setLikes(likes - 1)
    } else {
      setLikes(likes + 1)
    }
    setHasLiked(!hasLiked)
  }

  // Generate a slight random rotation for sticker effect
  const getRandomRotation = () => {
    // Use the song id to generate a consistent rotation for each card
    const seed = Number.parseInt(song.id, 10) || 0
    return (seed % 5) - 2 // Range from -2 to 2 degrees
  }

  // Get a realistic album cover image based on artist name
  const getAlbumCover = () => {
    // If there's already a valid album cover URL, use it
    if (song.albumCover && !song.albumCover.includes("placeholder.svg")) {
      return song.albumCover
    }

    // Otherwise, use a more realistic placeholder based on artist
    const artistSlug = song.artist.toLowerCase().replace(/\s+/g, "-")
    return `https://source.unsplash.com/100x100/?album,music,${artistSlug}`
  }

  return (
    <div
      className="relative overflow-hidden transition-all duration-300 bg-white rounded-md shadow-md hover:shadow-lg"
      style={{
        transform: `rotate(${getRandomRotation()}deg)`,
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
      }}
    >
      <div className="p-4 md:p-5 relative">
        {/* Album Cover, Title and Artist in one line */}
        <div className="mb-3 md:mb-4 flex items-center gap-3">
          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-sm bg-gray-100">
            <img
              src="https://i1.sndcdn.com/artworks-000116795481-6fmihq-t500x500.jpg"
              alt={`${song.title} by ${song.artist}`}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
          <div>
            <h3 className="text-base md:text-lg font-bold font-instrument text-gray-900">{song.title}</h3>
            <p className="text-sm text-gray-400">{song.artist}</p>
          </div>
        </div>

        {/* Note */}
        <p className="mb-3 text-sm leading-relaxed text-gray-800 font-satoshi">"{song.note}"</p>

        {/* Username and likes */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">- {song.username}</span>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 md:h-7 md:w-7 ${hasLiked ? "text-red-500" : "text-gray-400 hover:text-red-500"}`}
              onClick={handleLike}
              aria-label={hasLiked ? "Unlike" : "Like"}
            >
              <Heart className={`h-4 w-4 md:h-3.5 md:w-3.5 ${hasLiked ? "fill-current" : ""}`} />
            </Button>
            <span className="text-xs font-medium text-gray-700">{likes}</span>
          </div>
        </div>
      </div>

      {/* Sticker border effect */}
      <div className="absolute inset-0 border border-gray-200 rounded-md pointer-events-none"></div>
    </div>
  )
}

