import React, { useContext, useMemo } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'
import ProductGrid from './ProductGrid'

const BestSeller = () => {
  const { products } = useContext(ShopContext)
  const bestSeller = useMemo(() => products.filter((item) => item.bestseller).slice(0, 5), [products])

  if (bestSeller.length === 0) return null

  return (
    <section className='my-10'>
      <div className='text-center text-3xl py-8'>
        <Title text1={'BEST'} text2={'BLOSSOMS'} />
        <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
          Eternal petals, blooming in hearts of love.
        </p>
      </div>
      <ProductGrid products={bestSeller} />
    </section>
  )
}

export default BestSeller
