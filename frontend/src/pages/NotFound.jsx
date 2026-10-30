import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className='border-t flex flex-col items-center text-center gap-4 py-24'>
      <p className='prata-regular text-5xl text-gray-800'>404</p>
      <p className='text-gray-600'>This page has wilted away. Let&apos;s get you back to the garden.</p>
      <Link to='/' className='bg-black text-white text-sm px-8 py-3 mt-2'>BACK TO HOME</Link>
    </div>
  )
}

export default NotFound
