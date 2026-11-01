import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets'
import Title from '../components/Title'
import ProductGrid, { ProductGridSkeleton } from '../components/ProductGrid'
import { CATEGORIES, SUB_CATEGORIES, TYPES, categoryLabel } from '../constants'
import StatusMessage, { LOAD_ERROR_TEXT } from '../components/StatusMessage'
import useDocumentTitle from '../utils/useDocumentTitle'

const SORT_OPTIONS = [
  { value: 'relevant', label: 'Sort: Relevant' },
  { value: 'low-high', label: 'Price: Low to High' },
  { value: 'high-low', label: 'Price: High to Low' },
]

const GRID_COLUMNS = 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'

// Pill-shaped select matching the type tabs
const PillSelect = ({ label, value, onChange, children }) => (
  <div className='relative flex-1 sm:flex-none'>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={label}
      className='h-11 w-full appearance-none rounded-full border border-white/80 bg-white/70 pl-5 pr-10 text-sm text-ink shadow-glass backdrop-blur-md cursor-pointer outline-none transition-colors hover:bg-white focus-visible:ring-2 focus-visible:ring-brand'
    >
      {children}
    </select>
    <img src={assets.dropdown_icon} alt='' className='pointer-events-none absolute right-4 top-1/2 h-2.5 -translate-y-1/2 rotate-90 opacity-60' />
  </div>
)

const Collection = () => {
  const { products, productsStatus, search, showSearch } = useContext(ShopContext)
  const location = useLocation()
  useDocumentTitle('Collection')
  const [category, setCategory] = useState('')
  // Category tiles on the home page and footer links arrive with a type already chosen
  const [type, setType] = useState(() => location.state?.subCategory || '')
  const [sortType, setSortType] = useState('relevant')

  // Links that arrive while this page is already open (e.g. from the footer) start a fresh view of their type
  useEffect(() => {
    if (location.state && 'subCategory' in location.state) {
      setType(location.state.subCategory || '')
      setCategory('')
    }
  }, [location.state])

  // Filtering and sorting are derived together so a sort survives filter/search changes
  const filterProducts = useMemo(() => {
    let productsCopy = products.slice()

    if (showSearch && search) {
      productsCopy = productsCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
    }
    if (category) productsCopy = productsCopy.filter(item => item.category === category)
    if (type) productsCopy = productsCopy.filter(item => item.subCategory === type)

    switch (sortType) {
      case 'low-high':
        return productsCopy.sort((a, b) => a.price - b.price)
      case 'high-low':
        return productsCopy.sort((a, b) => b.price - a.price)
      default:
        return productsCopy
    }
  }, [products, search, showSearch, category, type, sortType])

  const filtered = Boolean(category || type)
  const clearFilters = () => { setCategory(''); setType('') }

  // Tabs show how many designs each type holds; a chosen type also sets the page heading
  const typeCounts = useMemo(() => Object.fromEntries(SUB_CATEGORIES.map((t) => [t, products.filter((item) => item.subCategory === t).length])), [products])
  const tabs = [{ value: '', label: 'All', count: products.length }, ...SUB_CATEGORIES.filter((t) => typeCounts[t] > 0).map((t) => ({ value: t, label: TYPES[t].label, count: typeCounts[t] }))]
  const [headingStart, headingEnd] = type ? ['SHOP', TYPES[type].plural] : ['ALL', 'COLLECTIONS']

  return (
    <div className='pt-6 sm:pt-10'>
      <Title
        key={type || 'all'}
        as='h1'
        eyebrow='Shop'
        text1={headingStart}
        text2={headingEnd}
        size='text-4xl sm:text-5xl'
        subtitle={type ? TYPES[type].note : 'Single flowers, mixed bouquets, garlands and baskets, arranged by hand.'}
      />

      {/* One toolbar: type tabs on the left, category and sort on the right */}
      <div className='flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between'>
        <nav aria-label='Flower types' className='-mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
          <div className='inline-flex gap-1 rounded-full border border-white/80 bg-white/55 p-1 shadow-glass backdrop-blur-md'>
            {tabs.map((tab) => {
              const active = tab.value === type
              return (
                <button
                  key={tab.label}
                  type='button'
                  aria-pressed={active}
                  onClick={() => setType(tab.value)}
                  className={`flex h-9 shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-4 sm:px-5 text-sm transition-all duration-300 ease-petal ${active ? 'bg-ink text-white shadow-soft' : 'text-gray-600 hover:bg-white hover:text-ink'}`}
                >
                  {tab.label}
                  <span className={`rounded-full px-1.5 py-0.5 text-[10px] leading-none ${active ? 'bg-white/20 text-white' : 'bg-blush/70 text-gray-600'}`}>{tab.count}</span>
                </button>
              )
            })}
          </div>
        </nav>

        <div className='flex gap-2'>
          <PillSelect label='Filter by category' value={category} onChange={setCategory}>
            <option value=''>All categories</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{categoryLabel(c)}</option>)}
          </PillSelect>
          <PillSelect label='Sort products' value={sortType} onChange={setSortType}>
            {SORT_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </PillSelect>
        </div>
      </div>

      <div className='mt-6 mb-6 flex items-center justify-between gap-3 border-b border-line/80 pb-4 text-sm'>
        <p className='text-gray-500' aria-live='polite'>
          {productsStatus === 'ready' && (
            <>
              Showing <span className='font-medium text-ink'>{filterProducts.length}</span> {filterProducts.length === 1 ? 'design' : 'designs'}
              {category && <> in <span className='text-ink'>{categoryLabel(category)}</span></>}
            </>
          )}
        </p>
        {filtered && <button type='button' onClick={clearFilters} className='btn-link text-xs'>Clear filters</button>}
      </div>

      {productsStatus === 'ready' && <ProductGrid key={`${sortType}-${category}-${type}`} products={filterProducts} className={GRID_COLUMNS} />}
      {productsStatus === 'loading' && <ProductGridSkeleton count={8} className={GRID_COLUMNS} />}
      {productsStatus === 'error' && <StatusMessage retry>{LOAD_ERROR_TEXT}</StatusMessage>}
      {productsStatus === 'ready' && filterProducts.length === 0 && (
        <div className='panel py-16 text-center'>
          <p className='font-display text-2xl text-ink'>No flowers match these filters.</p>
          <p className='mt-2 text-sm text-gray-500'>Try another category or search for something else.</p>
          {filtered && <button type='button' onClick={clearFilters} className='btn-outline mt-6'>Clear filters</button>}
        </div>
      )}
    </div>
  )
}

export default Collection
