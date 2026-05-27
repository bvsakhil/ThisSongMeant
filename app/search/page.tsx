"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MusicCard } from "@/components/music-card"
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

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeQuery, setActiveQuery] = useState("")
  const [stories, setStories] = useState<Song[]>([])
  const [totalStories, setTotalStories] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const searchInputRef = useRef<HTMLInputElement>(null)

  const fetchStories = async (query: string, page: number, append = false, signal?: AbortSignal) => {
    const loadingState = append ? setIsLoadingMore : setIsLoading

    try {
      loadingState(true)
      setErrorMessage("")

      const params = new URLSearchParams({
        userId: getUserId(),
        page: String(page),
      })

      if (query.trim()) {
        params.set("q", query.trim())
      }

      const response = await fetch(`/api/songs?${params.toString()}`, { signal })
      if (!response.ok) {
        throw new Error("Failed to fetch stories")
      }

      const data = await response.json()

      setStories((prevStories) => append ? [...prevStories, ...data.songs] : data.songs)
      setTotalStories(data.total || 0)
      setHasMore(Boolean(data.hasMore))
      setCurrentPage(page)
      setActiveQuery(query.trim())
    } catch (error) {
      if ((error as Error).name === "AbortError") return

      console.error("Error fetching stories:", error)
      setErrorMessage("Could not load stories right now. Please try again.")
      if (!append) {
        setStories([])
        setTotalStories(0)
        setHasMore(false)
      }
    } finally {
      loadingState(false)
    }
  }

  useEffect(() => {
    const controller = new AbortController()
    const timer = setTimeout(() => {
      fetchStories(searchQuery, 1, false, controller.signal)
    }, 400)

    return () => {
      controller.abort()
      clearTimeout(timer)
    }
  }, [searchQuery])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    searchInputRef.current?.blur()
    fetchStories(searchQuery, 1)
  }

  const handleLoadMore = () => {
    if (isLoadingMore || !hasMore) return

    fetchStories(activeQuery, currentPage + 1, true)
  }

  const resultLabel = activeQuery
    ? `${totalStories} ${totalStories === 1 ? "story" : "stories"} for "${activeQuery}"`
    : `${totalStories} recent ${totalStories === 1 ? "story" : "stories"}`

  return (
    <div className="min-h-screen bg-[#FFF8E1]">
      <header className="px-6 py-6 md:px-8">
        <div className="mx-auto flex max-w-6xl items-center gap-4">
          <Link
            href="/"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#333] shadow-sm transition-colors hover:bg-black/5"
            aria-label="Back to home"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </div>
      </header>

      <main className="px-6 pb-12 md:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-instrument text-4xl font-bold tracking-tight text-[#333] md:text-5xl">
            Explore stories by song or artist
          </h1>

          <form onSubmit={handleSubmit} className="mx-auto mt-8 max-w-xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#777]" />
              <Input
                ref={searchInputRef}
                type="search"
                placeholder="Search a song or artist..."
                className="h-14 w-full rounded-full border-[#333] bg-white pl-12 pr-4 text-base text-[#333] shadow-sm placeholder:text-[#999]"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                aria-label="Search stories by song or artist"
              />
            </div>
          </form>
        </div>

        <section className="mx-auto mt-10 max-w-6xl">
          <div className="mb-5 flex min-h-6 items-center justify-between gap-4">
            <p className="font-sans text-sm text-[#666]">{resultLabel}</p>
            {searchQuery && (
              <Button
                type="button"
                variant="ghost"
                className="h-8 px-3 text-sm text-[#555] hover:bg-black/5"
                onClick={() => {
                  setSearchQuery("")
                  searchInputRef.current?.focus()
                }}
              >
                Clear
              </Button>
            )}
          </div>

          {errorMessage && (
            <div className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 font-sans text-sm text-red-700">
              {errorMessage}
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#333] border-t-transparent" />
            </div>
          ) : stories.length > 0 ? (
            <>
              <div className="columns-1 gap-4 sm:gap-5 sm:columns-2 md:columns-3 lg:columns-4">
                {stories.map((story) => (
                  <div key={story.id} className="mb-4 break-inside-avoid sm:mb-5">
                    <MusicCard song={story} />
                  </div>
                ))}
              </div>

              {hasMore && (
                <div className="mt-8 flex justify-center">
                  <Button
                    type="button"
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                    className="h-11 rounded-full bg-[#333] px-6 text-white hover:bg-[#555]"
                  >
                    {isLoadingMore ? "Loading..." : "Load more"}
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="rounded-md border border-dashed border-[#d8cfa9] bg-white/60 px-6 py-12 text-center">
              <p className="font-instrument text-xl font-bold text-[#333]">No stories found</p>
              <p className="mt-2 font-sans text-sm text-[#666]">
                Try another song title or artist.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
