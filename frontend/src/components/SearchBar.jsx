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
    <div className='panel flex items-center justify-center gap-3 py-5 mb-2 animate-fade-up'>
      <div className='relative w-3/4 sm:w-1/2'>
        <img className='w-4 absolute left-4 top-1/2 -translate-y-1/2 opacity-60' src={assets.search_icon} alt="" />
        <input
          autoFocus
          aria-label='Search products'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='field rounded-full pl-11'
          type="search"
          placeholder='Search bouquets, roses, lilies...'
        />
      </div>
      <button
        type='button'
        onClick={() => setShowSearch(false)}
        aria-label='Close search'
        className='w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-white'
      >
        <img className='w-3' src={assets.cross_icon} alt="" />
      </button>
    </div>
  )
}

export default SearchBar
