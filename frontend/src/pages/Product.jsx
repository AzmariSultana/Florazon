import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { ShopContext } from '../context/ShopContext'
import RelatedProducts from '../components/RelatedProducts'
import { formatPrice, imageUrl } from '../utils/format'
import StatusMessage, { LOAD_ERROR_TEXT } from '../components/StatusMessage'
import useDocumentTitle from '../utils/useDocumentTitle'
import { getProductOptions, isSoldByStem, optionPrice } from '../utils/productOptions'
import { DELIVERY_FEE, categoryLabel, typeLabel } from '../constants'

// Option heading for products sold in sizes, by type
const SIZE_LABELS = { Garland: 'Garland size', Basket: 'Basket size' }
const MAX_QUANTITY = 20

// Main photo in one consistent frame: the whole photo is shown (never cropped), and any space around it
// is filled with a soft, blurred copy of the same photo so there are no empty bands. Zoom is hover-only.
const PhotoStage = ({ src, alt, badge }) => {
  const [origin, setOrigin] = useState('50% 50%')
  const onMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setOrigin(`${((e.clientX - rect.left) / rect.width) * 100}% ${((e.clientY - rect.top) / rect.height) * 100}%`)
  }
  return (
    <div
      onMouseMove={onMove}
      onMouseLeave={() => setOrigin('50% 50%')}
      className='group relative w-full overflow-hidden rounded-[1.75rem] bg-blush/40 shadow-soft cursor-zoom-in aspect-[4/5] sm:aspect-[5/4] lg:aspect-auto lg:h-[min(calc(100vh-150px),700px)]'
    >
      <img aria-hidden='true' alt='' src={src} className='absolute inset-0 h-full w-full scale-125 object-cover blur-3xl opacity-90 saturate-[1.15]' />
      <div aria-hidden='true' className='absolute inset-0 bg-cream/10' />
      {/* The fade runs on a wrapper: an animation's held transform would override the zoom */}
      <div key={src} className='absolute inset-0 animate-fade-up'>
        <img
          className='h-full w-full object-contain transition-transform duration-500 ease-petal group-hover:scale-[1.5]'
          style={{ transformOrigin: origin }}
          src={src}
          alt={alt}
        />
      </div>
      {badge && <span className='tag absolute left-4 top-4 z-10'>{badge}</span>}
    </div>
  )
}

// Pill-shaped quantity control
const QuantityStepper = ({ value, onChange }) => {
  const step = (delta) => onChange(Math.min(MAX_QUANTITY, Math.max(1, value + delta)))
  const buttonClass = 'flex h-10 w-10 items-center justify-center rounded-full text-lg text-gray-600 transition-colors hover:bg-blush/60 hover:text-ink disabled:opacity-30 disabled:hover:bg-transparent'
  return (
    <div className='inline-flex h-12 shrink-0 items-center rounded-full border border-line bg-white/80 px-1' role='group' aria-label='Quantity'>
      <button type='button' onClick={() => step(-1)} disabled={value <= 1} aria-label='Decrease quantity' className={buttonClass}>&minus;</button>
      <span className='w-8 text-center text-sm font-medium text-ink' aria-live='polite'>{value}</span>
      <button type='button' onClick={() => step(1)} disabled={value >= MAX_QUANTITY} aria-label='Increase quantity' className={buttonClass}>+</button>
    </div>
  )
}

