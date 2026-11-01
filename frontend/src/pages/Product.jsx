import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { ShopContext } from '../context/ShopContext'
import RelatedProducts from '../components/RelatedProducts'
import Reveal from '../components/Reveal'
import Lightbox from '../components/Lightbox'
import { formatPrice, imageUrl } from '../utils/format'
import StatusMessage, { LOAD_ERROR_TEXT } from '../components/StatusMessage'
import useDocumentTitle from '../utils/useDocumentTitle'
import { getProductOptions, isSoldByStem, optionPrice } from '../utils/productOptions'
import { DELIVERY_FEE, categoryLabel, typeLabel } from '../constants'

// Option heading for products sold in sizes, by type
const SIZE_LABELS = { Garland: 'Garland size', Basket: 'Basket size' }
const MAX_QUANTITY = 20

// Practical care advice for each kind of product
const CARE_TIPS = {
  stems: [
    'Trim about 2 cm off each stem at an angle before placing it in water.',
    'Use a clean vase with fresh, cool water and change it every two days.',
    'Keep away from direct sunlight, heaters and ripening fruit.',
  ],
  Bouquet: [
    'Unwrap the bouquet, trim the stems at an angle and place them in fresh water.',
    'Remove any leaves that would sit below the waterline.',
    'Refresh the water every two days and keep the vase out of direct sun.',
  ],
  Garland: [
    'Keep the garlands in a cool, shaded place until the ceremony.',
    'Mist lightly with water to keep the blooms fresh.',
    'For overnight storage, wrap loosely in damp paper and refrigerate.',
  ],
  Basket: [
    'Top up the floral foam with a little water every day.',
    'Display in a cool spot away from direct sunlight and drafts.',
    'Gently remove any faded blooms to keep the arrangement looking full.',
  ],
}

const Icon = ({ d }) => (
  <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.6' strokeLinecap='round' strokeLinejoin='round' className='h-5 w-5' aria-hidden='true'>{d}</svg>
)
const ICONS = {
  truck: <><path d='M3 7h11v9H3z' /><path d='M14 10h4l3 3v3h-7' /><circle cx='7' cy='17.5' r='1.5' /><circle cx='17' cy='17.5' r='1.5' /></>,
  cash: <><rect x='3' y='6' width='18' height='12' rx='2.5' /><circle cx='12' cy='12' r='2.5' /></>,
  exchange: <><path d='M4 9h13l-3-3' /><path d='M20 15H7l3 3' /></>,
}

