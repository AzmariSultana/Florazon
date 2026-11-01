import React, { useContext, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets'
import { typeLabel } from '../constants'
import { formatPrice } from '../utils/format'
import Reveal from './Reveal'
import Title from './Title'

// Florist's picks shown large, each with a cut-out photo that sits straight on the page.
// "Discover" opens the product page, which shows the full photo and similar flowers.
const PICKS = [
  {
    name: 'Crimson Lily & Rose Bouquet',
    image: assets.showcase_bouquet,
    width: 709,
    height: 901,
    title: ['Romance,', 'hand-tied'],
    text: 'Deep red roses and white lilies in crimson wrap, the classic way to say I love you.',
  },
  {
    name: 'Lily & Rose Hatbox',
    image: assets.showcase_hatbox,
    width: 636,
    height: 755,
    title: ['A keepsake', 'gift box'],
    text: 'Pink lilies and red roses arranged in a white hatbox, ready to display the moment it arrives.',
  },
]

const SignatureShowcase = () => {
  const { products } = useContext(ShopContext)
  const picks = useMemo(
    () => PICKS.map((pick) => ({ ...pick, product: products.find((p) => p.name === pick.name) })).filter((pick) => pick.product),
    [products]
  )

  if (picks.length === 0) return null

  return (
    <section className='relative mt-28'>
      <div className='relative'>
        <Title
          align='center'
          eyebrow="Florist's picks"
          text1={'SIGNATURE'}
          text2={'ARRANGEMENTS'}
          subtitle='Two designs our florists are proudest of, made fresh to order and finished by hand.'
        />

        <div className='relative mt-14 flex flex-col gap-20 lg:gap-12'>

          {picks.map((pick, i) => {
            const flip = i % 2 === 1
            return (
              <Reveal key={pick.name} className='grid items-center gap-8 md:grid-cols-2 md:gap-10'>
                {/* Photo: cut-out flower on a soft halo, blending into the page */}
                <Link
                  to={`/product/${pick.product._id}`}
                  aria-label={`Discover ${pick.product.name}`}
                  className={`group relative mx-auto block w-full max-w-[420px] ${flip ? 'md:order-2' : ''}`}
                >
                  <div aria-hidden='true' className='absolute left-1/2 top-[52%] aspect-square w-[88%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-blush via-cream to-sage-soft opacity-90 transition-transform duration-700 ease-petal group-hover:scale-105' />
                  <img
                    src={pick.image}
                    alt={pick.product.name}
                    width={pick.width}
                    height={pick.height}
                    loading='lazy'
                    decoding='async'
                    className='relative mx-auto h-auto w-[78%] [filter:drop-shadow(0_24px_28px_rgba(60,40,45,0.2))] transition-transform duration-700 ease-petal group-hover:-translate-y-2 group-hover:rotate-[-1.5deg]'
                  />
                </Link>

                {/* Copy */}
                <div className={`text-center md:text-left ${flip ? 'md:order-1 md:pl-[8%]' : 'md:pl-4'}`}>
                  <p className='eyebrow'>{String(i + 1).padStart(2, '0')} &middot; {typeLabel(pick.product.subCategory)}</p>
                  <h3 className='mt-4 font-display text-[2rem] sm:text-[2.6rem] leading-[1.1] text-ink'>
                    {pick.title[0]}<br /><span className='text-brand'>{pick.title[1]}</span>
                  </h3>
                  <p className='mx-auto md:mx-0 mt-4 max-w-sm text-[15px] leading-relaxed text-gray-600'>{pick.text}</p>
                  <p className='mt-4 text-sm text-gray-500'>{pick.product.name} &middot; <span className='font-medium text-ink'>from {formatPrice(pick.product.price)}</span></p>
                  <Link
                    to={`/product/${pick.product._id}`}
                    className='group mt-7 inline-flex items-center gap-2 border-b border-ink/70 pb-1 text-sm font-medium text-ink transition-colors hover:border-brand hover:text-brand'
                  >
                    Discover
                    <span aria-hidden='true' className='transition-transform duration-300 group-hover:translate-x-1'>&rarr;</span>
                  </Link>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default SignatureShowcase