const Product = () => {
  const { productId } = useParams()
  const { products, productsStatus, addToCart, updateQuantity, cartItems, navigate } = useContext(ShopContext)
  const [productData, setProductData] = useState(false)
  const [image, setImage] = useState('')
  const [size, setSize] = useState('')
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    const item = products.find(p => p._id === productId)
    setProductData(item || false)
    setImage(item?.image?.[0] || '')
    // Start on the base option (as pictured / a single stem) so the shown price is always real
    setSize(item ? getProductOptions(item)[0].label : '')
    setQuantity(1)
    window.scrollTo(0, 0)
  }, [productId, products])

  useDocumentTitle(productData ? productData.name : 'Product')

  if (!productData) {
    return (
      <div>
        {productsStatus === 'loading' && (
          <div className='grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] gap-8 lg:gap-14 pt-12' aria-label='Loading product'>
            <div className='skeleton aspect-[4/5] rounded-[2rem]' />
            <div>
              <div className='skeleton h-3 w-40' />
              <div className='skeleton h-10 w-3/4 mt-5' />
              <div className='skeleton h-8 w-32 mt-5' />
              <div className='skeleton h-20 w-full mt-6' />
              <div className='skeleton h-24 w-full mt-8' />
              <div className='skeleton h-12 w-full mt-8 rounded-full' />
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
  const unitPrice = optionPrice(productData, size)
  const lineTotal = unitPrice * quantity

  // Adds the chosen option and quantity; one item uses the usual add, more set the cart line directly
  const addSelection = (thenCheckout = false) => {
    if (quantity === 1) {
      addToCart(productData._id, size)
    } else {
      const current = cartItems[productData._id]?.[size] || 0
      updateQuantity(productData._id, size, current + quantity)
      toast.success('Added to cart')
    }
    if (thenCheckout) navigate('/place-order')
  }

  const details = [
    ['Collection', typeLabel(productData.subCategory)],
    ['Category', categoryLabel(productData.category)],
    ['Sold as', byStems ? 'Single stems' : 'Arrangement in three sizes'],
    ['Delivery', `${formatPrice(DELIVERY_FEE)} · arranged on the day of delivery`],
    ['Payment', 'Cash on delivery'],
    ['Exchange', 'Easy exchange within 1 day'],
  ]

  return (
    // On phones the footer leaves room for this page's fixed purchase bar (see Footer)
    <div className='pt-4 sm:pt-6'>
      <nav aria-label='Breadcrumb' className='mb-6 sm:mb-8 flex min-w-0 items-center text-xs text-gray-500'>
        <Link to='/' className='shrink-0 transition-colors hover:text-brand'>Home</Link>
        <span className='mx-2 text-gray-300' aria-hidden='true'>/</span>
        <Link to='/collection' className='shrink-0 transition-colors hover:text-brand'>Collection</Link>
        <span className='mx-2 text-gray-300' aria-hidden='true'>/</span>
        <span className='truncate text-gray-700' aria-current='page'>{productData.name}</span>
      </nav>

      <div className='grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] items-start gap-8 lg:gap-12 xl:gap-16'>
        {/* Gallery */}
        <div className='min-w-0 lg:sticky lg:top-24 animate-fade-up'>
          <PhotoStage src={imageUrl(image, 1000)} alt={productData.name} badge={productData.bestseller ? 'Bestseller' : null} />
          {images.length > 1 && (
            <div className='mt-4 flex gap-3 overflow-x-auto p-1 -m-1'>
              {images.map((item, index) => (
                <button
                  type='button'
                  key={item}
                  onClick={() => setImage(item)}
                  aria-label={`Show image ${index + 1}`}
                  aria-pressed={item === image}
                  className={`h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-blush/40 ring-2 ring-offset-2 ring-offset-canvas transition-all duration-300 ${item === image ? 'ring-ink' : 'ring-transparent opacity-70 hover:opacity-100'}`}
                >
                  <img src={imageUrl(item, 200)} className='h-full w-full object-cover' alt='' />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product information */}
        <div className='min-w-0 animate-fade-up [animation-delay:120ms]'>
          <p className='eyebrow'>{typeLabel(productData.subCategory)} &middot; {categoryLabel(productData.category)}</p>
          <h1 className='mt-3 font-display text-[2rem] sm:text-[2.4rem] xl:text-[2.6rem] leading-[1.12] text-ink'>{productData.name}</h1>

          <div className='mt-5'>
            <p className='font-display text-[2rem] leading-none text-brand' aria-live='polite'>{formatPrice(unitPrice)}</p>
            <p className='mt-2 text-xs sm:text-sm text-gray-500'>Price for {size} &middot; {formatPrice(DELIVERY_FEE)} delivery &middot; Cash on delivery</p>
          </div>

          <p className='mt-6 max-w-prose text-[15px] sm:text-base text-gray-600 leading-relaxed'>{productData.description}</p>

          <div className='my-8 h-px bg-line' />

          {/* Options */}
          <div className='flex flex-col gap-4'>
            <div className='flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1'>
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
                    className={`relative flex min-w-0 flex-col items-start rounded-2xl border px-3 py-3 sm:px-4 text-left transition-all duration-300 ease-petal hover:-translate-y-0.5 ${selected ? 'border-ink bg-white shadow-soft' : 'border-line bg-white/60 hover:border-gray-400 hover:bg-white'}`}
                  >
                    <span aria-hidden='true' className={`absolute right-2.5 top-3 sm:right-3 flex h-4 w-4 items-center justify-center rounded-full border-2 transition-colors ${selected ? 'border-ink' : 'border-gray-300'}`}>
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

          {/* Quantity and actions */}
          <div className='mt-8 flex flex-col gap-3'>
            <div className='flex gap-3'>
              <QuantityStepper value={quantity} onChange={setQuantity} />
              <button type='button' onClick={() => addSelection()} className='btn-primary h-12 flex-1 px-5'>
                Add to cart <span className='font-normal opacity-70'>&middot;</span> {formatPrice(lineTotal)}
              </button>
            </div>
            <button type='button' onClick={() => addSelection(true)} className='btn-outline h-12 w-full'>Buy now</button>
          </div>

          {/* Details */}
          <dl className='panel mt-8 divide-y divide-line/80 px-5 sm:px-6 py-1 text-sm'>
            {details.map(([term, value]) => (
              <div key={term} className='flex items-start justify-between gap-6 py-3.5'>
                <dt className='shrink-0 text-gray-500'>{term}</dt>
                <dd className='text-right font-medium text-ink'>{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <RelatedProducts category={productData.category} subCategory={productData.subCategory} currentId={productData._id} />

      {/* Phones: price and add to cart stay within reach while scrolling */}
      <div className='fixed inset-x-0 bottom-0 z-30 flex items-center gap-3 border-t border-line/80 bg-canvas/90 px-4 py-3 backdrop-blur-xl lg:hidden'>
        <div className='min-w-0 flex-1'>
          <p className='truncate text-xs text-gray-500'>{size}{quantity > 1 ? ` × ${quantity}` : ''}</p>
          <p className='font-display text-xl leading-tight text-ink'>{formatPrice(lineTotal)}</p>
        </div>
        <button type='button' onClick={() => addSelection()} className='btn-primary h-12 px-7'>Add to cart</button>
      </div>
    </div>
  )
}

export default Product
