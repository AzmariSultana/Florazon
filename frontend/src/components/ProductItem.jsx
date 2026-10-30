import React from 'react'
import { Link } from 'react-router-dom'
import { formatPrice, imageUrl } from '../utils/format'

const ProductItem = ({ id, image, name, price }) => {
  return (
    <Link className='group block text-gray-700' to={`/product/${id}`}>
      <div className='overflow-hidden rounded-md bg-cream'>
        <img
          className='w-full aspect-square object-cover transition-transform duration-500 ease-out group-hover:scale-105'
          src={imageUrl(image?.[0], 600)}
          alt={name}
          loading='lazy'
          decoding='async'
        />
      </div>
      <p className='pt-3 pb-1 text-sm leading-snug text-gray-600 transition-colors group-hover:text-ink'>{name}</p>
      <p className='text-sm font-medium text-ink'>{formatPrice(price)}</p>
    </Link>
  )
}

export default ProductItem
