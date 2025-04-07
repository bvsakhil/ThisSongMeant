"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Search, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const mockSongs = [
  { id: "1", title: "Bohemian Rhapsody", artist: "Queen", album: "A Night at the Opera", year: "1975" },
  { id: "2", title: "Imagine", artist: "John Lennon", album: "Imagine", year: "1971" },
  { id: "3", title: "Hotel California", artist: "Eagles", album: "Hotel California", year: "1976" },
  { id: "4", title: "Stairway to Heaven", artist: "Led Zeppelin", album: "Led Zeppelin IV", year: "1971" },
  { id: "5", title: "Sweet Child O' Mine", artist: "Guns N' Roses", album: "Appetite for Destruction", year: "1987" },
]

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState(mockSongs)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would fetch results from an API
    const filteredResults = mockSongs.filter(
      (song) =>
        song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    setSearchResults(filteredResults)
  }

  return (
    <div className="flex min-h-screen flex-col bg-amber-50">
      <header className="border-b border-amber-200 bg-amber-100 px-4 py-4">
        <div className="container mx-auto flex items-center">
          <Link href="/" className="mr-4 text-red-800 hover:text-red-600">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-bold text-red-800">Find Your Song</h1>
        </div>
      </header>
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-red-500" />
                <Input
                  type="search"
                  placeholder="Search for a song or artist..."
                  className="w-full border-2 border-red-200 bg-white pl-10 text-red-800 placeholder:text-red-300"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button type="submit" className="bg-red-600 text-white hover:bg-red-700">
                Search
              </Button>
            </div>
          </form>

          <div className="rounded-lg border-2 border-amber-200 bg-white p-4">
            <h2 className="mb-4 font-serif text-xl font-bold text-red-800">Search Results</h2>
            <div className="divide-y divide-amber-100">
              {searchResults.length > 0 ? (
                searchResults.map((song) => (
                  <Link
                    key={song.id}
                    href={`/create/${song.id}`}
                    className="flex items-center gap-4 p-3 transition-colors hover:bg-amber-50"
                  >
                    <div className="h-12 w-12 overflow-hidden rounded bg-amber-100">
                      <img
                        src={`/placeholder.svg?height=48&width=48&text=${song.id}`}
                        alt={`${song.title} album cover`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-red-800">{song.title}</h3>
                      <p className="text-sm text-red-600">
                        {song.artist} • {song.album} ({song.year})
                      </p>
                    </div>
                    <Button variant="ghost" className="text-red-600 hover:bg-red-50 hover:text-red-700">
                      Select
                    </Button>
                  </Link>
                ))
              ) : (
                <div className="py-8 text-center text-gray-500">
                  <p>No songs found. Try a different search term.</p>
                </div>
              )}
            </div>
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

