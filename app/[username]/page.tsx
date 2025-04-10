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

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const supabase = createServerComponentClient({ cookies })
  
  // Fetch user data
  const { data: userData } = await supabase
    .from('users')
    .select('username, full_name, email')
    .eq('username', params.username)
    .single()

  // Get songs count
  const { count } = await supabase
    .from('songs')
    .select('*', { count: 'exact', head: true })
    .eq('user_email', userData?.email)

  // Fallback values if user not found
  if (!userData) {
    return {
      title: 'Profile Not Found',
      description: 'This profile could not be found'
    }
  }

  const name = userData.full_name || userData.username
  const songCount = count || 0
  
  // Use absolute URL for production, localhost for development
  const baseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000'
  
  const ogImageUrl = new URL('/api/og', baseUrl)
  ogImageUrl.searchParams.set('username', params.username)
  ogImageUrl.searchParams.set('songCount', songCount.toString())

  return {
    title: `${params.username}'s Music Scrapbook`,
    description: `Collection of songs that meant something to me`,
    metadataBase: new URL(baseUrl),
    openGraph: {
      title: `${params.username}'s Music Scrapbook`,
      description: `Collection of songs that meant something to me`,
      url: `/${params.username}`,
      siteName: 'ThisSongMeant',
      images: [{
        url: ogImageUrl.pathname + ogImageUrl.search,
        width: 1200,
        height: 630,
        alt: `${params.username}'s Music Scrapbook`
      }],
      locale: 'en_US',
      type: 'profile',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${params.username}'s Music Scrapbook`,
      description: `Collection of songs that meant something to me`,
      images: [ogImageUrl.pathname + ogImageUrl.search],
      creator: '@thissongmeant',
    },
  }
} 