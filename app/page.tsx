"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MusicCard } from "@/components/music-card"
import { AddSongModal } from "@/components/add-song-modal"
import Image from "next/image"
import { Plus } from "lucide-react"
import axios from "axios"
import { getUserId } from "@/lib/user"
import { LoadingSkeleton } from "@/components/loading-skeleton"

interface Track {
  id: string
  name: string
  artists: { name: string }[]
  album: {
    name: string
    images: { url: string }[]
  },
  external_urls: {
    spotify: string
  },
  href: string
}

export default function Home() {
  const [stories, setStories] = useState<any[]>([])
  const [isLoadingStories, setIsLoadingStories] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedSong, setSelectedSong] = useState<any>(null)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [showStickySearch, setShowStickySearch] = useState(false)
  const [showFloatingSearch, setShowFloatingSearch] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const mainSearchRef = useRef<HTMLDivElement>(null)
  const floatingSearchRef = useRef<HTMLDivElement>(null)
  const [showSearchInput, setShowSearchInput] = useState(false)

  // Handle scroll to show/hide floating button
  useEffect(() => {
    const handleScroll = () => {
      if (mainSearchRef.current) {
        const mainSearchPosition = mainSearchRef.current.getBoundingClientRect().top
        // Show floating button when the main search is scrolled out of view
        setShowStickySearch(mainSearchPosition < 0)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Handle clicks outside the search dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }

      if (
        floatingSearchRef.current &&
        showFloatingSearch &&
        !floatingSearchRef.current.contains(event.target as Node)
      ) {
        setShowFloatingSearch(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showFloatingSearch])

  const fetchSongs = async (page: number, append = false) => {
    try {
      const loadingState = append ? setIsLoadingMore : setIsLoadingStories
      loadingState(true)
      
      const userId = getUserId()
      const response = await fetch(`/api/songs?userId=${userId}&page=${page}`)
      if (!response.ok) throw new Error('Failed to fetch songs')
      
      const data = await response.json()
      
      setStories(prev => append ? [...prev, ...data.songs] : data.songs)
      setHasMore(data.hasMore)
    } catch (error) {
      console.error('Error fetching songs:', error)
    } finally {
      const loadingState = append ? setIsLoadingMore : setIsLoadingStories
      loadingState(false)
    }
  }

  // Move the fetch inside useEffect
  useEffect(() => {
    setIsLoadingStories(true)
    fetchSongs(1)
  }, [])

  const handleLoadMore = () => {
    const nextPage = currentPage + 1
    setCurrentPage(nextPage)
    fetchSongs(nextPage, true)
  }

  const handleSongSelect = (song: any) => {
    setSelectedSong(song)
    setSearchQuery("")
    setShowDropdown(false)
    setShowSearchInput(false)
    setShowFloatingSearch(false)
    setIsModalOpen(true)
  }

  const handleAddStory = async (newStory: any) => {
    try {
      const userId = getUserId()
      
      // Save to Supabase
      const response = await axios.post('/api/songs', {
        ...newStory,
        userId
      })
      if (response.status !== 200) {
        throw new Error('Failed to save song')
      }

      const savedSong = response.data

      // Add the new story to the beginning of the stories array
      setStories([savedSong, ...stories])
      setIsModalOpen(false)
      setSelectedSong(null)

      // Show success message
      setShowSuccessMessage(true)
      setTimeout(() => {
        setShowSuccessMessage(false)
      }, 3000)
    } catch (error) {
      console.error('Error saving song:', error)
      // You might want to show an error message to the user here
    }
  }

  // Shared search input component
  const SearchInput = ({ isSticky = false, className = "" }) => {
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
      <div className={`relative ${className}`} ref={isSticky ? floatingSearchRef : mainSearchRef}>
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
                      onClick={() => handleSongSelect(track)}
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

  return (
    <div className="min-h-screen bg-[#FFF8E1]">
      {/* Simple, clean header */}
      <header className="pt-6 pb-4 flex items-center justify-between h-auto px-4">
        <div className="text-lg font-bold font-instrument text-[#333]">
          ThisSongMeant
        </div>
        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: 'ThisSongMeant',
                text: "Check out ThisSongMeant - What's your favorite song mean to you?",
                url: window.location.href,
              })
            } else {
              alert('Sharing is not supported in this browser.')
            }
          }}
          className="border border-[#333] text-[#333] px-4 py-2 rounded-full font-sans"
        >
          Share
        </button>
      </header>

      <main className="pt-8 px-4 md:px-6 pb-4">
        <h1 className="text-center font-instrument text-4xl md:text-5xl text-[#333] mb-6 md:mb-8 font-bold tracking-tight">
          What's your favorite song mean to you?
        </h1>

        {/* Main search input */}
        <div className="max-w-xs mx-auto mb-8 md:mb-10">
          <SearchInput isSticky={false} />
        </div>

        {/* Floating add button */}
        {showStickySearch && (
          <>
            {!showFloatingSearch ? (
              <div className="fixed bottom-6 right-6 z-40">
                <Button
                  onClick={() => setShowFloatingSearch(true)}
                  className="h-14 w-14 rounded-full bg-[#333] text-white hover:bg-[#555] shadow-lg flex items-center justify-center font-sans"
                  aria-label="Add your song"
                >
                  <Plus className="h-6 w-6" />
                </Button>
              </div>
            ) : (
              <div className="fixed bottom-6 left-0 right-0 z-40 px-4" ref={floatingSearchRef}>
                <div className="mx-auto max-w-md bg-white rounded-full shadow-lg p-2">
                  <SearchInput isSticky={true} />
                </div>
              </div>
            )}
          </>
        )}

        {/* Success message */}
        {showSuccessMessage && (
          <div className="fixed top-4 right-4 z-50 rounded-md bg-green-100 p-4 shadow-md font-sans">
            <p className="text-green-800">Your story has been added to the wall!</p>
          </div>
        )}

        <div className="mx-auto max-w-6xl">
          <section className="mb-12">
            {isLoadingStories ? (
              <LoadingSkeleton />
            ) : (
              <>
                <div className="columns-1 gap-4 sm:gap-5 sm:columns-2 md:columns-3 lg:columns-4">
                  {stories.map((story) => (
                    <div key={story.id} className="mb-4 sm:mb-5 break-inside-avoid">
                      <MusicCard song={story} />
                    </div>
                  ))}
                </div>

                {/* Load more section */}
                {stories.length > 0 && (
                  <div className="mt-8 md:mt-12 text-center">
                    {hasMore ? (
                      <Button
                        onClick={handleLoadMore}
                        disabled={isLoadingMore}
                        variant="outline"
                        className="rounded-full border-[#333] px-4 py-1 text-[#333] hover:bg-[#333] hover:text-white h-9 text-sm font-sans"
                      >
                        {isLoadingMore ? (
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 animate-spin rounded-full border-2 border-[#333] border-t-transparent"></div>
                            <span>Loading...</span>
                          </div>
                        ) : (
                          "Load More Stories"
                        )}
                      </Button>
                    ) : (
                      <p className="text-[#666] font-sans">You've seen all the stories.</p>
                    )}
                  </div>
                )}

                {!isLoadingStories && stories.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500 font-sans">No stories yet. Be the first to share!</p>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </main>

      {/* Add Song Modal - now only shows the note form */}
      <AddSongModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedSong(null)
        }}
        searchResults={[]}
        selectedSong={selectedSong}
        onSongSelect={() => {}}
        onAddStory={handleAddStory}
      />

      {/* Simple footer */}
      <footer className="px-4 py-4 md:py-6 text-center text-sm text-[#666] font-sans">
        <div className="container mx-auto">
          <p>
            A CultureWare Product.
          </p>
        </div>
      </footer>
    </div>
  )
}
