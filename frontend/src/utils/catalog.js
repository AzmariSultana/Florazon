// Designs featured large in the home page's Signature Arrangements, by product name
export const SIGNATURE_NAMES = ['Crimson Lily & Rose Bouquet', 'Lily & Rose Hatbox']

// The most recently added designs, newest first. Signature designs are left out because the home page
// already features them, and other rows use this list to avoid repeating New Arrivals.
export const newestProducts = (products, count = 4) =>
  products
    .filter((item) => !SIGNATURE_NAMES.includes(item.name))
    .sort((a, b) => (b.date || 0) - (a.date || 0))
    .slice(0, count)
