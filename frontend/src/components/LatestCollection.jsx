import React, { useContext, useMemo } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'
import ProductGrid, { ProductGridSkeleton } from './ProductGrid'
import { newestProducts } from '../utils/catalog'

const LatestCollection = () => {
  const { products, productsStatus } = useContext(ShopContext)

  const latestProducts = useMemo(() => newestProducts(products), [products])

  if (productsStatus !== 'loading' && latestProducts.length === 0) return null

  return (
    <section className='mt-24'>
      <Title
        eyebrow='Just added'
        text1={'NEW'}
        text2={'ARRIVALS'}
        subtitle='The newest designs from our studio, added to the collection most recently.'
      />
      {productsStatus === 'loading' ? <ProductGridSkeleton count={4} className='grid-cols-2 md:grid-cols-4' /> : <ProductGrid products={latestProducts} badge='New' className='grid-cols-2 md:grid-cols-4' />}
    </section>
  )
}

export default LatestCollection
