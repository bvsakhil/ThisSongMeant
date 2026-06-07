interface ShareStoryImageOptions {
  songId: string
  title: string
  artist: string
  openOnError?: boolean
}

export async function shareStoryImage({
  songId,
  title,
  artist,
  openOnError = true,
}: ShareStoryImageOptions) {
  const shareCardUrl = `/api/share-card/${songId}`
  const fileName = `thissongmeant-${songId}.png`

  try {
    const response = await fetch(shareCardUrl)
    if (!response.ok) {
      throw new Error('Failed to generate share card')
    }

    const blob = await response.blob()
    const file = new File([blob], fileName, { type: 'image/png' })

    if (
      navigator.canShare &&
      navigator.canShare({ files: [file] }) &&
      navigator.share
    ) {
      await navigator.share({
        title: `${title} by ${artist}`,
        text: `A story about ${title} on thissongmeant`,
        files: [file],
      })
      return
    }

    const objectUrl = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = objectUrl
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(objectUrl)
  } catch (error: any) {
    if (error?.name === 'AbortError') return

    if (openOnError) {
      window.open(shareCardUrl, '_blank', 'noopener,noreferrer')
    }

    throw error
  }
}
