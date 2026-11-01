import React, { useContext, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'
import ProductGrid, { ProductGridSkeleton } from './ProductGrid'

const LatestCollection = () => {
  const { products, productsStatus } = useContext(ShopContext)

  // Newest first, based on the date each product was added
  const latestProducts = useMemo(
    () => [...products].sort((a, b) => (b.date || 0) - (a.date || 0)).slice(0, 4),
    [products]
  )

  if (productsStatus !== 'loading' && latestProducts.length === 0) return null

  return (
    <section className='mt-24'>
      <div className='flex flex-wrap items-end justify-between gap-4'>
        <Title
          eyebrow='Just added'
          text1={'NEW'}
          text2={'ARRIVALS'}
          subtitle='The newest designs from our studio, added to the collection most recently.'
        />
        <Link to='/collection' className='btn-link mb-6'>See the full collection &rarr;</Link>
      </div>
      {productsStatus === 'loading' ? <ProductGridSkeleton count={4} className='grid-cols-2 md:grid-cols-4' /> : <ProductGrid products={latestProducts} badge='New' className='grid-cols-2 md:grid-cols-4' />}
    </section>
  )
}

export default LatestCollection
