import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { User } from '@supabase/supabase-js'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Avatar from 'boring-avatars'

interface ProfileDropdownProps {
  user: User
}

export function ProfileDropdown({ user }: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [username, setUsername] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchUsername = async () => {
      setIsLoading(true)
      try {
        const { data: userData } = await supabase
          .from('users')
          .select('username')
          .eq('id', user.id)
          .single()
        
        if (userData?.username) {
          setUsername(userData.username)
        }
      } catch (error) {
        console.error('Error fetching username:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (user?.id) {
      fetchUsername()
    }
  }, [user.id])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 rounded-full shadow-sm"
      >
        <div className="h-8 w-8 rounded-full overflow-hidden">
          <Avatar
            size={32}
            name={user.email || 'Anonymous'}
            variant="beam"
            colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
          />
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
          <button
            onClick={() => {
              if (username && !isLoading) {
                router.push(`/${username}`)
                setIsOpen(false)
              }
            }}
            className={`block w-full px-4 py-2 text-left text-sm ${
              isLoading ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'
            }`}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Profile'}
          </button>
          <button
            onClick={handleLogout}
            className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  )
} 