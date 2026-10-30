import React from 'react'
import { assets } from '../assets/assets'

const POLICIES = [
  { icon: assets.exchange_icon, title: 'Easy Exchange Policy', text: 'Easy exchange, no stress, no mess.' },
  { icon: assets.quality_icon, title: '1 Day Return Policy', text: 'One-day return, no cost, no care. Your joy is always fair.' },
  { icon: assets.support_img, title: 'Best Customer Support', text: "Day or night, we're just a message away." },
]

const OurPolicy = () => {
  return (
    <section className='grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-6 text-center py-20 text-xs sm:text-sm md:text-base text-gray-700'>
      {POLICIES.map((policy) => (
        <div key={policy.title} className='flex flex-col items-center px-4'>
          <div className='w-16 h-16 mb-5 rounded-full bg-white border border-line shadow-soft flex items-center justify-center'>
            <img src={policy.icon} className='w-8' alt="" />
          </div>
          <p className='font-semibold text-ink'>{policy.title}</p>
          <p className='text-gray-500 mt-1 max-w-[30ch]'>{policy.text}</p>
        </div>
      ))}
    </section>
  )
}

export default OurPolicy
