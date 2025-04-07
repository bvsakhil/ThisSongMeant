"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"

// Mock data - in a real app, you would fetch this from an API
const getSongById = (id: string) => {
  const songs = [
    {
      id: "1",
      title: "Bohemian Rhapsody",
      artist: "Queen",
      album: "A Night at the Opera",
      year: "1975",
      albumCover: "/placeholder.svg?height=200&width=200&text=1",
    },
    {
      id: "2",
      title: "Imagine",
      artist: "John Lennon",
      album: "Imagine",
      year: "1971",
      albumCover: "/placeholder.svg?height=200&width=200&text=2",
    },
    {
      id: "3",
      title: "Hotel California",
      artist: "Eagles",
      album: "Hotel California",
      year: "1976",
      albumCover: "/placeholder.svg?height=200&width=200&text=3",
    },
    {
      id: "4",
      title: "Stairway to Heaven",
      artist: "Led Zeppelin",
      album: "Led Zeppelin IV",
      year: "1971",
      albumCover: "/placeholder.svg?height=200&width=200&text=4",
    },
    {
      id: "5",
      title: "Sweet Child O' Mine",
      artist: "Guns N' Roses",
      album: "Appetite for Destruction",
      year: "1987",
      albumCover: "/placeholder.svg?height=200&width=200&text=5",
    },
  ]
  return songs.find((song) => song.id === id)
}

export default function CreatePage({ params }: { params: { songId: string } }) {
  const router = useRouter()
  const song = getSongById(params.songId)

  const [note, setNote] = useState("")
  const [username, setUsername] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // In a real app, you would send this data to your API
    setTimeout(() => {
      // Simulate API call
      console.log({
        songId: params.songId,
        note,
        username,
      })

      // Redirect to the wall page
      router.push("/wall")
    }, 1000)
  }

  if (!song) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-amber-50 p-4">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-red-800">Song Not Found</h1>
          <p className="mb-6 text-red-600">The song you're looking for doesn't exist.</p>
          <Link
            href="/search"
            className="inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Back to Search
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-amber-50">
      <header className="border-b border-amber-200 bg-amber-100 px-4 py-4">
        <div className="container mx-auto flex items-center">
          <Link href="/search" className="mr-4 text-red-800 hover:text-red-600">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-bold text-red-800">Share Your Story</h1>
        </div>
      </header>
      <main className="flex-1 py-8">
        <div className="container mx-auto max-w-2xl px-4">
          <div className="mb-8 overflow-hidden rounded-lg border-4 border-amber-200 bg-white p-6 shadow-lg">
            <div className="mb-6 flex flex-col items-center gap-4 sm:flex-row sm:items-start">
              <div className="h-32 w-32 overflow-hidden rounded-md border-2 border-amber-200 bg-amber-100 shadow-md">
                <img
                  src={song.albumCover || "/placeholder.svg"}
                  alt={`${song.title} album cover`}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-2xl font-bold text-red-800">{song.title}</h2>
                <p className="mb-1 text-lg text-red-600">{song.artist}</p>
                <p className="text-sm text-gray-600">
                  {song.album} • {song.year}
                </p>
                <div className="mt-3 inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-red-800">
                  ♪ Selected Song
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="note" className="mb-2 block font-medium text-red-800">
                  What does this song mean to you?
                </label>
                <Textarea
                  id="note"
                  placeholder="Share your story, memory, or feelings about this song..."
                  className="min-h-[120px] border-2 border-amber-200 bg-amber-50 text-gray-800 placeholder:text-amber-400"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="username" className="mb-2 block font-medium text-red-800">
                  Your Display Name
                </label>
                <Input
                  id="username"
                  placeholder="Enter a username or stay anonymous"
                  className="border-2 border-amber-200 bg-amber-50 text-gray-800 placeholder:text-amber-400"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <p className="mt-1 text-xs text-gray-500">This will be displayed with your story on the wall.</p>
              </div>
              <div className="pt-4">
                <Button type="submit" className="w-full bg-red-600 text-white hover:bg-red-700" disabled={isSubmitting}>
                  {isSubmitting ? "Posting..." : "Post to the Wall"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <footer className="border-t border-amber-200 bg-amber-100 px-4 py-6 text-center text-sm text-red-700">
        <div className="container mx-auto">
          <p>© {new Date().getFullYear()} MusicWall. Share your musical memories.</p>
        </div>
      </footer>
    </div>
  )
}

