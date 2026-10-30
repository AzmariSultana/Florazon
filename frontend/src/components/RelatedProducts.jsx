import { useContext, useMemo } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'
import ProductGrid from './ProductGrid'

const LIMIT = 5

const RelatedProducts = ({ category, subCategory, currentId }) => {
  const { products } = useContext(ShopContext)

  // Closest matches first: same category and type, then same type, then anything else
  const related = useMemo(() => {
    const others = products.filter((item) => item._id !== currentId)
    const rank = (item) => (item.subCategory === subCategory ? 0 : 2) + (item.category === category ? 0 : 1)
    return [...others].sort((a, b) => rank(a) - rank(b)).slice(0, LIMIT)
  }, [products, category, subCategory, currentId])

  if (related.length === 0) return null

  return (
    <section className='my-24'>
      <div className='text-center text-3xl py-2'>
        <Title text1={'RELATED'} text2={'PRODUCTS'} />
      </div>
      <ProductGrid products={related} />
    </section>
  )
}

export default RelatedProducts
