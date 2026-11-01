// Store-wide settings shared by the storefront's pages and components

export const CURRENCY = '৳'

// Must match DELIVERY_FEE in backend/config/constants.js (the server is the source of truth for totals)
export const DELIVERY_FEE = 60

export const CATEGORIES = ['Occasion', 'Gift-Type']
export const SUB_CATEGORIES = ['Single-Flower', 'Bouquet', 'Garland', 'Basket']

// How each type is presented in the shop; the stored values above stay unchanged
export const TYPES = {
  'Single-Flower': { label: 'Single Flower', plural: 'Single Flowers', tagline: 'One variety, simply wrapped', note: 'Single stems and bouquets of one flower variety: all roses, all tulips, all lilies.' },
  Bouquet: { label: 'Mixed Bouquet', plural: 'Mixed Bouquets', tagline: 'Many blooms, hand-tied', note: 'Hand-tied arrangements that mix several flowers, for birthdays, anniversaries and every moment in between.' },
  Garland: { label: 'Garland', plural: 'Garlands', tagline: 'Wedding pairs, freshly strung', note: 'Fresh strung blooms in matching pairs, for weddings, ceremonies and welcomes.' },
  Basket: { label: 'Basket', plural: 'Baskets', tagline: 'Arranged and ready to display', note: 'Generous arrangements set in a keepsake basket, crate or box, ready to display.' },
}

export const typeLabel = (type) => TYPES[type]?.label || type?.replace('-', ' ')
export const categoryLabel = (category) => category?.replace('-', ' ')

export const STORE = {
  tagline: "From our garden's grace to your heart's embrace.",
  address: ['Merul Badda', 'Dhaka 1949, Bangladesh'],
  phone: '+880 1XXX-XXXXXX',
  // Set to 'tel:+880…' when a public number is ready; without it, phone links show as plain text
  phoneHref: null,
  email: 'azmari.sultana47@gmail.com',
}
