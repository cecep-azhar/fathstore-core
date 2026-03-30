// Utility to build a full URL for Payload media files
const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000'

export function getMediaUrl(media: any): string | null {
  if (!media) return null
  if (typeof media === 'string') return media
  if (media.url) {
    // If it's already a full URL, return as-is
    if (media.url.startsWith('http')) return media.url
    // Otherwise prepend the Payload base URL
    return `${PAYLOAD_URL}${media.url}`
  }
  return null
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}
