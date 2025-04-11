'use client'

import { useEffect, useState, useRef } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { MusicCard } from '@/components/music-card'
import { LoadingSkeleton } from '@/components/loading-skeleton'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Share2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Avatar from 'boring-avatars'
import { SiteBanner } from '@/components/site-banner'
import { signInWithGoogle } from '@/lib/auth'
import { AddSongModal } from '@/components/add-song-modal'
import axios from 'axios'

interface ProfileContentProps {
  username: string
}

export default function ProfileContent({ username }: ProfileContentProps) {
  const [profileData, setProfileData] = useState<any>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [stories, setStories] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showShareMessage, setShowShareMessage] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [showStickySearch, setShowStickySearch] = useState(false)
  const [showFloatingSearch, setShowFloatingSearch] = useState(false)
  const [showSearchInput, setShowSearchInput] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedSong, setSelectedSong] = useState<any>(null)
  const mainSearchRef = useRef<HTMLDivElement>(null)
  const floatingSearchRef = useRef<HTMLDivElement>(null)
  const supabase = createClientComponentClient()
  const router = useRouter()

  // Handle scroll to show/hide floating button
  useEffect(() => {
    const handleScroll = () => {
      if (mainSearchRef.current) {
        const mainSearchPosition = mainSearchRef.current.getBoundingClientRect().top
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

  // Combined data fetching
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch current user, profile data, and stories in parallel
        const [
          { data: { user } },
          { data: userData, error: userError },
        ] = await Promise.all([
          supabase.auth.getUser(),
          supabase
            .from('users')
            .select('*')
            .eq('username', username)
            .single()
        ])

        if (userError) throw userError
        
        setCurrentUser(user)
        
        if (userData) {
          setProfileData(userData)
          // Fetch stories immediately after getting user data
          const { data: stories, error: storiesError } = await supabase
            .from('songs')
            .select(`
              *,
              likes:song_likes(count),
              user_likes:song_likes!inner(user_id)
            `)
            .eq('user_email', userData.email)
            .order('created_at', { ascending: false })

          if (storiesError) throw storiesError

          const transformedStories = stories?.map(story => ({
            ...story,
            likes: story.likes?.length || 0,
            user_likes: story.user_likes?.length > 0
          }))

          setStories(transformedStories || [])
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        router.push('/404')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [username])

  const handleShare = async () => {
    const url = window.location.href
    try {
      await navigator.clipboard.writeText(url)
      setShowShareMessage(true)
      setTimeout(() => setShowShareMessage(false), 3000)
    } catch (err) {
      console.error('Failed to copy URL:', err)
    }
  }

  const handleBannerClick = async () => {
    await signInWithGoogle()
  }

  const handleSongSelect = (song: any) => {
    setSelectedSong(song)
    setShowSearchInput(false)
    setShowFloatingSearch(false)
    setIsModalOpen(true)
  }

  const handleAddStory = async (newStory: any) => {
    try {
      const response = await axios.post('/api/songs', {
        ...newStory,
        userId: currentUser?.id,
        userEmail: currentUser?.email
      })

      if (response.status !== 200) {
        throw new Error('Failed to save song')
      }

      const savedSong = response.data
      setStories(prevStories => [savedSong, ...prevStories])
      setIsModalOpen(false)
      setSelectedSong(null)

      setShowSuccessMessage(true)
      setTimeout(() => {
        setShowSuccessMessage(false)
      }, 3000)

      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    } catch (error) {
      console.error('Error saving song:', error)
    }
  }

  // Search Input Component
  const SearchInput = ({ isSticky = false }) => {
    const [searchQuery, setSearchQuery] = useState("")
    const [searchResults, setSearchResults] = useState<any[]>([])
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
      <div className="relative" ref={isSticky ? floatingSearchRef : mainSearchRef}>
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
              />
              {isLoading && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#333] border-t-transparent" />
                </div>
              )}
            </div>

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFF8E1] flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#333] border-t-transparent"></div>
      </div>
    )
  }

  if (!profileData) {
    return null
  }

  const isOwnProfile = currentUser?.id === profileData.id

  return (
    <div className="min-h-screen bg-[#FFF8E1]">
      {/* Banner at the very top - only show if not logged in */}
      {!currentUser && (
        <div onClick={handleBannerClick} style={{ cursor: 'pointer' }}>
          <SiteBanner message="👉 Save songs to your profile. Build your music scrapbook. 👈" />
        </div>
      )}

      <div className="px-6 md:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.push('/')}
          className="fixed left-6 md:left-8 top-20 z-50 flex items-center justify-center rounded-full bg-white p-2 shadow-sm hover:bg-gray-50"
        >
          <ArrowLeft className="h-5 w-5 text-[#333]" />
        </button>

        <div className="mx-auto max-w-6xl pt-16 md:pt-20">
          {/* Profile Header */}
          <div className="mb-12 text-center">
            <div className="mx-auto mb-4 h-24 w-24 rounded-full overflow-hidden">
              <Avatar
                size={96}
                name={profileData.email || username}
                variant="beam"
                colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
              />
            </div>
            <div className="flex items-center justify-center gap-1 mb-2">
              <h1 className="font-instrument text-2xl font-bold text-[#333]">
                {profileData.username || username}
              </h1>
              <button
                onClick={handleShare}
                className="inline-flex items-center justify-center p-1.5 rounded-full hover:bg-black/5 transition-colors"
                aria-label="Share profile"
              >
                <Share2 className="h-4 w-4 text-[#333]" />
              </button>
            </div>
            <p className="text-[#666] mb-4">
              <strong>{stories.length}</strong> {stories.length === 1 ? "song i won't forget." : "songs i won't forget."}
            </p>

            {/* Add Song Button - Only show if it's the user's own profile */}
            {isOwnProfile && (
              <div className="max-w-xs mx-auto mb-8">
                <SearchInput isSticky={false} />
              </div>
            )}
          </div>

          {/* Stories Grid */}
          <section>
            <div className="columns-1 gap-4 sm:gap-5 sm:columns-2 md:columns-3 lg:columns-4">
              {stories.map((story) => (
                <div key={story.id} className="mb-4 sm:mb-5 break-inside-avoid">
                  <MusicCard song={story} />
                </div>
              ))}
            </div>

            {stories.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 font-sans">No stories yet.</p>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Floating add button - Only show if it's the user's own profile */}
      {isOwnProfile && showStickySearch && (
        <>
          {!showFloatingSearch ? (
            <div className="fixed bottom-6 right-6 z-40">
              <Button
                onClick={() => setShowFloatingSearch(true)}
                className="h-14 w-14 rounded-full bg-[#333] text-white hover:bg-[#555] shadow-lg flex items-center justify-center"
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

      {/* Share success message */}
      {showShareMessage && (
        <div className="fixed top-4 right-4 z-50 rounded-md bg-green-100 p-4 shadow-md font-sans">
          <p className="text-green-800">Profile URL copied to clipboard!</p>
        </div>
      )}

      {/* Success message */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50 rounded-md bg-green-100 p-4 shadow-md font-sans">
          <p className="text-green-800">Your story has been added to your collection!</p>
        </div>
      )}

      {/* Add Song Modal */}
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
    </div>
  )
} 