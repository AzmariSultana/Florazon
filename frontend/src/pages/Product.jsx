import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import RelatedProducts from '../components/RelatedProducts'
import { formatPrice, imageUrl } from '../utils/format'
import StatusMessage, { LOAD_ERROR_TEXT } from '../components/StatusMessage'
import useDocumentTitle from '../utils/useDocumentTitle'

const PRODUCT_PROMISES = [
  '100% fresh, hand-arranged flowers.',
  'Cash on Delivery is available on this product.',
  'Easy return and exchange within 1 day.',
]

const Product = () => {
  const { productId } = useParams()
  const { products, productsStatus, addToCart } = useContext(ShopContext)
  const [productData, setProductData] = useState(false)
  const [image, setImage] = useState('')
  const [size, setSize] = useState('')

  useEffect(() => {
    const item = products.find(p => p._id === productId)
    setProductData(item || false)
    setImage(item?.image?.[0] || '')
    setSize('')
    window.scrollTo(0, 0)
  }, [productId, products])

  useDocumentTitle(productData ? productData.name : 'Product')

  if (!productData) {
    return (
      <div className='border-t'>
        {productsStatus === 'loading' && (
          <div className='flex gap-12 flex-col sm:flex-row pt-12' aria-label='Loading product'>
            <div className='skeleton flex-1 aspect-[4/5] sm:max-w-[45%] rounded-lg' />
            <div className='flex-1'>
              <div className='skeleton h-3 w-32' />
              <div className='skeleton h-7 w-3/4 mt-4' />
              <div className='skeleton h-6 w-24 mt-5' />
              <div className='skeleton h-16 w-4/5 mt-6' />
              <div className='skeleton h-11 w-44 mt-8' />
            </div>
          </div>
        )}
        {productsStatus === 'error' && <StatusMessage retry>{LOAD_ERROR_TEXT}</StatusMessage>}
        {productsStatus === 'ready' && <StatusMessage>This product is no longer available.</StatusMessage>}
      </div>
    )
  }

  const images = Array.isArray(productData.image) ? productData.image : []

  return (
    <div className='border-t pt-6'>
      <nav aria-label='Breadcrumb' className='mb-6 text-xs text-gray-500'>
        <Link to='/' className='transition-colors hover:text-ink'>Home</Link>
        <span className='mx-2' aria-hidden='true'>/</span>
        <Link to='/collection' className='transition-colors hover:text-ink'>Collection</Link>
        <span className='mx-2' aria-hidden='true'>/</span>
        <span className='text-gray-700' aria-current='page'>{productData.name}</span>
      </nav>
      <div className='flex gap-12 flex-col sm:flex-row animate-fade-up'>
        {/* Gallery */}
        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
          {images.length > 1 && (
            <div className='flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto sm:w-[18.7%] w-full'>
              {images.map((item, index) => (
                <button
                  type='button'
                  key={item}
                  onClick={() => setImage(item)}
                  aria-label={`Show image ${index + 1}`}
                  className={`w-[24%] sm:w-full flex-shrink-0 overflow-hidden rounded-md border-2 transition-colors ${item === image ? 'border-ink' : 'border-transparent hover:border-gray-300'}`}
                >
                  <img src={imageUrl(item, 200)} className='w-full' alt="" />
                </button>
              ))}
            </div>
          )}
          <div className='w-full sm:w-[80%]'>
            <img className='w-full h-auto rounded-lg bg-cream' src={imageUrl(image, 1000)} alt={productData.name} />
          </div>
        </div>

        {/* Details */}
        <div className='flex-1'>
          <p className='eyebrow'>{productData.category} · {productData.subCategory}</p>
          <h1 className='font-medium text-2xl sm:text-3xl mt-2 leading-snug text-ink'>{productData.name}</h1>
          <p className='mt-4 text-2xl sm:text-3xl font-medium text-ink'>{formatPrice(productData.price)}</p>
          <p className='mt-5 text-gray-500 leading-relaxed md:w-4/5'>{productData.description}</p>

          <div className='flex flex-col gap-4 my-8'>
            <p id='size-label' className='text-sm font-medium'>Select Size</p>
            <div className='flex flex-wrap gap-2' role='group' aria-labelledby='size-label'>
              {(productData.sizes || []).map((item) => (
                <button
                  type='button'
                  key={item}
                  aria-pressed={item === size}
                  onClick={() => setSize(item)}
                  className={`chip ${item === size ? 'chip-selected' : 'chip-idle'}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <button type='button' onClick={() => addToCart(productData._id, size)} className='btn-primary w-full sm:w-auto px-12'>
            ADD TO CART
          </button>

          <ul className='panel text-sm text-gray-600 mt-8 sm:w-4/5 px-5 py-4 flex flex-col gap-1.5'>
            {PRODUCT_PROMISES.map((line) => (
              <li key={line} className='flex items-start gap-2'>
                <span className='mt-[7px] w-1 h-1 rounded-full bg-brand flex-shrink-0' aria-hidden='true'></span>
                {line}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Description */}
      <section className='mt-20'>
        <div className='flex'>
          <h2 className='border border-line border-b-0 rounded-t-lg bg-cream px-5 py-3 text-sm font-semibold'>Description</h2>
        </div>
        <div className='flex flex-col gap-4 border border-line rounded-b-lg rounded-tr-lg px-6 py-6 text-sm text-gray-600 leading-relaxed'>
          <p>Florazon is where blossoms meet emotions, and every gift tells a story. Each arrangement is put together by hand on the day of delivery, using flowers chosen for their freshness, colour and fragrance.</p>
          <p>Every Florazon creation is wrapped and finished with care, so it arrives looking as beautiful as the moment it was made.</p>
        </div>
      </section>

      <RelatedProducts category={productData.category} subCategory={productData.subCategory} currentId={productData._id} />
    </div>
  )
}

export default Product
