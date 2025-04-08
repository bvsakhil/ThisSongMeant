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
  title: string
  artist: string
  album: string
  year: string
  albumCover: string
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
  const isMobile = useMobile()

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

    if (!selectedSong) return

    setIsSubmitting(true)

    // Create a new story object
    const newStory = {
      id: Date.now().toString(), // Generate a unique ID
      title: selectedSong.title,
      artist: selectedSong.artist,
      albumCover: selectedSong.albumCover,
      note:
        note ||
        "This song means so much to me. The melody and lyrics speak to my soul in a way that's hard to describe.",
      username: username || "Anonymous",
      likes: 0,
      color: ["pink", "blue", "green", "yellow", "orange", "teal", "purple", "indigo", "red"][
        Math.floor(Math.random() * 9)
      ],
    }

    // Simulate API delay
    setTimeout(() => {
      onAddStory(newStory)
      setNote("")
      setUsername("")
      setIsSubmitting(false)
    }, 500)
  }

  // For demo purposes, ensure we always have a selected song option
  const dummySong = {
    id: "dummy1",
    title: "Enter Sandman",
    artist: "Metallica",
    album: "Metallica (Black Album)",
    year: "1991",
    albumCover: "/placeholder.svg?height=200&width=200&text=Metallica",
  }

  // If no search results, add dummy results
  const displayResults =
    searchResults.length > 0
      ? searchResults
      : [
          dummySong,
          {
            id: "dummy2",
            title: "Thriller",
            artist: "Michael Jackson",
            album: "Thriller",
            year: "1982",
            albumCover: "/placeholder.svg?height=200&width=200&text=MJ",
          },
          {
            id: "dummy3",
            title: "Wonderwall",
            artist: "Oasis",
            album: "(What's the Story) Morning Glory?",
            year: "1995",
            albumCover: "/placeholder.svg?height=200&width=200&text=Oasis",
          },
        ]

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
              {displayResults.map((song) => (
                <div
                  key={song.id}
                  className="mb-2 flex cursor-pointer items-center gap-3 rounded-md p-3 hover:bg-gray-100"
                  onClick={() => onSongSelect(song)}
                >
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-sm bg-gray-100">
                    <img
                      src={song.albumCover || "/placeholder.svg"}
                      alt={`${song.title} album cover`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{song.title}</h4>
                    <p className="text-sm text-gray-600">
                      {song.artist} • {song.album} ({song.year})
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Step 2: Add note and username for the selected song
          <div>
            <div className="mb-4 flex items-center gap-3 pr-8">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-sm bg-gray-100">
                <img
                  src={selectedSong.albumCover || "/placeholder.svg"}
                  alt={`${selectedSong.title} album cover`}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{selectedSong.title}</h4>
                <p className="text-sm text-gray-600">
                  {selectedSong.artist} • {selectedSong.album} ({selectedSong.year})
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
                />
              </div>

              <div>
                <Input
                  id="username"
                  placeholder="Add your name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-12 text-base p-3"
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
