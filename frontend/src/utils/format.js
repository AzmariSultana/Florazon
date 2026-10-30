import { CURRENCY } from '../constants'

const numberFormat = new Intl.NumberFormat('en-US')

// 3200 -> "৳3,200"
export const formatPrice = (amount) => `${CURRENCY}${numberFormat.format(Number(amount) || 0)}`

// Ask Cloudinary for an automatically chosen format (WebP/AVIF) and quality at the width the layout needs.
// Non-Cloudinary URLs are returned unchanged.
export const imageUrl = (url, width) => {
  if (!url || !url.includes('res.cloudinary.com') || !url.includes('/image/upload/')) return url
  return url.replace('/image/upload/', `/image/upload/f_auto,q_auto,c_limit,w_${width}/`)
}
