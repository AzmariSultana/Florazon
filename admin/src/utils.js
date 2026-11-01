import { currency } from './config'

const numberFormat = new Intl.NumberFormat('en-US')

// 3200 -> "৳3,200"
export const formatPrice = (amount) => `${currency}${numberFormat.format(Number(amount) || 0)}`

// Smaller, modern-format thumbnails from Cloudinary; other URLs are returned unchanged
export const imageUrl = (url, width) => {
  if (!url || !url.includes('res.cloudinary.com') || !url.includes('/image/upload/')) return url
  return url.replace('/image/upload/', `/image/upload/f_auto,q_auto,c_limit,w_${width}/`)
}

// ISO date or YYYY-MM-DD -> "1 Nov 2026" (same format as the storefront); plain dates are read in local time
const dateFormat = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
export const formatDate = (value) => dateFormat.format(new Date(/^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00:00` : value))
