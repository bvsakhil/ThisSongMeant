'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface UsernameClaim {
  isOpen: boolean
  onComplete: () => void
  user: any // Current user data
}

export function UsernameClaimModal({ isOpen, onComplete, user }: UsernameClaim) {
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClientComponentClient()

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Basic validation
    if (!username.trim()) {
      setError('Username is required')
      setIsLoading(false)
      return
    }

    // Username format validation
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
      setError('Username must be 3-20 characters and can only contain letters, numbers, and underscores')
      setIsLoading(false)
      return
    }

    try {
      // Check if username is taken
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('username')
        .eq('username', username.toLowerCase())
        .single()

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        throw checkError
      }

      if (existingUser) {
        setError('This username is already taken')
        setIsLoading(false)
        return
      }

      // Create or update user record with chosen username
      const { error: updateError } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          email: user.email,
          username: username.toLowerCase(),
          full_name: user.user_metadata.full_name
        })

      if (updateError) throw updateError

      onComplete()
    } catch (error) {
      console.error('Error claiming username:', error)
      setError('Failed to claim username. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-bold text-gray-900">Choose Your Username</h2>
        <p className="mb-6 text-sm text-gray-600">
          This will be your unique profile URL and how others find you.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="mb-2">
              <label htmlFor="username" className="text-sm text-gray-600">
                Your profile will be at:
              </label>
              <div className="mt-1 flex items-center rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-500">
                <div className="flex items-center text-sm text-gray-500">
                  <span>thissongmeant.com/</span>
                  <input
                    id="username"
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value)
                      setError('')
                    }}
                    className="h-12 text-base"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>
            
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="submit"
              className="w-full bg-[#333] text-white hover:bg-[#555]"
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Profile'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
} 