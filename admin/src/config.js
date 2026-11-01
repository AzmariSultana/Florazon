export const backendUrl = import.meta.env.VITE_BACKEND_URL
export const currency = '৳'

export const CATEGORIES = ['Occasion', 'Gift-Type']
export const SUB_CATEGORIES = ['Single-Flower', 'Bouquet', 'Garland', 'Basket']
// Purchase options: a product is sold as single stems or as a bouquet in sizes.
// Must match the labels in backend/config/productOptions.js
export const STEM_OPTIONS = ['1 Stem', '3 Stems', '6 Stems']
export const TIER_OPTIONS = ['Standard', 'Deluxe', 'Premium']
export const SOLD_AS = { bouquet: { label: 'Bouquet', options: TIER_OPTIONS }, stems: { label: 'Single stems', options: STEM_OPTIONS } }

// Must match ORDER_STATUSES in backend/config/constants.js
export const ORDER_STATUSES = ['Order Placed', 'Packing', 'Shipped', 'Out for delivery', 'Delivered']
