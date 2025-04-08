"use client"

import { useState, useEffect } from "react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getUserId } from "@/lib/user"

interface Song {
  id: string
  title: string
  artist: string
  album_cover: string
  note: string
  username: string
  likes: number
  color?: string
  spotify_url?: string
  user_likes: boolean
}

interface MusicCardProps {
  song: Song
}

export function MusicCard({ song }: MusicCardProps) {
  const [likes, setLikes] = useState(song.likes)
  const [hasLiked, setHasLiked] = useState(song.user_likes)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleLike = async () => {
    if (isUpdating) return

    try {
      setIsUpdating(true)
      const userId = getUserId()
      
      // Optimistic update
      setHasLiked(!hasLiked)
      setLikes(prev => hasLiked ? prev - 1 : prev + 1)

      const response = await fetch(`/api/songs/${song.id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      })

      if (!response.ok) {
        throw new Error('Failed to update like')
      }

      const { liked } = await response.json()
      
      // Update state if the server response differs from our optimistic update
      if (liked !== !hasLiked) {
        setHasLiked(liked)
        setLikes(prev => liked ? prev + 1 : prev - 1)
      }
    } catch (error) {
      console.error('Error updating like:', error)
      // Revert the optimistic update if there was an error
      setHasLiked(hasLiked)
      setLikes(prev => hasLiked ? prev + 1 : prev - 1)
    } finally {
      setIsUpdating(false)
    }
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
    if (song.album_cover && !song.album_cover.includes("placeholder.svg")) {
      return song.album_cover
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
          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-sm bg-gray-100 relative">
            <img
              src={song.album_cover || "https://i1.sndcdn.com/artworks-000116795481-6fmihq-t500x500.jpg"}
              alt={`${song.title} by ${song.artist}`}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-base md:text-lg font-bold font-instrument text-gray-900">{song.title}</h3>
            <p className="text-sm text-gray-400">{song.artist}</p>
          </div>
          <a
            href={
              song.spotify_url || `https://open.spotify.com/search/${encodeURIComponent(song.title + " " + song.artist)}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center h-6 w-6 rounded-full bg-[#1DB954] text-white hover:bg-[#1ed760] transition-colors"
            aria-label={`Listen to ${song.title} on Spotify`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="currentColor"
              stroke="none"
            >
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.48.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
            </svg>
          </a>
        </div>

        {/* Note */}
        <p className="mb-3 text-sm leading-relaxed text-gray-800 font-satoshi">
          {song.note}
        </p>

        {/* Username and likes */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">- {song.username}</span>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 md:h-7 md:w-7 ${
                hasLiked ? "text-red-500" : "text-gray-400 hover:text-red-500"
              }`}
              onClick={handleLike}
              disabled={isUpdating}
              aria-label={hasLiked ? "Unlike" : "Like"}
            >
              <Heart 
                className={`h-4 w-4 md:h-3.5 md:w-3.5 transition-all duration-300 ${
                  hasLiked ? "fill-current scale-110" : "scale-100"
                }`} 
              />
            </Button>
            <span className="text-xs font-medium text-gray-700">
              {likes}
            </span>
          </div>
        </div>
      </div>

      {/* Sticker border effect */}
      <div className="absolute inset-0 border border-gray-200 rounded-md pointer-events-none"></div>
    </div>
  )
}
