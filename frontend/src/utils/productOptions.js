// Purchase options, and how each one prices against the product's base price.
// Must match backend/config/productOptions.js (the server recalculates every order total).
//
// A product is sold either as single stems (choose how many) or as a bouquet (choose a size).
// Which one is decided by the option labels stored in its `sizes` field, not by its category,
// because Single Flower also holds bouquets made from one flower variety.
// Older products stored "One size" (single stems) or S/M/L (bouquets) and offer the whole set.
// Any unknown option (e.g. an old cart entry) resolves to the base option, so it keeps the price
// the customer originally saw.

export const STEM_OPTIONS = [
  { label: '1 Stem', detail: 'Simply wrapped', multiplier: 1 },
  { label: '3 Stems', detail: 'A small hand-tied trio', multiplier: 2.8 },
  { label: '6 Stems', detail: 'A full, generous bunch', multiplier: 5.4 },
]

export const TIER_OPTIONS = [
  { label: 'Standard', detail: 'As pictured', multiplier: 1 },
  { label: 'Deluxe', detail: 'Fuller, with more blooms', multiplier: 1.4 },
  { label: 'Premium', detail: 'Grand and generously filled', multiplier: 1.8 },
]

export const OPTION_SETS = [STEM_OPTIONS, TIER_OPTIONS]

const hasLabel = (set, label) => set.some((option) => option.label === label)

// Stem options for products stored with stem labels (or the old "One size"); bouquet sizes otherwise
export const optionSetFor = (product) => {
  const stored = product.sizes || []
  return stored.includes('One size') || stored.some((label) => hasLabel(STEM_OPTIONS, label)) ? STEM_OPTIONS : TIER_OPTIONS
}

export const isSoldByStem = (product) => optionSetFor(product) === STEM_OPTIONS

// Options a product offers, in display order
export const getProductOptions = (product) => {
  const all = optionSetFor(product)
  const offered = all.filter((option) => (product.sizes || []).includes(option.label))
  return offered.length > 0 ? offered : all
}

// The offered option matching a label, or the product's base option
export const resolveOption = (product, label) => {
  const options = getProductOptions(product)
  return options.find((option) => option.label === label) || options[0]
}

// Unit price for an option, rounded to the nearest 10 taka
export const optionPrice = (product, label) => Math.round((product.price * resolveOption(product, label).multiplier) / 10) * 10
