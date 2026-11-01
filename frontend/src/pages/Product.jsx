import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import RelatedProducts from '../components/RelatedProducts'
import { formatPrice, imageUrl } from '../utils/format'
import StatusMessage, { LOAD_ERROR_TEXT } from '../components/StatusMessage'
import Reveal from '../components/Reveal'
import useDocumentTitle from '../utils/useDocumentTitle'
import { getProductOptions, isSoldByStem, optionPrice } from '../utils/productOptions'
import { categoryLabel, typeLabel } from '../constants'

// Option heading for products sold in sizes, by type
const SIZE_LABELS = { Garland: 'Garland size', Basket: 'Basket size' }

const PRODUCT_PROMISES = [
  '100% fresh, hand-arranged flowers.',
  'Cash on Delivery is available on this product.',
  'Easy return and exchange within 1 day.',
]

// Main photo that magnifies towards the pointer while hovered
const ZoomImage = ({ src, alt }) => {
  const [origin, setOrigin] = useState('50% 50%')
  const onMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setOrigin(`${((e.clientX - rect.left) / rect.width) * 100}% ${((e.clientY - rect.top) / rect.height) * 100}%`)
  }
  return (
    <div onMouseMove={onMove} onMouseLeave={() => setOrigin('50% 50%')} className='group flex-1 overflow-hidden rounded-3xl bg-blush/50 shadow-soft cursor-zoom-in aspect-[4/5]'>
      {/* The fade runs on a wrapper: an animation's held transform would override the zoom */}
      <div key={src} className='h-full w-full animate-fade-up'>
        <img
          className='h-full w-full object-cover transition-transform duration-500 ease-petal group-hover:scale-[1.6]'
          style={{ transformOrigin: origin }}
          src={src}
          alt={alt}
        />
      </div>
    </div>
  )
}

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
    // Start on the base option (as pictured / a single stem) so the shown price is always real
    setSize(item ? getProductOptions(item)[0].label : '')
    window.scrollTo(0, 0)
  }, [productId, products])

  useDocumentTitle(productData ? productData.name : 'Product')

  if (!productData) {
    return (
      <div>
        {productsStatus === 'loading' && (
          <div className='grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-8 lg:gap-14 pt-12' aria-label='Loading product'>
            <div className='skeleton aspect-[4/5] rounded-3xl' />
            <div>
              <div className='skeleton h-6 w-40 rounded-full' />
              <div className='skeleton h-10 w-3/4 mt-5' />
              <div className='skeleton h-7 w-24 mt-5' />
              <div className='skeleton h-20 w-full mt-6' />
              <div className='skeleton h-12 w-64 mt-10 rounded-full' />
            </div>
          </div>
        )}
        {productsStatus === 'error' && <StatusMessage retry>{LOAD_ERROR_TEXT}</StatusMessage>}
        {productsStatus === 'ready' && <StatusMessage>This product is no longer available.</StatusMessage>}
      </div>
    )
  }

  const images = Array.isArray(productData.image) ? productData.image : []
  const options = getProductOptions(productData)
  const byStems = isSoldByStem(productData)

  return (
    <div className='pt-4 sm:pt-6'>
      <nav aria-label='Breadcrumb' className='mb-6 sm:mb-8 text-xs text-gray-500'>
        <Link to='/' className='transition-colors hover:text-brand'>Home</Link>
        <span className='mx-2 text-gray-300' aria-hidden='true'>/</span>
        <Link to='/collection' className='transition-colors hover:text-brand'>Collection</Link>
        <span className='mx-2 text-gray-300' aria-hidden='true'>/</span>
        <span className='text-gray-700' aria-current='page'>{productData.name}</span>
      </nav>
      <div className='grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-8 lg:gap-14 animate-fade-up'>
        {/* Gallery */}
        <div className='flex flex-col-reverse sm:flex-row gap-3 sm:gap-4'>
          {images.length > 1 && (
            <div className='flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible p-1 -m-1 sm:w-[5.5rem] shrink-0'>
              {images.map((item, index) => (
                <button
                  type='button'
                  key={item}
                  onClick={() => setImage(item)}
                  aria-label={`Show image ${index + 1}`}
                  aria-pressed={item === image}
                  className={`w-20 shrink-0 aspect-[4/5] overflow-hidden rounded-2xl ring-2 ring-offset-2 ring-offset-canvas transition-all duration-300 ${item === image ? 'ring-ink' : 'ring-transparent opacity-70 hover:opacity-100'}`}
                >
                  <img src={imageUrl(item, 200)} className='h-full w-full object-cover' alt="" />
                </button>
              ))}
            </div>
          )}
          <ZoomImage src={imageUrl(image, 1000)} alt={productData.name} />
        </div>

        {/* Details */}
        <div className='lg:sticky lg:top-24 lg:self-start'>
          <div className='flex flex-wrap items-center gap-2'>
            <span className='tag'>{categoryLabel(productData.category)}</span>
            <span className='tag'>{typeLabel(productData.subCategory)}</span>
            {productData.bestseller && <span className='tag text-brand'>Bestseller</span>}
          </div>
          <h1 className='font-display text-3xl sm:text-4xl lg:text-[2.75rem] mt-5 leading-tight text-ink'>{productData.name}</h1>
          <p className='mt-4 text-2xl font-medium text-brand' aria-live='polite'>{formatPrice(optionPrice(productData, size))}</p>
          <p className='mt-6 text-gray-600 leading-relaxed max-w-prose'>{productData.description}</p>

          <div className='h-px bg-line my-8' />

          <div className='flex flex-col gap-4'>
            <div className='flex items-baseline justify-between gap-3'>
              <p id='option-label' className='eyebrow text-gray-700'>{byStems ? 'Number of stems' : SIZE_LABELS[productData.subCategory] || 'Bouquet size'}</p>
              {!byStems && <p className='text-xs text-gray-500'>Standard is the arrangement pictured</p>}
            </div>
            <div className={`grid gap-2.5 ${options.length > 2 ? 'grid-cols-3' : 'grid-cols-2'}`} role='radiogroup' aria-labelledby='option-label'>
              {options.map((option) => {
                const selected = option.label === size
                return (
                  <button
                    type='button'
                    role='radio'
                    key={option.label}
                    aria-checked={selected}
                    onClick={() => setSize(option.label)}
                    className={`relative flex flex-col items-start rounded-2xl border px-3.5 py-3 sm:px-4 text-left transition-all duration-300 ease-petal ${selected ? 'border-ink bg-white shadow-soft' : 'border-line bg-white/60 hover:border-gray-400 hover:bg-white'}`}
                  >
                    <span aria-hidden='true' className={`absolute right-3 top-3 flex h-4 w-4 items-center justify-center rounded-full border-2 transition-colors ${selected ? 'border-ink' : 'border-gray-300'}`}>
                      <span className={`h-2 w-2 rounded-full bg-ink transition-transform duration-300 ${selected ? 'scale-100' : 'scale-0'}`} />
                    </span>
                    <span className='pr-5 text-sm font-medium text-ink'>{option.label}</span>
                    <span className='mt-0.5 text-[11px] sm:text-xs leading-snug text-gray-500'>{option.detail}</span>
                    <span className={`mt-auto pt-2 text-sm ${selected ? 'text-brand font-medium' : 'text-gray-700'}`}>{formatPrice(optionPrice(productData, option.label))}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <button type='button' onClick={() => addToCart(productData._id, size)} className='btn-primary w-full sm:w-auto sm:min-w-[260px] mt-8 py-4'>
            Add to cart
          </button>

          <ul className='panel mt-8 p-5 sm:p-6 flex flex-col gap-3 text-sm text-gray-600'>
            {PRODUCT_PROMISES.map((line) => (
              <li key={line} className='flex items-start gap-3'>
                <span className='mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sage-soft text-[10px] text-sage' aria-hidden='true'>&#10003;</span>
                {line}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Description */}
      <Reveal as='section' className='mt-20 grid md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-6 md:gap-12 border-t border-line pt-12'>
        <h2 className='font-display text-2xl sm:text-3xl text-ink'>Made with <span className='text-brand'>care</span></h2>
        <div className='flex flex-col gap-4 text-gray-600 leading-relaxed'>
          <p>Florazon is where blossoms meet emotions, and every gift tells a story. Each arrangement is put together by hand on the day of delivery, using flowers chosen for their freshness, colour and fragrance.</p>
          <p>Every Florazon creation is wrapped and finished with care, so it arrives looking as beautiful as the moment it was made.</p>
        </div>
      </Reveal>

      <RelatedProducts category={productData.category} subCategory={productData.subCategory} currentId={productData._id} />
    </div>
  )
}

export default Product
