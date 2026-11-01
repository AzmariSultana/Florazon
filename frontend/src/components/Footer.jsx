import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { assets } from '../assets/assets'
import { STORE } from '../constants'

// Five-petal flower head drawn at (x, y) with the given radius
const Flower = ({ x, y, r, color }) => (
  <g transform={`translate(${x} ${y})`}>
    {[0, 72, 144, 216, 288].map((angle) => (
      <ellipse key={angle} cx='0' cy={-r * 0.55} rx={r * 0.36} ry={r * 0.58} transform={`rotate(${angle})`} fill={color} opacity='0.55' />
    ))}
    <circle r={r * 0.22} fill={color} />
  </g>
)

// A small sprig of blossoms on a curved stem, used as a corner ornament
const Sprig = ({ className = '' }) => (
  <svg viewBox='0 0 120 170' className={className} aria-hidden='true'>
    <path d='M60 168 C58 130 50 100 34 70 M52 112 C66 92 80 78 92 50 M46 92 C40 80 30 74 18 72' fill='none' stroke='#9aa98b' strokeWidth='2.2' strokeLinecap='round' />
    <path d='M50 128 c-14 -2 -22 -10 -24 -20 c12 0 22 6 24 20z M64 100 c10 -10 22 -12 30 -8 c-6 10 -18 14 -30 8z' fill='#b9c4ac' />
    <Flower x={34} y={62} r={24} color='#c56a90' />
    <Flower x={94} y={42} r={20} color='#d488a8' />
    <Flower x={16} y={70} r={14} color='#b5527b' />
  </svg>
)

const Footer = () => {
  // Product pages show a fixed purchase bar on phones; extra bottom space keeps the footer clear of it
  const onProductPage = useLocation().pathname.startsWith('/product/')
  return (
    // Full-bleed band like the header: negative margins cancel the page gutter
    <footer className='relative mt-28 -mx-[var(--gutter)] px-[var(--gutter)] overflow-hidden border-t border-line/80'>
      {/* Blossom sprigs tucked into the edges */}
      <Sprig className='pointer-events-none absolute -left-5 bottom-4 w-14 sm:w-28 -rotate-12 opacity-90' />
      <Sprig className='pointer-events-none absolute -right-5 -top-2 sm:top-6 w-14 sm:w-28 rotate-[200deg] -scale-x-100 opacity-90' />

      <div className={`relative flex flex-col items-center py-14 sm:py-16 text-center ${onProductPage ? 'pb-32 sm:pb-32 lg:pb-16' : ''}`}>
        <Link to='/' className='transition-opacity hover:opacity-80'>
          <img src={assets.logo} className='w-[128px]' width={489} height={83} alt='Florazon home' loading='lazy' />
        </Link>
        <p className='mt-4 max-w-[17rem] sm:max-w-md font-display text-base sm:text-lg leading-snug text-gray-600'>{STORE.tagline}</p>

        <p className='mt-6 flex flex-col sm:flex-row items-center justify-center gap-x-3 gap-y-1 text-xs sm:text-sm text-gray-500'>
          <span>{STORE.address.join(', ')}</span>
          <span aria-hidden='true' className='hidden sm:block h-1 w-1 rounded-full bg-brand/50' />
          <a href={`mailto:${STORE.email}`} className='break-all transition-colors hover:text-brand'>{STORE.email}</a>
        </p>

        <p className='mt-10 text-xs text-gray-400'>Copyright {new Date().getFullYear()} © Florazon. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
