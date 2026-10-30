import React from 'react'
import { assets } from '../assets/assets'

const Navbar = ({ setToken }) => {
  return (
    <header className='sticky top-0 z-30 flex items-center py-2.5 px-[4%] justify-between bg-canvas/80 backdrop-blur-md border-b border-line'>
      <img className='w-[max(10%,80px)]' src={assets.logo} alt="Florazon admin" />
      <button
        type='button'
        onClick={() => setToken('')}
        className='border border-line bg-white text-ink px-5 py-2 sm:px-6 rounded-full text-xs sm:text-sm shadow-soft transition-all hover:border-gray-400 hover:shadow-lift'
      >
        Logout
      </button>
    </header>
  )
}

export default Navbar
