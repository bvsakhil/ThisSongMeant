import ProfileContent from '@/components/profile-content'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'

interface PageProps {
  params: {
    username: string
  }
}

export default async function UsernamePage({ params }: PageProps) {
  const supabase = createServerComponentClient({ cookies })
  
  // Check if username exists in the database
  const { data: userData, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', params.username)
    .single()

  // If username doesn't exist, return 404
  if (!userData || error) {
    notFound()
  }

  return <ProfileContent username={params.username} />
} 