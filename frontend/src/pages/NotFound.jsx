import React from 'react'
import { Link } from 'react-router-dom'
import useDocumentTitle from '../utils/useDocumentTitle'

const NotFound = () => {
  useDocumentTitle('Page not found')
  return (
    <div className='border-t flex flex-col items-center text-center gap-4 py-24'>
      <h1 className='prata-regular text-5xl text-gray-800'>404</h1>
      <p className='text-gray-600'>This page has wilted away. Let&apos;s get you back to the garden.</p>
      <Link to='/' className='btn-primary mt-2'>BACK TO HOME</Link>
    </div>
  )
}

export default NotFound
