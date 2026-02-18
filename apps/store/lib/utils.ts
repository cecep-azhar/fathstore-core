export const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000'

export function getMediaUrl(media: string | { url?: string } | null | undefined): string | null {
  if (!media) return null
  
  const url = typeof media === 'string' ? media : media.url
  if (!url) return null

  // If already absolute URL (e.g. cloud storage or external)
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }

  // If relative URL (local upload) -> prepend Payload URL
  // Remove duplicate slashes just in case
  const cleanUrl = url.startsWith('/') ? url : `/${url}`
  return `${PAYLOAD_URL}${cleanUrl}`
}