// Main photo: the frame takes the photo's own shape (read when it loads), so the whole flower is shown
// with no cropping and no empty bands. Tall photos are capped to the screen height. Clicking opens the viewer.
const PhotoStage = ({ src, alt, badge, onOpen }) => {
  const [ratio, setRatio] = useState(4 / 5)
  return (
    <button
      type='button'
      onClick={onOpen}
      aria-label={`View ${alt} full screen`}
      style={{ aspectRatio: ratio, width: `calc(min(72vh, 680px) * ${ratio})` }}
      className='group relative mx-auto lg:mx-0 block max-w-full lg:max-w-[min(100%,580px)] overflow-hidden rounded-[1.75rem] bg-blush/40 shadow-soft cursor-zoom-in'
    >
      <div key={src} className='absolute inset-0 animate-fade-up'>
        <img
          className='h-full w-full object-cover transition-transform duration-700 ease-petal group-hover:scale-[1.03]'
          src={src}
          alt={alt}
          onLoad={(e) => e.currentTarget.naturalHeight && setRatio(e.currentTarget.naturalWidth / e.currentTarget.naturalHeight)}
        />
      </div>
      {badge && <span className='tag absolute left-4 top-4 z-10'>{badge}</span>}
      {/* Expand hint: always visible on touch screens, revealed on hover elsewhere */}
      <span className='absolute bottom-4 right-4 z-10 flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-3.5 py-2 text-xs font-medium text-ink shadow-glass backdrop-blur-md transition-all duration-300 ease-petal sm:translate-y-1 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 sm:group-focus-visible:translate-y-0 sm:group-focus-visible:opacity-100'>
        <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round' className='h-4 w-4' aria-hidden='true'><path d='M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7' /></svg>
        View full screen
      </span>
    </button>
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
  const [tab, setTab] = useState('details')
  const [viewerIndex, setViewerIndex] = useState(null)

  useEffect(() => {
    const item = products.find(p => p._id === productId)
    setProductData(item || false)
    setImage(item?.image?.[0] || '')
    // Start on the base option (as pictured / a single stem) so the shown price is always real
    setSize(item ? getProductOptions(item)[0].label : '')
    setQuantity(1)
    setTab('details')
    setViewerIndex(null)
    window.scrollTo(0, 0)
  }, [productId, products])

  useDocumentTitle(productData ? productData.name : 'Product', productData ? productData.description : undefined)

  // Product structured data, so search results can show the price and availability
  useEffect(() => {
    if (!productData) return
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: productData.name,
      description: productData.description,
      image: productData.image,
      category: typeLabel(productData.subCategory),
      brand: { '@type': 'Brand', name: 'Florazon' },
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'BDT',
        lowPrice: optionPrice(productData, getProductOptions(productData)[0].label),
        highPrice: Math.max(...getProductOptions(productData).map((o) => optionPrice(productData, o.label))),
        availability: 'https://schema.org/InStock',
      },
    })
    document.head.appendChild(script)
    return () => script.remove()
  }, [productData])

  if (!productData) {
    return (
      <div>
        {productsStatus === 'loading' && (
          <div className='grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-8 lg:gap-14 pt-12' aria-label='Loading product'>
            <div className='skeleton aspect-[4/5] rounded-[1.75rem]' />
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
  const careTips = byStems ? CARE_TIPS.stems : CARE_TIPS[productData.subCategory] || CARE_TIPS.Bouquet

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

  const promises = [
    { icon: ICONS.truck, title: 'Delivered fresh', text: `${formatPrice(DELIVERY_FEE)} · arranged that day` },
    { icon: ICONS.cash, title: 'Cash on delivery', text: 'Pay when it arrives' },
    { icon: ICONS.exchange, title: '1-day exchange', text: 'Easy and hassle free' },
  ]

  const tabs = [
    { id: 'details', label: 'Details' },
    { id: 'delivery', label: 'Delivery & payment' },
    { id: 'care', label: 'Flower care' },
  ]

  const details = [
    ['Collection', typeLabel(productData.subCategory)],
    ['Category', categoryLabel(productData.category)],
    ['Arranged', 'By hand, on the day of delivery'],
  ]

  return (
    <div className='pt-4 sm:pt-6'>
      <nav aria-label='Breadcrumb' className='mb-6 flex min-w-0 items-center text-xs text-gray-500'>
        <Link to='/' className='shrink-0 transition-colors hover:text-brand'>Home</Link>
        <span className='mx-2 text-gray-300' aria-hidden='true'>/</span>
        <Link to='/collection' className='shrink-0 transition-colors hover:text-brand'>Collection</Link>
        <span className='mx-2 text-gray-300' aria-hidden='true'>/</span>
        <span className='truncate text-gray-700' aria-current='page'>{productData.name}</span>
      </nav>

      <div className='grid lg:grid-cols-[auto_minmax(0,1fr)] items-start gap-8 lg:gap-12 xl:gap-16'>
        {/* Gallery */}
        <div className='min-w-0 lg:sticky lg:top-24 animate-fade-up'>
          <PhotoStage src={imageUrl(image, 1000)} alt={productData.name} badge={productData.bestseller ? 'Bestseller' : null} onOpen={() => setViewerIndex(Math.max(0, images.indexOf(image)))} />
          {images.length > 1 && (
            <div className='mt-4 flex justify-center gap-3 overflow-x-auto p-1'>
              {images.map((item, index) => (
                <button
                  type='button'
                  key={item}
                  onClick={() => setImage(item)}
                  aria-label={`Show image ${index + 1}`}
                  aria-pressed={item === image}
                  className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-blush/40 ring-2 ring-offset-2 ring-offset-canvas transition-all duration-300 ${item === image ? 'ring-ink' : 'ring-transparent opacity-70 hover:opacity-100'}`}
                >
                  <img src={imageUrl(item, 160)} className='h-full w-full object-cover' alt='' />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product information */}
        <div className='min-w-0 animate-fade-up [animation-delay:120ms]'>
          <p className='eyebrow'>{typeLabel(productData.subCategory)} &middot; {categoryLabel(productData.category)}</p>
          <h1 className='mt-3 font-display text-[1.9rem] sm:text-[2.25rem] xl:text-[2.5rem] leading-[1.12] text-ink'>{productData.name}</h1>

          <div className='mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1'>
            <p className='font-display text-[1.75rem] leading-none text-brand' aria-live='polite'>{formatPrice(unitPrice)}</p>
            <p className='text-xs text-gray-500'>for {size} &middot; plus {formatPrice(DELIVERY_FEE)} delivery</p>
          </div>

          <p className='mt-5 max-w-prose text-[15px] text-gray-600 leading-relaxed'>{productData.description}</p>

          {/* Options */}
          <div className='mt-7'>
            <div className='mb-3 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1'>
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
                    className={`relative flex min-w-0 flex-col items-start rounded-2xl border px-3 py-2.5 sm:px-4 text-left transition-all duration-300 ease-petal ${selected ? 'border-ink bg-white shadow-soft' : 'border-line bg-white/60 hover:border-gray-400 hover:bg-white'}`}
                  >
                    <span aria-hidden='true' className={`absolute right-2.5 top-3 sm:right-3 flex h-4 w-4 items-center justify-center rounded-full border-2 transition-colors ${selected ? 'border-ink' : 'border-gray-300'}`}>
                      <span className={`h-2 w-2 rounded-full bg-ink transition-transform duration-300 ${selected ? 'scale-100' : 'scale-0'}`} />
                    </span>
                    <span className='pr-5 text-sm font-medium text-ink'>{option.label}</span>
                    <span className={`text-sm ${selected ? 'text-brand font-medium' : 'text-gray-600'}`}>{formatPrice(optionPrice(productData, option.label))}</span>
                    <span className='mt-1 hidden sm:block text-[11px] leading-snug text-gray-500'>{option.detail}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Quantity and actions */}
          <div className='mt-6 flex flex-col gap-3'>
            <div className='flex gap-3'>
              <QuantityStepper value={quantity} onChange={setQuantity} />
              <button type='button' onClick={() => addSelection()} className='btn-primary h-12 flex-1 px-5'>
                Add to cart <span className='font-normal opacity-70'>&middot;</span> {formatPrice(lineTotal)}
              </button>
            </div>
            <button type='button' onClick={() => addSelection(true)} className='btn-outline h-12 w-full'>Buy now</button>
          </div>

          {/* Promises */}
          <ul className='mt-6 grid grid-cols-3 divide-x divide-line/80 rounded-2xl border border-line/80 bg-white/50'>
            {promises.map((item) => (
              <li key={item.title} className='flex flex-col items-center gap-1.5 px-2 py-4 text-center'>
                <span className='flex h-9 w-9 items-center justify-center rounded-full bg-blush/60 text-brand'><Icon d={item.icon} /></span>
                <span className='text-xs sm:text-[13px] font-medium text-ink leading-tight'>{item.title}</span>
                <span className='text-[11px] text-gray-500 leading-tight'>{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Product information tabs */}
      <Reveal as='section' className='mt-16 lg:mt-20'>
        <div role='tablist' aria-label='Product information' className='flex gap-6 sm:gap-10 overflow-x-auto border-b border-line [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
          {tabs.map((t) => (
            <button
              key={t.id}
              type='button'
              role='tab'
              id={`tab-${t.id}`}
              aria-selected={tab === t.id}
              aria-controls={`panel-${t.id}`}
              onClick={() => setTab(t.id)}
              className={`relative shrink-0 whitespace-nowrap pb-4 text-sm sm:text-[15px] transition-colors after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:rounded-full after:bg-ink after:transition-transform after:duration-300 ${tab === t.id ? 'font-medium text-ink after:scale-x-100' : 'text-gray-500 hover:text-ink after:scale-x-0'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div key={tab} role='tabpanel' id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} className='animate-fade-up py-8 grid gap-8 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:gap-14'>
          {tab === 'details' && (
            <>
              <div>
                <h2 className='font-display text-2xl text-ink'>About this <span className='text-brand'>{byStems ? 'stem' : typeLabel(productData.subCategory).toLowerCase()}</span></h2>
                <p className='mt-3 text-[15px] text-gray-600 leading-relaxed'>
                  {byStems
                    ? 'Each stem is chosen for freshness and wrapped by hand on the day of delivery.'
                    : 'The Standard option is the arrangement pictured. Deluxe and Premium are made in the same style with more blooms.'}
                </p>
              </div>
              <dl className='self-start divide-y divide-line/80 rounded-2xl border border-line/80 bg-white/60 px-5 text-sm'>
                {details.map(([term, value]) => (
                  <div key={term} className='flex items-start justify-between gap-6 py-3.5'>
                    <dt className='shrink-0 text-gray-500'>{term}</dt>
                    <dd className='text-right text-ink'>{value}</dd>
                  </div>
                ))}
              </dl>
            </>
          )}
          {tab === 'delivery' && (
            <>
              <div>
                <h2 className='font-display text-2xl text-ink'>Delivery <span className='text-brand'>&amp; payment</span></h2>
                <p className='mt-3 text-[15px] text-gray-600 leading-relaxed'>Every order is arranged by hand on the day it is delivered, so it reaches you at its freshest. Pay in cash when your flowers arrive.</p>
              </div>
              <ul className='self-start flex flex-col gap-3 text-sm'>
                {[
                  ['Delivery fee', `${formatPrice(DELIVERY_FEE)} per order`],
                  ['Payment', 'Cash on delivery'],
                  ['Exchange', 'Easy exchange within 1 day'],
                ].map(([term, value]) => (
                  <li key={term} className='flex items-center justify-between gap-6 rounded-2xl border border-line/80 bg-white/60 px-5 py-3.5'>
                    <span className='text-gray-500'>{term}</span>
                    <span className='text-right text-ink'>{value}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
          {tab === 'care' && (
            <>
              <div>
                <h2 className='font-display text-2xl text-ink'>Keep it <span className='text-brand'>fresh</span></h2>
                <p className='mt-3 text-[15px] text-gray-600 leading-relaxed'>A little care helps your flowers last longer and look their best.</p>
              </div>
              <ol className='self-start flex flex-col gap-3'>
                {careTips.map((tip, i) => (
                  <li key={tip} className='flex items-start gap-4 rounded-2xl border border-line/80 bg-white/60 px-5 py-4 text-sm text-gray-600 leading-relaxed'>
                    <span className='flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blush/70 font-display text-sm text-brand'>{i + 1}</span>
                    {tip}
                  </li>
                ))}
              </ol>
            </>
          )}
        </div>
      </Reveal>

      <RelatedProducts category={productData.category} subCategory={productData.subCategory} currentId={productData._id} />

      {viewerIndex !== null && images.length > 0 && (
        <Lightbox
          images={images.map((url) => imageUrl(url, 2400))}
          index={viewerIndex}
          alt={productData.name}
          onIndexChange={(i) => { setViewerIndex(i); setImage(images[i]) }}
          onClose={() => setViewerIndex(null)}
        />
      )}

      {/* Phones: price and add to cart stay within reach while scrolling (the footer leaves room for it) */}
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
