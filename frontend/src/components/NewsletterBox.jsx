import React, { useState } from 'react'
import { toast } from 'react-toastify'
import Blossom from './Blossom'

// Styled like the About page's mission panel: rose-to-sage wash, corner blossoms, centred serif lines
const NewsletterBox = () => {
  const [email, setEmail] = useState('')

  const onSubmitHandler = (event) => {
    event.preventDefault()
    toast.success('Thanks for subscribing!')
    setEmail('')
  }

  return (
    <section className='relative mt-24 overflow-hidden rounded-4xl bg-gradient-to-br from-blush via-cream to-sage-soft border border-white/80 px-4 sm:px-6 py-16 sm:py-20 text-center shadow-soft'>
      <Blossom className='absolute -left-6 -top-6 h-32 w-32 text-brand/40 rotate-12' />
      <Blossom className='absolute -right-8 -bottom-8 h-40 w-40 text-sage/40 -rotate-12' />
      <div className='relative'>
        <p className='eyebrow'>Newsletter</p>
        <h2 className='mt-6 font-display text-2xl sm:text-3xl leading-relaxed text-ink'>
          A bloom of savings:<br />
          <span className='text-brand'>20% off when you subscribe.</span>
        </h2>
        <p className='mt-3 text-sm sm:text-base text-gray-500'>Be the first to smell what&apos;s new.</p>
        <form onSubmit={onSubmitHandler} className='w-full max-w-md flex flex-col sm:flex-row items-stretch gap-2 mx-auto mt-8 sm:rounded-full sm:border sm:border-white/80 sm:bg-white/70 sm:p-1.5 sm:shadow-glass sm:backdrop-blur-md'>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-label='Email address'
            className='field rounded-full sm:flex-1 sm:border-transparent sm:bg-transparent sm:shadow-none sm:hover:border-transparent sm:focus:ring-0 sm:focus:border-transparent'
            type="email"
            placeholder='Enter your email'
            required
          />
          <button type='submit' className='btn-primary px-8 py-3'>Subscribe</button>
        </form>
        <Blossom className='mx-auto mt-8 h-6 w-6 text-brand' />
      </div>
    </section>
  )
}

export default NewsletterBox
