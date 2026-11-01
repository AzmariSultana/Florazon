import React, { useContext, useMemo } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'
import ProductGrid from './ProductGrid'
import { newestProducts } from '../utils/catalog'

const BestSeller = () => {
  const { products } = useContext(ShopContext)
  // Skip the designs already shown under New Arrivals, so the two rows never repeat a product
  const bestSeller = useMemo(() => {
    const shown = new Set(newestProducts(products).map((item) => item._id))
    return products.filter((item) => item.bestseller && !shown.has(item._id)).slice(0, 4)
  }, [products])

  if (bestSeller.length === 0) return null

  return (
    // A tinted band sets the bestsellers apart from the latest arrivals above
    <section className='mt-24 rounded-4xl bg-white/45 border border-white/80 px-4 py-12 sm:px-10 sm:py-16 shadow-glass backdrop-blur-sm'>
      <Title
        align='center'
        eyebrow='Customer favourites'
        text1={'MOST'}
        text2={'LOVED'}
        subtitle='Our best-selling arrangements, the ones customers choose most often.'
      />
      <div className='mt-10'>
        <ProductGrid products={bestSeller} className='grid-cols-2 md:grid-cols-4' />
      </div>
    </section>
  )
}

export default BestSeller
