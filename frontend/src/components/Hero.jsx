import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'

const Hero = () => {
  return (
    <section className='flex flex-col sm:flex-row overflow-hidden rounded-lg border border-line bg-white/60 shadow-soft mt-2'>
      {/* Copy */}
      <div className='w-full sm:w-1/2 flex items-center justify-center py-12 sm:py-0'>
        <div className='text-[#414141] animate-fade-up'>
          <div className='flex items-center gap-2'>
            <span className='w-8 md:w-11 h-[2px] bg-[#414141]' aria-hidden='true'></span>
            <p className='font-medium text-sm md:text-base tracking-wide'>BEST BLOSSOMS</p>
          </div>
          <h1 className='prata-regular text-3xl sm:py-3 lg:text-5xl leading-relaxed'>JUST BLOOMED</h1>
          <div className='flex items-center gap-2'>
            <p className='font-semibold text-sm md:text-base tracking-wide'>UNWRAP LOVE</p>
            <span className='w-8 md:w-11 h-[1px] bg-[#414141]' aria-hidden='true'></span>
          </div>
          <Link to='/collection' className='btn-primary mt-7 px-7'>SHOP THE COLLECTION</Link>
        </div>
      </div>

      {/* Image */}
      <div className='w-full sm:w-1/2 overflow-hidden'>
        <img
          className='w-full h-full object-cover transition-transform duration-[1.2s] ease-out hover:scale-[1.03]'
          src={assets.hero_img}
          alt="Sunflower bouquet with white roses"
          width={1472}
          height={982}
          fetchPriority='high'
        />
      </div>
    </section>
  )
}

export default Hero
