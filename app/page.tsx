"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MusicCard } from "@/components/music-card"
import { AddSongModal } from "@/components/add-song-modal"
import { useMobile } from "@/hooks/use-mobile"

// Mock song search API - in a real app, this would be an actual API call
const searchSongs = (query: string) => {
  // Sample data - would be replaced with actual API results
  const mockResults = [
    {
      id: "101",
      title: "Bohemian Rhapsody",
      artist: "Queen",
      album: "A Night at the Opera",
      year: "1975",
      albumCover: "/placeholder.svg?height=200&width=200&text=Queen",
    },
    {
      id: "102",
      title: "Imagine",
      artist: "John Lennon",
      album: "Imagine",
      year: "1971",
      albumCover: "/placeholder.svg?height=200&width=200&text=Lennon",
    },
    {
      id: "103",
      title: "Hotel California",
      artist: "Eagles",
      album: "Hotel California",
      year: "1976",
      albumCover: "/placeholder.svg?height=200&width=200&text=Eagles",
    },
    {
      id: "104",
      title: "Stairway to Heaven",
      artist: "Led Zeppelin",
      album: "Led Zeppelin IV",
      year: "1971",
      albumCover: "/placeholder.svg?height=200&width=200&text=Zeppelin",
    },
    {
      id: "105",
      title: "Sweet Child O' Mine",
      artist: "Guns N' Roses",
      album: "Appetite for Destruction",
      year: "1987",
      albumCover: "/placeholder.svg?height=200&width=200&text=GNR",
    },
  ]

  // Filter results based on query
  if (!query.trim()) return []

  return mockResults.filter(
    (song) =>
      song.title.toLowerCase().includes(query.toLowerCase()) || song.artist.toLowerCase().includes(query.toLowerCase()),
  )
}

// Sample data for music stories with varying content lengths
const initialStories = [
  {
    id: "1",
    title: "Bohemian Rhapsody",
    artist: "Queen",
    albumCover: "/placeholder.svg?height=200&width=200&text=Queen",
    note: "This song got me through the toughest times of my life. Every time I hear it, I'm reminded that I can face anything. The operatic section still gives me chills after all these years.",
    username: "VinylLover42",
    likes: 24,
    color: "pink",
  },
  {
    id: "2",
    title: "Imagine",
    artist: "John Lennon",
    albumCover: "/placeholder.svg?height=200&width=200&text=Lennon",
    note: "A beautiful reminder of what the world could be if we all just tried a little harder to understand each other.",
    username: "PeaceDreamer",
    likes: 18,
    color: "blue",
  },
  {
    id: "3",
    title: "Hotel California",
    artist: "Eagles",
    albumCover: "/placeholder.svg?height=200&width=200&text=Eagles",
    note: "This song always makes me think of road trips with friends in college. The guitar solo is pure magic.",
    username: "RoadTripper",
    likes: 15,
    color: "green",
  },
  {
    id: "4",
    title: "Stairway to Heaven",
    artist: "Led Zeppelin",
    albumCover: "/placeholder.svg?height=200&width=200&text=Zeppelin",
    note: "My dad introduced me to this song when I was 12. It was the first time I really understood what music could be. We would sit in his car in the driveway just to finish listening to it before going inside.",
    username: "ClassicRocker",
    likes: 32,
    color: "yellow",
  },
  {
    id: "5",
    title: "Smells Like Teen Spirit",
    artist: "Nirvana",
    albumCover: "/placeholder.svg?height=200&width=200&text=Nirvana",
    note: "This defined an entire generation. I still get chills when I hear those opening chords.",
    username: "90sKid",
    likes: 27,
    color: "orange",
  },
  {
    id: "6",
    title: "Billie Jean",
    artist: "Michael Jackson",
    albumCover: "/placeholder.svg?height=200&width=200&text=MJ",
    note: "I learned the entire dance routine when I was a teenager. Still my go-to karaoke song. Nobody can resist dancing when this comes on!",
    username: "MoonwalkerFan",
    likes: 21,
    color: "teal",
  },
  {
    id: "7",
    title: "Purple Haze",
    artist: "Jimi Hendrix",
    albumCover: "/placeholder.svg?height=200&width=200&text=Hendrix",
    note: "The first time I heard this guitar work, I knew I wanted to learn to play. Changed my life forever. Hendrix was so ahead of his time.",
    username: "GuitarHero",
    likes: 19,
    color: "purple",
  },
  {
    id: "8",
    title: "Like a Rolling Stone",
    artist: "Bob Dylan",
    albumCover: "/placeholder.svg?height=200&width=200&text=Dylan",
    note: "Dylan's poetry and raw emotion in this song taught me that music can be literature.",
    username: "PoetryFan",
    likes: 23,
    color: "indigo",
  },
  {
    id: "9",
    title: "Yesterday",
    artist: "The Beatles",
    albumCover: "/placeholder.svg?height=200&width=200&text=Beatles",
    note: "This was playing when I met my wife. We danced to it at our wedding 20 years later. Every time I hear it, I'm transported back to that moment when our eyes first met.",
    username: "EternalRomantic",
    likes: 35,
    color: "red",
  },
]

