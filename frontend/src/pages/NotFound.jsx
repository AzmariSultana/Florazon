import React from 'react'
import { Link } from 'react-router-dom'
import useDocumentTitle from '../utils/useDocumentTitle'

const NotFound = () => {
  useDocumentTitle('Page not found')
  return (
    <div className='panel mt-6 flex flex-col items-center text-center gap-4 py-24 px-6'>
      <h1 className='font-display text-7xl text-brand'>404</h1>
      <p className='text-gray-600'>This page has wilted away. Let&apos;s get you back to the garden.</p>
      <Link to='/' className='btn-primary mt-2'>Back to home</Link>
    </div>
  )
}

export default NotFound
