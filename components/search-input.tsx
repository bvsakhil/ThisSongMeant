'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import { Track } from '@/types/spotify'

interface SearchInputProps {
  isSticky?: boolean
  onSongSelect: (song: Track) => void
  showSearchInput: boolean
  setShowSearchInput: (show: boolean) => void
  className?: string
}

export function SearchInput({ 
  isSticky = false, 
  onSongSelect,
  showSearchInput,
  setShowSearchInput,
  className = "" 
}: SearchInputProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Track[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  const debouncedSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      setShowDropdown(false)
      return
    }

    setIsLoading(true)
    try {
      const response = await axios.get(`/api/spotify/search?q=${encodeURIComponent(query)}`)
      setSearchResults(response.data.tracks.items)
      setShowDropdown(true)
    } catch (error) {
      console.error("Failed to search:", error)
      setSearchResults([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      debouncedSearch(searchQuery)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery])

  return (
    <div className={`relative ${className}`}>
      {!showSearchInput && !isSticky ? (
        <div className="flex justify-center">
          <Button
            onClick={() => setShowSearchInput(true)}
            className="h-12 w-48 rounded-full bg-[#333] text-base text-white hover:bg-[#555]"
          >
            Add your song
          </Button>
        </div>
      ) : (
        <>
          <div className="relative">
            <Input
              type="search"
              placeholder="Search a song to add..."
              className="h-12 w-full rounded-full border-[#333] pr-10 text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
              onBlur={() => {
                if (!searchQuery && !isSticky) {
                  setTimeout(() => {
                    setShowSearchInput(false)
                  }, 200)
                }
              }}
              autoFocus
              aria-label="Search for songs"
            />
            {isLoading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#333] border-t-transparent" />
              </div>
            )}
          </div>

          {/* Search results dropdown */}
          {showDropdown && searchResults.length > 0 && (
            <div className={`absolute ${isSticky ? 'bottom-full mb-1' : 'top-full mt-1'} w-full rounded-md border border-gray-200 bg-white shadow-lg z-50`}>
              <div className="max-h-60 overflow-auto py-1">
                {searchResults.map((track) => (
                  <div
                    key={track.id}
                    className="flex cursor-pointer items-center gap-3 px-4 py-3 hover:bg-gray-100"
                    onClick={() => onSongSelect(track)}
                  >
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-sm bg-gray-100">
                      <img
                        src={track.album.images[0]?.url || "/placeholder.svg"}
                        alt={`${track.name} album cover`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{track.name}</div>
                      <div className="text-sm text-gray-600">{track.artists[0].name}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
} 