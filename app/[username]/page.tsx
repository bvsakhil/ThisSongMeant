import ProfileContent from '@/components/profile-content'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { Metadata, ResolvingMetadata } from 'next'

interface PageProps {
  params: {
    username: string
  }
}

export default async function UsernamePage({ params }: PageProps) {
  const supabase = createServerComponentClient({ cookies })
  const { username } = await params

  // Check if username exists in the database
  const { data: userData, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .single()

  // If username doesn't exist, return 404
  if (!userData || error) {
    notFound()
  }

  return <ProfileContent username={username} />
}

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const supabase = createServerComponentClient({ cookies })
  const { username } = await params

  // Fetch user data
  const { data: user } = await supabase
    .from('users')
    .select('username, full_name, email')
    .eq('username', username)
    .single()

  if (!user) {
    return {
      title: 'Profile Not Found | ThisSongMeant',
      description: 'This profile could not be found.',
    }
  }

  const { count } = await supabase
    .from('stories')
    .select('*', { count: 'exact', head: true })
    .eq('user_email', user.email)

  const title = `${username}'s Music Scrapbook`
  const description = `Collection of songs that mean something to me`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: `/api/og?username=${username}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`/api/og?username=${username}`],
    },
  }
} 