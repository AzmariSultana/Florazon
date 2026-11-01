import React from 'react'
import ProductItem from './ProductItem'
import Reveal from './Reveal'
import { getProductRating } from '../utils/reviews'

const DEFAULT_COLUMNS = 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'

// badge: an optional label shown on every card (e.g. 'New'), in place of the bestseller tag
const ProductGrid = ({ products, className = DEFAULT_COLUMNS, badge }) => (
  <div className={`grid ${className} gap-x-4 gap-y-10 sm:gap-x-6`}>
    {products.map((item, i) => (
      <Reveal key={item._id} delay={(i % 4) * 80}>
        <ProductItem id={item._id} name={item.name} image={item.image} price={item.price} bestseller={item.bestseller} subCategory={item.subCategory} badge={badge} rating={getProductRating(item)} />
      </Reveal>
    ))}
  </div>
)

// Placeholder cards with the same shape as ProductItem, shown while products load
export const ProductGridSkeleton = ({ count = 4, className = DEFAULT_COLUMNS }) => (
  <div className={`grid ${className} gap-x-4 gap-y-10 sm:gap-x-6`} aria-hidden='true'>
    {Array.from({ length: count }, (_, i) => (
      <div key={i}>
        <div className='skeleton rounded-3xl aspect-[4/5]' />
        <div className='skeleton h-2.5 mt-4 w-1/4' />
        <div className='skeleton h-3 mt-2 w-3/4' />
      </div>
    ))}
  </div>
)

export default ProductGrid
