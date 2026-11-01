import React from 'react'
import { Link } from 'react-router-dom'
import { formatPrice, imageUrl } from '../utils/format'
import { typeLabel } from '../constants'

// Card images load a size that suits the column width, and a sharper one on high-resolution screens
const SIZES = '(min-width: 1280px) 22vw, (min-width: 1024px) 28vw, (min-width: 768px) 30vw, 46vw'
const srcSet = (url) => `${imageUrl(url, 400)} 400w, ${imageUrl(url, 700)} 700w, ${imageUrl(url, 1000)} 1000w`

const ProductItem = ({ id, image, name, price, bestseller, subCategory, badge }) => {
  const [first, second] = Array.isArray(image) ? image : []

  return (
    <Link className='group flex h-full flex-col' to={`/product/${id}`}>
      <div className='zoom-frame rounded-3xl aspect-[4/5] shadow-soft transition-shadow duration-500 group-hover:shadow-lift'>
        <img
          className='absolute inset-0 h-full w-full object-cover'
          src={imageUrl(first, 700)}
          srcSet={first ? srcSet(first) : undefined}
          sizes={SIZES}
          alt={name}
          loading='lazy'
          decoding='async'
        />
        {/* A second photo, when there is one, fades in on hover */}
        {second && (
          <img
            className='absolute inset-0 h-full w-full object-cover opacity-0 !transition-[opacity,transform] group-hover:opacity-100'
            src={imageUrl(second, 700)}
            srcSet={srcSet(second)}
            sizes={SIZES}
            alt=""
            loading='lazy'
            decoding='async'
          />
        )}
        {badge
          ? <span className='tag absolute left-3 top-3 px-2.5 py-1 text-[10px] border-brand/20 bg-brand text-white'>{badge}</span>
          : bestseller && <span className='tag absolute left-3 top-3 px-2.5 py-1 text-[10px]'>Bestseller</span>}
        <span className='absolute inset-x-3 bottom-3 translate-y-3 opacity-0 rounded-full bg-white/80 py-2.5 text-center text-xs font-medium tracking-wide text-ink backdrop-blur-md shadow-soft transition-all duration-500 ease-petal group-hover:translate-y-0 group-hover:opacity-100'>
          View details
        </span>
      </div>
      {/* Name kept to two lines so every card in a row ends at the same height */}
      <div className='flex flex-1 flex-col px-1 pt-4'>
        {subCategory && <p className='eyebrow text-[10px]'>{typeLabel(subCategory)}</p>}
        <p className='mt-1.5 line-clamp-2 min-h-[2.6em] text-sm sm:text-[15px] leading-[1.3] text-ink transition-colors group-hover:text-brand'>{name}</p>
        <div className='mt-2 flex items-center justify-between gap-2'>
          <p className='text-sm sm:text-[15px] font-medium text-ink'><span className='mr-1 text-[11px] font-normal text-gray-400'>from</span>{formatPrice(price)}</p>
          <span aria-hidden='true' className='flex h-7 w-7 items-center justify-center rounded-full border border-line text-xs text-gray-500 transition-all duration-300 group-hover:border-ink group-hover:bg-ink group-hover:text-white'>&rarr;</span>
        </div>
      </div>
    </Link>
  )
}

export default ProductItem
