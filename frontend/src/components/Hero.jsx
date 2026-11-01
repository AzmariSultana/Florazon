import React, { useContext, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'
import { SUB_CATEGORIES } from '../constants'
import { formatPrice, imageUrl } from '../utils/format'

// The basket in the hero image is a real product; its card links straight to it
const PICTURED = 'Rose Abundance Basket'

const Hero = () => {
  const { products } = useContext(ShopContext)
  const pictured = useMemo(() => products.find((item) => item.name === PICTURED), [products])

  // Real figures and a few real photos from the catalogue, shown as a quiet line of proof
  const collections = useMemo(() => SUB_CATEGORIES.filter((type) => products.some((item) => item.subCategory === type)).length, [products])
  const thumbs = useMemo(() => products.filter((item) => item.bestseller && item.name !== PICTURED).slice(0, 3), [products])

  return (
    // Copy on the left, two cut-out arrangements on soft halos on the right
    <section className='relative grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] items-center gap-10 lg:gap-8 pt-6 pb-4 lg:py-10'>
      {/* Copy */}
      <div className='relative z-10 animate-fade-up'>
        <span className='tag'>
          <span className='h-1.5 w-1.5 rounded-full bg-brand' aria-hidden='true' />
          Hand-tied in Dhaka
        </span>
        <h1 className='mt-6 font-display text-[2.5rem] leading-[1.08] sm:text-[3.25rem] xl:text-[3.9rem] text-ink'>
          Just bloomed,<br />
          <span className='text-brand'>unwrap love.</span>
        </h1>
        <p className='mt-5 max-w-md text-base sm:text-lg text-gray-600 leading-relaxed'>
          Fresh flowers, arranged by hand and delivered to your door, for every feeling worth sending.
        </p>
        <div className='mt-8 flex flex-wrap items-center gap-3'>
          <Link to='/collection' className='btn-primary group px-7'>
            Shop the collection
            <span aria-hidden='true' className='transition-transform duration-300 group-hover:translate-x-1'>&rarr;</span>
          </Link>
          <Link to='/about' className='btn-outline px-7'>Our story</Link>
        </div>

        {products.length > 0 && (
          <Link to='/collection' className='group mt-9 inline-flex items-center gap-4'>
            <span className='flex -space-x-3'>
              {thumbs.map((item) => (
                <img key={item._id} src={imageUrl(item.image?.[0], 120)} alt='' className='h-10 w-10 rounded-full border-2 border-canvas object-cover shadow-soft transition-transform duration-300 group-hover:-translate-y-0.5' />
              ))}
            </span>
            <span className='text-sm leading-snug text-gray-600'>
              <span className='font-medium text-ink'>{products.length} hand-tied designs</span><br />
              across {collections} collections
            </span>
          </Link>
        )}
      </div>

      {/* Two arrangements on soft halos: the rose basket large at the back, the heart flower box smaller in
          front reaching toward the copy, and the pictured product's card under the basket */}
      <div className='relative mx-auto w-full max-w-[480px] sm:max-w-[560px] lg:max-w-[640px]'>
        <div aria-hidden='true' className='pointer-events-none absolute left-[10%] top-[5%] h-1/2 aspect-square rounded-full bg-blush blur-3xl opacity-80' />
        <div aria-hidden='true' className='pointer-events-none absolute right-0 bottom-0 h-2/5 aspect-square rounded-full bg-sage-soft blur-3xl' />
        <div className='relative aspect-[1.12/1]'>
          {/* Main: rose basket */}
          <div className='absolute right-0 top-0 w-[74%] aspect-square'>
            <div aria-hidden='true' className='absolute inset-[4%] rounded-full bg-gradient-to-br from-blush via-cream to-sage-soft border border-white/80 shadow-[inset_0_2px_0_rgba(255,255,255,0.8),0_30px_60px_-30px_rgba(60,40,45,0.25)]' />
            <img
              className='absolute left-1/2 top-1/2 w-[88%] -translate-x-1/2 -translate-y-1/2 [filter:drop-shadow(0_26px_30px_rgba(60,40,45,0.22))]'
              src={assets.hero_basket}
              alt='Pink roses, white chrysanthemums and gypsophila in a handled wicker basket'
              width={710}
              height={656}
              fetchPriority='high'
            />
          </div>
          {/* Accent: heart flower box, overlapping the main halo */}
          <div className='absolute left-0 bottom-[2%] w-[44%] aspect-square'>
            <div aria-hidden='true' className='absolute inset-[6%] rounded-full bg-gradient-to-br from-cream via-blush to-blush border border-white/80 shadow-[inset_0_2px_0_rgba(255,255,255,0.8),0_24px_48px_-24px_rgba(60,40,45,0.3)]' />
            <img
              className='absolute left-1/2 top-1/2 w-[90%] -translate-x-1/2 -translate-y-1/2 [filter:drop-shadow(0_18px_22px_rgba(60,40,45,0.22))]'
              src={assets.hero_accent}
              alt='Pink carnations, lavender roses and daisies in a pink heart-shaped box'
              width={622}
              height={559}
            />
          </div>
          {pictured && (
            <Link
              to={`/product/${pictured._id}`}
              className='group absolute right-[4%] bottom-0 flex items-center gap-3 rounded-2xl border border-white/70 bg-white/75 py-2.5 pl-4 pr-3 shadow-glass backdrop-blur-xl transition-colors duration-500 hover:bg-white/90'
            >
              <span>
                <span className='eyebrow block text-[10px]'>Pictured</span>
                <span className='block whitespace-nowrap text-sm font-medium text-ink'>{pictured.name}</span>
                <span className='block text-xs text-brand'>from {formatPrice(pictured.price)}</span>
              </span>
              <span aria-hidden='true' className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-sm text-white transition-transform duration-300 group-hover:translate-x-0.5'>&rarr;</span>
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}

export default Hero
