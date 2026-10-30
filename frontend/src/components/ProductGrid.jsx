import React from 'react'
import ProductItem from './ProductItem'

// Responsive grid of product cards shared by the home sections and related products
const ProductGrid = ({ products, className = 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5' }) => (
  <div className={`grid ${className} gap-4 gap-y-6`}>
    {products.map((item) => (
      <ProductItem key={item._id} id={item._id} name={item.name} image={item.image} price={item.price} />
    ))}
  </div>
)

// Placeholder cards with the same shape as ProductItem, shown while products load
export const ProductGridSkeleton = ({ count = 5, className = 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5' }) => (
  <div className={`grid ${className} gap-4 gap-y-6`} aria-hidden='true'>
    {Array.from({ length: count }, (_, i) => (
      <div key={i}>
        <div className='skeleton aspect-square' />
        <div className='skeleton h-3 mt-4 w-3/4' />
        <div className='skeleton h-3 mt-2 w-1/3' />
      </div>
    ))}
  </div>
)

export default ProductGrid
