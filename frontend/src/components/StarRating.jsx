import React from 'react'

const STAR = 'M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z'

// Five stars filled to the given rating (partial stars supported). The label is read by screen readers.
const StarRating = ({ rating, size = 'h-4 w-4', className = '' }) => (
  <span className={`inline-flex items-center gap-0.5 ${className}`} role='img' aria-label={`Rated ${rating.toFixed(1)} out of 5`}>
    {[0, 1, 2, 3, 4].map((i) => {
      const fill = Math.max(0, Math.min(1, rating - i))
      return (
        <span key={i} className={`relative ${size}`} aria-hidden='true'>
          <svg viewBox='0 0 24 24' className='absolute inset-0 h-full w-full text-line' fill='currentColor'><path d={STAR} /></svg>
          <span className='absolute inset-0 overflow-hidden' style={{ width: `${fill * 100}%` }}>
            <svg viewBox='0 0 24 24' className={`h-full ${size.split(' ').find((c) => c.startsWith('w-'))} text-[#e0a73a]`} fill='currentColor'><path d={STAR} /></svg>
          </span>
        </span>
      )
    })}
  </span>
)

export default StarRating