// Additional stories to load when clicking "Load More"
const additionalStories = [
  {
    id: "10",
    title: "Superstition",
    artist: "Stevie Wonder",
    albumCover: "/placeholder.svg?height=200&width=200&text=Stevie",
    note: "That opening riff is one of the funkiest things ever recorded. I can't help but dance whenever I hear it. Stevie's genius is unmatched.",
    username: "FunkMaster",
    likes: 29,
    color: "green",
  },
  {
    id: "11",
    title: "Jolene",
    artist: "Dolly Parton",
    albumCover: "/placeholder.svg?height=200&width=200&text=Dolly",
    note: "The raw emotion in Dolly's voice tells such a powerful story of jealousy and insecurity. I've never heard a more heartfelt plea in music.",
    username: "CountryHeart",
    likes: 31,
    color: "pink",
  },
  {
    id: "12",
    title: "Redemption Song",
    artist: "Bob Marley",
    albumCover: "/placeholder.svg?height=200&width=200&text=Marley",
    note: "Emancipate yourselves from mental slavery, none but ourselves can free our minds. Words to live by.",
    username: "FreedomFighter",
    likes: 42,
    color: "yellow",
  },
]

export default function Home() {
  const [stories, setStories] = useState(initialStories)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedSong, setSelectedSong] = useState<any>(null)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const isMobile = useMobile()

  // Handle clicks outside the search dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Live search effect
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        const results = searchSongs(searchQuery)
        setSearchResults(results)
        setShowDropdown(results.length > 0)
      } else {
        setSearchResults([])
        setShowDropdown(false)
      }
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [searchQuery])

  const handleLoadMore = () => {
    setIsLoading(true)
    // Simulate loading delay
    setTimeout(() => {
      setStories([...stories, ...additionalStories])
      setIsLoading(false)
      setHasMore(false) // For demo purposes, we only have one set of additional stories
    }, 800)
  }

  const handleSongSelect = (song: any) => {
    setSelectedSong(song)
    setSearchQuery("")
    setShowDropdown(false)
    setIsModalOpen(true)
  }

  const handleAddStory = (newStory: any) => {
    // Add the new story to the beginning of the stories array
    setStories([newStory, ...stories])
    setIsModalOpen(false)
    setSelectedSong(null)

    // Show success message
    setShowSuccessMessage(true)
    setTimeout(() => {
      setShowSuccessMessage(false)
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-[#FFF8E1]">
      {/* Simple, clean header */}
      <header className="py-4 md:py-6 text-center">
        <h1 className="font-instrument text-lg font-bold tracking-widest text-[#333] inline-block border-b border-[#333] pb-1">
          ThisSongMeant
        </h1>
      </header>

      <main className="px-4 md:px-6 pb-4">
        <h2 className="text-center font-instrument text-3xl md:text-5xl text-[#333] mb-6 md:mb-8 font-bold tracking-tight pt-4 md:pt-8">
          What's your favorite song mean to you?
        </h2>

        {/* Search input with live dropdown */}
        <div className="max-w-xs mx-auto mb-8 md:mb-10">
          <div className="relative" ref={searchRef}>
            <Input
              type="search"
              placeholder="Search a song to add..."
              className="border-[#333] pr-10 w-full h-12 text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
            />

            {/* Search results dropdown */}
            {showDropdown && (
              <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
                <div className="max-h-60 overflow-auto py-1">
                  {searchResults.map((song) => (
                    <div
                      key={song.id}
                      className="flex cursor-pointer items-center gap-3 px-4 py-3 hover:bg-gray-100"
                      onClick={() => handleSongSelect(song)}
                    >
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-sm bg-gray-100">
                        <img
                          src="https://i1.sndcdn.com/artworks-000116795481-6fmihq-t500x500.jpg"
                          alt={`${song.title} album cover`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{song.title}</div>
                        <div className="text-sm text-gray-600">{song.artist}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Success message */}
        {showSuccessMessage && (
          <div className="fixed top-4 right-4 z-50 rounded-md bg-green-100 p-4 shadow-md">
            <p className="text-green-800">Your story has been added to the wall!</p>
          </div>
        )}

        <div className="mx-auto max-w-6xl">
          {/* Masonry grid of cards using CSS columns */}
          <section className="mb-12">
            <div className="columns-1 gap-4 sm:gap-5 sm:columns-2 md:columns-3 lg:columns-4">
              {stories.map((story) => (
                <div key={story.id} className="mb-4 sm:mb-5 break-inside-avoid">
                  <MusicCard song={story} />
                </div>
              ))}
            </div>

            {/* Load more button */}
            <div className="mt-8 md:mt-12 text-center">
              {hasMore ? (
                <Button
                  onClick={handleLoadMore}
                  disabled={isLoading}
                  variant="outline"
                  className="rounded-none border-[#333] px-6 md:px-8 py-2 text-[#333] hover:bg-[#333] hover:text-white h-12 text-base"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#333] border-t-transparent"></div>
                      <span>Loading...</span>
                    </div>
                  ) : (
                    "Load More Stories"
                  )}
                </Button>
              ) : (
                <p className="text-[#666]">You've seen all the stories.</p>
              )}
            </div>
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
      <footer className="px-4 py-4 md:py-6 text-center text-sm text-[#666]">
        <div className="container mx-auto">
          <p>
            Built by{" "}
            <a
              href="https://x.com/akhil_bvs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#333] hover:underline"
            >
              Akhil
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}

