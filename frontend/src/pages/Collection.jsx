import React, { useContext, useMemo, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets'
import Title from '../components/Title'
import ProductItem from '../components/ProductItem'
import { CATEGORIES, SUB_CATEGORIES } from '../constants'
import StatusMessage, { LOAD_ERROR_TEXT } from '../components/StatusMessage'
import { ProductGridSkeleton } from '../components/ProductGrid'
import useDocumentTitle from '../utils/useDocumentTitle'

const SORT_OPTIONS = [
  { value: 'relevant', label: 'Sort by: Relevant' },
  { value: 'low-high', label: 'Sort by: Low to High' },
  { value: 'high-low', label: 'Sort by: High to Low' },
]

const toggle = (list, value) => (list.includes(value) ? list.filter((item) => item !== value) : [...list, value])

const FilterGroup = ({ title, options, selected, onToggle, open, className = '' }) => (
  <fieldset className={`panel px-5 py-4 ${open ? '' : 'hidden'} sm:block ${className}`}>
    <legend className='sr-only'>{title}</legend>
    <p className='eyebrow mb-3' aria-hidden='true'>{title}</p>
    <div className='flex flex-col gap-2.5 text-sm text-gray-600'>
      {options.map((option) => (
        <label key={option} className='flex items-center gap-2.5 cursor-pointer transition-colors hover:text-ink'>
          <input className='w-3.5 h-3.5 accent-[#2b2b2b] cursor-pointer' type='checkbox' value={option} checked={selected.includes(option)} onChange={() => onToggle(option)} />
          {option}
        </label>
      ))}
    </div>
  </fieldset>
)

const Collection = () => {
  const { products, productsStatus, search, showSearch } = useContext(ShopContext)
  useDocumentTitle('Collection')
  const [showFilter, setShowFilter] = useState(false)
  const [category, setCategory] = useState([])
  const [subCategory, setSubCategory] = useState([])
  const [sortType, setSortType] = useState('relevant')

  // Filtering and sorting are derived together so a sort survives filter/search changes
  const filterProducts = useMemo(() => {
    let productsCopy = products.slice()

    if (showSearch && search) {
      productsCopy = productsCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
    }
    if (category.length > 0) {
      productsCopy = productsCopy.filter(item => category.includes(item.category))
    }
    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter(item => subCategory.includes(item.subCategory))
    }

    switch (sortType) {
      case 'low-high':
        return productsCopy.sort((a, b) => a.price - b.price)
      case 'high-low':
        return productsCopy.sort((a, b) => b.price - a.price)
      default:
        return productsCopy
    }
  }, [products, search, showSearch, category, subCategory, sortType])

  return (
    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>
      {/* Filter Options */}
      <aside className='min-w-60 sm:sticky sm:top-24 sm:self-start'>
        <button type='button' onClick={() => setShowFilter(!showFilter)} aria-expanded={showFilter} className='my-2 text-xl flex items-center gap-2 tracking-wide'>
          FILTERS
          <img className={`h-3 sm:hidden transition-transform ${showFilter ? 'rotate-90' : ''}`} src={assets.dropdown_icon} alt="" />
        </button>
        <FilterGroup title='CATEGORIES' options={CATEGORIES} selected={category} onToggle={(v) => setCategory(prev => toggle(prev, v))} open={showFilter} className='mt-6' />
        <FilterGroup title='TYPE' options={SUB_CATEGORIES} selected={subCategory} onToggle={(v) => setSubCategory(prev => toggle(prev, v))} open={showFilter} className='my-5' />
      </aside>

      {/* Products */}
      <div className='flex-1'>
        <div className='flex flex-wrap items-start justify-between gap-3 text-base sm:text-2xl mb-4'>
          <Title as='h1' text1={'ALL'} text2={'COLLECTIONS'} />
          <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
            aria-label='Sort products'
            className='field w-auto py-2 pr-8 cursor-pointer'
          >
            {SORT_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </div>

        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-8'>
          {filterProducts.map((item) => (
            <ProductItem key={item._id} name={item.name} id={item._id} price={item.price} image={item.image} />
          ))}
        </div>

        {productsStatus === 'loading' && <ProductGridSkeleton count={8} className='grid-cols-2 md:grid-cols-3 lg:grid-cols-4' />}
        {productsStatus === 'error' && <StatusMessage retry>{LOAD_ERROR_TEXT}</StatusMessage>}
        {productsStatus === 'ready' && filterProducts.length === 0 && <StatusMessage>No products match your filters.</StatusMessage>}
      </div>
    </div>
  )
}

export default Collection
