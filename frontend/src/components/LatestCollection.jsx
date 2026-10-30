import React, { useContext, useMemo } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'
import ProductGrid, { ProductGridSkeleton } from './ProductGrid'

const LatestCollection = () => {
  const { products, productsStatus } = useContext(ShopContext)

  // Newest first, based on the date each product was added
  const latestProducts = useMemo(
    () => [...products].sort((a, b) => (b.date || 0) - (a.date || 0)).slice(0, 10),
    [products]
  )

  if (productsStatus !== 'loading' && latestProducts.length === 0) return null

  return (
    <section className='my-10'>
      <div className='text-center py-8 text-3xl'>
        <Title text1={'LATEST'} text2={'BLOOMS'} />
        <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
          Each bloom, a line of poetry, fresh from nature&apos;s newest sonnet.
        </p>
      </div>
      {productsStatus === 'loading' ? <ProductGridSkeleton count={10} /> : <ProductGrid products={latestProducts} />}
    </section>
  )
}

export default LatestCollection
