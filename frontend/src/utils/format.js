import { CURRENCY } from '../constants'

const numberFormat = new Intl.NumberFormat('en-US')

// 3200 -> "৳3,200"
export const formatPrice = (amount) => `${CURRENCY}${numberFormat.format(Number(amount) || 0)}`

// ISO date or YYYY-MM-DD -> "1 Nov 2026"; plain dates are read in local time so they don't shift a day
const dateFormat = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
export const formatDate = (value) => dateFormat.format(new Date(/^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00:00` : value))

// Ask Cloudinary for an automatically chosen format (WebP/AVIF) and quality at the width the layout needs.
// Non-Cloudinary URLs are returned unchanged.
export const imageUrl = (url, width) => {
  if (!url || !url.includes('res.cloudinary.com') || !url.includes('/image/upload/')) return url
  return url.replace('/image/upload/', `/image/upload/f_auto,q_auto,c_limit,w_${width}/`)
}
