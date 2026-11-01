import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets'
import { useLocation } from 'react-router-dom'

const SearchBar = () => {
  const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext)
  const location = useLocation()
  // The search bar only applies to the collection page
  const visible = location.pathname.includes('collection')

  if (!showSearch || !visible) return null

  return (
    <div className='flex items-center justify-center gap-2 pt-4 animate-fade-up'>
      <div className='relative w-full max-w-xl'>
        <img className='w-4 absolute left-5 top-1/2 -translate-y-1/2 opacity-60' src={assets.search_icon} alt="" />
        <input
          autoFocus
          aria-label='Search products'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='field rounded-full pl-12 py-3.5 border-white/80 bg-white/70 shadow-glass backdrop-blur-md'
          type="search"
          placeholder='Search bouquets, roses, lilies...'
        />
      </div>
      <button
        type='button'
        onClick={() => setShowSearch(false)}
        aria-label='Close search'
        className='icon-btn shrink-0'
      >
        <img className='w-3' src={assets.cross_icon} alt="" />
      </button>
    </div>
  )
}

export default SearchBar
