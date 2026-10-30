import React, { useState } from 'react'
import { toast } from 'react-toastify'

const NewsletterBox = () => {
  const [email, setEmail] = useState('')

  const onSubmitHandler = (event) => {
    event.preventDefault()
    toast.success('Thanks for subscribing!')
    setEmail('')
  }

  return (
    <section className='panel text-center px-6 py-14 sm:py-16'>
      <p className='eyebrow'>Newsletter</p>
      <h2 className='mt-3 text-2xl font-medium text-ink'>A bloom of savings: 20% off when you subscribe.</h2>
      <p className='text-gray-500 mt-3'>Be the first to smell what&apos;s new.</p>
      <form onSubmit={onSubmitHandler} className='w-full sm:w-3/4 lg:w-1/2 flex flex-col sm:flex-row items-stretch gap-3 mx-auto mt-8'>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-label='Email address'
          className='field sm:flex-1'
          type="email"
          placeholder='Enter your email'
          required
        />
        <button type='submit' className='btn-primary text-xs px-10'>SUBSCRIBE</button>
      </form>
    </section>
  )
}

export default NewsletterBox
