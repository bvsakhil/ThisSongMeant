import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export const signInWithGoogle = async () => {
  const supabase = createClientComponentClient()
  
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      throw error
    }
  } catch (error) {
    console.error('Error signing in with Google:', error)
  }
} 