import React, { useMemo, useState } from 'react'
import StarRating from './StarRating'
import { IS_SAMPLE_DATA, getProductReviews, summarizeReviews } from '../utils/reviews'

const INITIAL_VISIBLE = 4
const SORTS = [
  { value: 'recent', label: 'Most recent' },
  { value: 'high', label: 'Highest rated' },
  { value: 'low', label: 'Lowest rated' },
]

// Soft avatar colours, picked from the reviewer's name so each person keeps the same one
const AVATAR_COLOURS = ['bg-blush text-brand-dark', 'bg-sage-soft text-sage', 'bg-brand-soft text-brand', 'bg-cream text-ink border border-line']
const avatarColour = (name) => AVATAR_COLOURS[[...name].reduce((sum, c) => sum + c.charCodeAt(0), 0) % AVATAR_COLOURS.length]
const initials = (name) => name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()
const formatDate = (iso) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

const ReviewCard = ({ review }) => (
  <li className='rounded-2xl border border-line/80 bg-white/60 p-5 sm:p-6 animate-fade-up'>
    <div className='flex items-start gap-3.5'>
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-medium ${avatarColour(review.name)}`} aria-hidden='true'>{initials(review.name)}</span>
      <div className='min-w-0 flex-1'>
        <div className='flex flex-wrap items-center justify-between gap-x-3 gap-y-1'>
          <p className='text-sm font-medium text-ink'>{review.name}</p>
          <time dateTime={review.date} className='text-xs text-gray-500'>{formatDate(review.date)}</time>
        </div>
        <StarRating rating={review.rating} size='h-3.5 w-3.5' className='mt-1' />
      </div>
    </div>
    <p className='mt-3.5 text-sm leading-relaxed text-gray-600'>{review.text}</p>
  </li>
)

// Overall rating, distribution and review list for one product
const ReviewsSection = ({ product }) => {
  const reviews = useMemo(() => getProductReviews(product), [product])
  const { average, count, distribution } = useMemo(() => summarizeReviews(reviews), [reviews])
  const [sort, setSort] = useState('recent')
  const [showAll, setShowAll] = useState(false)

  const sorted = useMemo(() => {
    const list = [...reviews]
    if (sort === 'high') list.sort((a, b) => b.rating - a.rating || new Date(b.date) - new Date(a.date))
    if (sort === 'low') list.sort((a, b) => a.rating - b.rating || new Date(b.date) - new Date(a.date))
    return list
  }, [reviews, sort])
  const visible = showAll ? sorted : sorted.slice(0, INITIAL_VISIBLE)

  if (count === 0) return null

  return (
    <section id='reviews' aria-labelledby='reviews-heading' className='mt-20 scroll-mt-28'>
      <div className='grid gap-8 lg:grid-cols-[minmax(0,300px)_minmax(0,1fr)] lg:gap-14'>
        {/* Summary */}
        <div className='lg:sticky lg:top-24 lg:self-start'>
          <p className='eyebrow'>Ratings &amp; reviews</p>
          <h2 id='reviews-heading' className='mt-3 font-display text-3xl text-ink'>What customers <span className='text-brand'>say</span></h2>
          <div className='mt-6 flex items-end gap-4'>
            <p className='font-display text-6xl leading-none text-ink'>{average.toFixed(1)}</p>
            <div className='pb-1'>
              <StarRating rating={average} size='h-5 w-5' />
              <p className='mt-1 text-sm text-gray-500'>{count} {count === 1 ? 'review' : 'reviews'}</p>
            </div>
          </div>
          <ul className='mt-6 flex flex-col gap-2' aria-label='Rating distribution'>
            {[5, 4, 3, 2, 1].map((star) => {
              const share = count ? distribution[star] / count : 0
              return (
                <li key={star} className='flex items-center gap-3 text-xs text-gray-600'>
                  <span className='w-8 shrink-0'>{star} &#9733;</span>
                  <span className='h-2 flex-1 overflow-hidden rounded-full bg-line/70'>
                    <span className='block h-full rounded-full bg-[#e0a73a] transition-[width] duration-700 ease-petal' style={{ width: `${share * 100}%` }} />
                  </span>
                  <span className='w-6 shrink-0 text-right tabular-nums'>{distribution[star]}</span>
                </li>
              )
            })}
          </ul>
          {IS_SAMPLE_DATA && (
            <p className='mt-6 rounded-xl bg-blush/50 px-4 py-3 text-xs leading-relaxed text-gray-600'>
              Sample reviews for demonstration. Real customer reviews will appear here once orders are reviewed.
            </p>
          )}
        </div>

        {/* Review list */}
        <div className='min-w-0'>
          <div className='mb-4 flex items-center justify-between gap-3'>
            <p className='text-sm text-gray-500'>Showing {visible.length} of {count}</p>
            <div className='relative'>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                aria-label='Sort reviews'
                className='h-10 appearance-none rounded-full border border-line bg-white/70 pl-4 pr-9 text-sm text-ink outline-none transition-colors hover:bg-white focus-visible:ring-2 focus-visible:ring-brand cursor-pointer'
              >
                {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
              <span aria-hidden='true' className='pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-500'>&#9662;</span>
            </div>
          </div>
          <ul className='grid gap-3 md:grid-cols-2'>
            {visible.map((review) => <ReviewCard key={review.id} review={review} />)}
          </ul>
          {count > INITIAL_VISIBLE && (
            <div className='mt-6 text-center'>
              <button type='button' onClick={() => setShowAll((v) => !v)} className='btn-outline px-7 py-3'>
                {showAll ? 'Show fewer reviews' : `Show all ${count} reviews`}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default ReviewsSection
