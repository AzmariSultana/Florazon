// Ratings and reviews for products.
//
// Every review has the shape { id, name, rating (1-5), date (ISO string), text }.
// Today the reviews are SAMPLE data, generated per product so each flower gets a believable,
// stable set. To use real reviews later, replace getProductReviews (for example with a fetch to
// /api/review/:productId) and set IS_SAMPLE_DATA to false; the components only use the shape above.

export const IS_SAMPLE_DATA = true

const NAMES = [
  'Nusrat J.', 'Tanvir A.', 'Farzana R.', 'Arif H.', 'Sadia K.', 'Rafiq M.', 'Mehjabin S.', 'Imran C.',
  'Tasnim B.', 'Shuvo D.', 'Ayesha N.', 'Kamrul I.', 'Lamia F.', 'Rakib T.', 'Priyanka S.', 'Jahid P.',
]

// Short, specific comments for each kind of product, grouped by star rating
const COMMENTS = {
  bouquet: {
    5: [
      'Even fuller than the photo. Every bloom was fresh and it lasted well over a week.',
      'Ordered for our anniversary and my wife loved it. Beautifully wrapped, arrived right on time.',
      'The colours were stunning in person. You can tell it was arranged by hand.',
      'Perfect birthday surprise. The florist even called to confirm the delivery time.',
      'So fresh it still smelled lovely days later. Will definitely order again.',
    ],
    4: [
      'Lovely bouquet and very fresh. Delivery was a little later than I hoped, but worth it.',
      'Beautiful arrangement, slightly smaller than I imagined, but the quality is excellent.',
      'Really pretty and neatly wrapped. I would choose the Deluxe size next time.',
    ],
    3: ['Nice flowers, though one stem had wilted a bit by the next day. Support replaced it quickly.'],
  },
  stems: {
    5: [
      'Simple and elegant. A single perfect bloom, wrapped beautifully.',
      'Bought this as a small thank you and it made her day. Very fresh.',
      'Exactly as pictured and lasted much longer than shop flowers usually do.',
      'A small gesture that felt really special. The wrapping was neat and elegant.',
      'Fresh, bright and perfectly wrapped. Great for a last-minute gift.',
    ],
    4: [
      'Lovely stem and neat wrapping. Very happy overall.',
      'Beautiful flower, delivered a little later in the day than expected.',
    ],
    3: ['Pretty, though the stem was shorter than expected. Still a sweet gift.'],
  },
  garland: {
    5: [
      'The garlands were the highlight of our wedding photos. Fresh, fragrant and perfectly made.',
      'Delivered on the morning of the ceremony as promised. Absolutely beautiful pair.',
      'The jasmine smell filled the whole room. Our families kept asking where we ordered them.',
      'Both garlands matched perfectly and looked even better in person.',
      'Ordered for my sister’s engagement. Fresh, neat and on time. Highly recommend.',
    ],
    4: [
      'Gorgeous garlands and very fresh. A little heavier than expected but held up all evening.',
      'Beautiful work. I would have liked them a day earlier, but they arrived as scheduled.',
    ],
    3: ['Nice work overall, though a few blooms on one garland were looser than the other.'],
  },
  basket: {
    5: [
      'The arrangement looked amazing on our dining table. It stayed fresh for days.',
      'Sent this to my mother for Mother’s Day. She said it was the most beautiful gift she got.',
      'Generous and so well put together. The box is lovely enough to keep.',
      'Ordered for a new office opening. Everyone admired it, and delivery was spot on.',
    ],
    4: [
      'Very pretty and full. Just a little smaller than the photo, but the quality is great.',
      'Lovely arrangement, and the delivery person was very careful with it.',
    ],
    3: ['Good arrangement, though a couple of blooms were not fully open yet. They opened after a day.'],
  },
}

// Small seeded random generator, so a product always gets the same sample reviews
const seedFrom = (text) => [...String(text)].reduce((h, c) => (Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0), 2166136261)
const random = (seed) => () => {
  let t = (seed += 0x6d2b79f5)
  t = Math.imul(t ^ (t >>> 15), t | 1)
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

const commentGroup = (product) => {
  if (product.subCategory === 'Garland') return COMMENTS.garland
  if (product.subCategory === 'Basket') return COMMENTS.basket
  if ((product.sizes || []).some((s) => /Stem|One size/.test(s))) return COMMENTS.stems
  return COMMENTS.bouquet
}

const sampleReviews = (product) => {
  const rand = random(seedFrom(product._id || product.name))
  const group = commentGroup(product)
  const total = Object.values(group).reduce((n, list) => n + list.length, 0)
  const count = Math.min(total, 5 + Math.floor(rand() * 5)) // 5 to 9 reviews, each comment used once
  const used = new Set()
  const reviews = []
  for (let i = 0; i < count; i++) {
    const roll = rand()
    let rating = roll < 0.68 ? 5 : roll < 0.93 ? 4 : 3
    let options = group[rating].filter((t) => !used.has(t))
    if (options.length === 0) {
      rating = [5, 4, 3].find((r) => group[r].some((t) => !used.has(t)))
      options = group[rating].filter((t) => !used.has(t))
    }
    const text = options[Math.floor(rand() * options.length)]
    used.add(text)
    const name = NAMES[Math.floor(rand() * NAMES.length)]
    const daysAgo = 3 + Math.floor(rand() * 150)
    const date = new Date(Date.now() - daysAgo * 86400000)
    date.setHours(12, 0, 0, 0)
    reviews.push({ id: `${product._id || product.name}-${i}`, name, rating, date: date.toISOString(), text })
  }
  return reviews.sort((a, b) => new Date(b.date) - new Date(a.date))
}

const cache = new Map()

// All reviews for a product, newest first
export const getProductReviews = (product) => {
  if (!product) return []
  const key = product._id || product.name
  if (!cache.has(key)) cache.set(key, sampleReviews(product))
  return cache.get(key)
}

// Average, count and how many reviews gave each star rating
export const summarizeReviews = (reviews) => {
  const count = reviews.length
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  reviews.forEach((r) => { distribution[r.rating] += 1 })
  const average = count ? reviews.reduce((sum, r) => sum + r.rating, 0) / count : 0
  return { average: Math.round(average * 10) / 10, count, distribution }
}

export const getProductRating = (product) => summarizeReviews(getProductReviews(product))
