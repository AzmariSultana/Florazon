import React, { useState } from 'react'
import { toast } from 'react-toastify'

const NewsletterBox = () => {
    const [email, setEmail] = useState('')

    const onSubmitHandler= (event)=>{
        event.preventDefault();
        toast.success('Thanks for subscribing!')
        setEmail('')
    }
  return (
    <div className='text-center'>
        <p className='text-2xl font-medium text-gray-800'>A bloom of savings - 20% off when you subscribe.</p>
        <p className='text-gray-400 mt-3'>
        Be the first to smell what's new.
        </p>
        <form onSubmit={onSubmitHandler} className='w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3'>
            <input value={email} onChange={(e)=>setEmail(e.target.value)} aria-label='Email address' className='w-full sm:flex-1 outline-none' type="email" placeholder='Enter your email' required/>
            <button type='submit' className= 'bg-black text-white text-xs px-10 py-4'>SUBSCRIBE</button>
        </form>

    </div>
  )
}

export default NewsletterBox