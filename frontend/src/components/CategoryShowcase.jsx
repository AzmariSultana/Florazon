import React, { useContext, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { SUB_CATEGORIES, TYPES } from '../constants'
import { imageUrl } from '../utils/format'
import Title from './Title'

// Columns for however many flower types currently have products
const COLUMNS = { 1: 'grid-cols-1 max-w-sm', 2: 'grid-cols-2 max-w-3xl', 3: 'grid-cols-2 md:grid-cols-3', 4: 'grid-cols-2 md:grid-cols-4' }

// One image-led tile per flower type, pictured with a real product of that type
const CategoryShowcase = () => {
  const { products } = useContext(ShopContext)

  const tiles = useMemo(() => SUB_CATEGORIES.map((type) => {
    const items = products.filter((item) => item.subCategory === type)
    return { type, count: items.length, image: items.find((item) => item.bestseller)?.image?.[0] || items[0]?.image?.[0] }
  }).filter((tile) => tile.count > 0), [products])

  if (tiles.length === 0) return null

  return (
    <section className='mt-24'>
      <div className='flex flex-wrap items-end justify-between gap-4'>
        <Title eyebrow='Shop by type' text1={'FIND YOUR'} text2={'BLOOM'} subtitle='From a single stem to a wedding garland, start with the gift you have in mind.' />
        <Link to='/collection' className='btn-link mb-6'>Browse every collection &rarr;</Link>
      </div>
      <div className={`grid gap-x-4 gap-y-8 sm:gap-x-6 ${COLUMNS[tiles.length]}`}>
        {tiles.map((tile, i) => {
          const { label, tagline } = TYPES[tile.type]
          return (
            <Link
              key={tile.type}
              to='/collection'
              state={{ subCategory: tile.type }}
              className='group block animate-fade-up'
              style={{ animationDelay: `${i * 90}ms` }}
            >
              <div className='zoom-frame rounded-[1.75rem] aspect-[3/4] shadow-soft transition-shadow duration-500 group-hover:shadow-lift'>
                {tile.image && <img src={imageUrl(tile.image, 800)} alt='' loading='lazy' className='h-full w-full object-cover' />}
                {/* Soft fade at the foot of the photo so the badge always reads */}
                <div aria-hidden='true' className='absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/25 to-transparent' />
                <span className='tag absolute left-3 bottom-3 sm:left-4 sm:bottom-4 px-3 py-1 text-[10px]'>
                  {tile.count} {tile.count === 1 ? 'design' : 'designs'}
                </span>
              </div>
              <div className='mt-4 flex items-start justify-between gap-3 px-1'>
                <div className='min-w-0'>
                  <h3 className='font-display text-lg md:text-xl lg:text-2xl leading-tight text-ink transition-colors duration-300 group-hover:text-brand'>{label}</h3>
                  <p className='mt-1 text-xs sm:text-sm text-gray-500'>{tagline}</p>
                </div>
                <span aria-hidden='true' className='mt-0.5 hidden lg:flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-sm text-gray-600 transition-all duration-500 ease-petal group-hover:border-ink group-hover:bg-ink group-hover:text-white group-hover:-rotate-45'>&rarr;</span>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

export default CategoryShowcase
