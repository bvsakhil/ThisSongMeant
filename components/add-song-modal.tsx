"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useMobile } from "@/hooks/use-mobile"

interface Song {
  id: string
  name: string
  artists: { name: string }[]
  album: {
    name: string
    images: { url: string }[]
    release_date: string
  }
  external_urls: {
    spotify: string
  }
}

interface AddSongModalProps {
  isOpen: boolean
  onClose: () => void
  searchResults: Song[]
  selectedSong: Song | null
  onSongSelect: (song: Song) => void
  onAddStory: (story: any) => void
}

export function AddSongModal({
  isOpen,
  onClose,
  searchResults,
  selectedSong,
  onSongSelect,
  onAddStory,
}: AddSongModalProps) {
  const [note, setNote] = useState("")
  const [username, setUsername] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Transform the Spotify track data into your story format
    const newStory = {
      id: selectedSong?.id,
      title: selectedSong?.name,
      artist: selectedSong?.artists[0]?.name,
      album: selectedSong?.album?.name,
      albumCover: selectedSong?.album?.images[0]?.url || "/placeholder.svg",
      note,
      username,
      likes: 0,
      color: getRandomColor(),
      spotifyUrl: selectedSong?.external_urls?.spotify
    }

    onAddStory(newStory)
    setNote("")
    setUsername("")
  }

  // Helper function to generate random colors for stories
  function getRandomColor() {
    const colors = ["pink", "blue", "green", "yellow", "orange", "purple", "indigo", "red", "teal"]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="relative w-full max-w-md rounded-lg bg-white p-4 md:p-6 shadow-xl max-h-[90vh] overflow-auto">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 md:right-4 md:top-4 text-gray-500 hover:text-gray-700 p-2 z-10"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {!selectedSong ? (
          // Step 1: Select a song from search results
          <div>
            <h3 className="mb-4 text-xl font-bold text-gray-900 pr-8">Select a Song</h3>

            <div className="max-h-[60vh] overflow-y-auto">
              {searchResults.map((song) => (
                <div
                  key={song.id}
                  className="mb-2 flex cursor-pointer items-center gap-3 rounded-md p-3 hover:bg-gray-100"
                  onClick={() => onSongSelect(song)}
                >
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-sm bg-gray-100">
                    <img
                      src={song.album.images[0]?.url || "/placeholder.svg"}
                      alt={`${song.name} album cover`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{song.name}</h4>
                    <p className="text-sm text-gray-600">
                      {song.artists[0].name} • {song.album.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Step 2: Add note for selected song
          <div>
            <h3 className="mb-4 text-xl font-bold text-gray-900 pr-8">Add Your Story</h3>

            <div className="mb-4 flex items-center gap-3">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-sm bg-gray-100">
                <img
                  src={selectedSong.album.images[0]?.url || "/placeholder.svg"}
                  alt={`${selectedSong.name} album cover`}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{selectedSong.name}</h4>
                <p className="text-sm text-gray-600">
                  {selectedSong.artists[0].name} • {selectedSong.album.name}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Textarea
                  id="note"
                  placeholder="Share your story, memory, or feelings about this song..."
                  className="min-h-[120px] resize-none text-base p-3"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  required
                />
              </div>

              <div>
                <Input
                  id="username"
                  placeholder="Add your name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-12 text-base p-3"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">This will be displayed with your story on the wall.</p>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full bg-[#333] text-white hover:bg-[#555] h-12 text-base"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Posting..." : "Post to Wall"}
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
