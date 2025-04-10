'use client'

import { useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

export default function ProfileRedirect() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const redirectToUserProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // Get the username from the users table
        const { data: userData } = await supabase
          .from('users')
          .select('username')
          .eq('id', user.id)
          .single()

        if (userData?.username) {
          router.push(`/${userData.username}`)
        } else {
          // If for some reason username is not found, redirect to home
          router.push('/')
        }
      } else {
        // If not logged in, redirect to home
        router.push('/')
      }
    }

    redirectToUserProfile()
  }, [])

  // Return null instead of loading skeleton for cleaner transition
  return null
} 