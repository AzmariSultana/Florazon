import React, { useContext, useMemo, useState } from 'react'
import {ShopContext} from '../context/ShopContext'
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';



const Collection = () => {
  const {products, search, showSearch}= useContext(ShopContext);
  const [showFilter, setShowFilter]= useState(false);
  const [category,setCategory]= useState([]);
  const[subCategory, setSubCategory]= useState([]);
  const [sortType, setSortType]= useState('relevant')

  const toggleCategory= (e) => {
    if (category.includes(e.target.value)){
      setCategory(prev=> prev.filter(item=> item!==e.target.value))
    }
    else{
      setCategory(prev=> [...prev,e.target.value])
    }
  }
  const toggleSubCategory=(e)=>{
    if (subCategory.includes(e.target.value)){
      setSubCategory(prev=>prev.filter(item=> item!==e.target.value))
    }
    else{
      setSubCategory(prev=> [...prev,e.target.value])
    }
  }

  // Filtering and sorting are derived together so a sort survives filter/search changes
  const filterProducts = useMemo(()=> {
    let productsCopy= products.slice();

    if (showSearch && search){
      productsCopy= productsCopy.filter(item=> item.name.toLowerCase().includes(search.toLowerCase()))
    }

    if (category.length > 0){
      productsCopy= productsCopy.filter(item=> category.includes(item.category));
    }
    if (subCategory.length > 0){
      productsCopy= productsCopy.filter(item=> subCategory.includes(item.subCategory));
    }

    switch (sortType){
      case 'low-high':
        return productsCopy.sort((a,b)=>(a.price -b.price));
      case 'high-low':
        return productsCopy.sort((a,b)=>(b.price -a.price));
      default:
        return productsCopy;
    }
  },[products, search, showSearch, category, subCategory, sortType])

  return (
    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>
      {/* Filter Options */}
      <div className='min-w-60'>
        <button type='button' onClick={()=>setShowFilter(!showFilter)} aria-expanded={showFilter} className='my-2 text-xl flex items-center gap-2'>FILTERS
          <img className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`} src={assets.dropdown_icon} alt=""/>
        </button>
        {/* Category Filter */}
        <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ?'' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>CATEGORIES</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            <label className='flex gap-2 cursor-pointer'>
              <input className='w-3' type="checkbox" value={'Occasion'} onChange={toggleCategory}/> Occasion
            </label>
            <label className='flex gap-2 cursor-pointer'>
              <input className='w-3' type="checkbox" value={'Gift-Type'} onChange={toggleCategory}/> Gift-Type
            </label>

          </div>

        </div>
        {/* SubCategory Filter */}
        <div className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter ?'' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>TYPE</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            <label className='flex gap-2 cursor-pointer'>
              <input className='w-3' type="checkbox" value={'Single-Flower'} onChange={toggleSubCategory}/> Single-Flower
            </label>
            <label className='flex gap-2 cursor-pointer'>
              <input className='w-3' type="checkbox" value={'Bouquet'} onChange={toggleSubCategory}/> Bouquet
            </label>
            <label className='flex gap-2 cursor-pointer'>
              <input className='w-3' type="checkbox" value={'Garland'} onChange={toggleSubCategory}/> Garland
            </label>
            <label className='flex gap-2 cursor-pointer'>
              <input className='w-3' type="checkbox" value={'Basket'} onChange={toggleSubCategory}/> Basket
            </label>

          </div>

        </div>
        

      </div>
      {/*Right Side*/}
      <div className='flex-1'>
        <div className='flex justify-between text-base sm:text-2xl mb-4'>
          <Title text1={'ALL'} text2={'COLLECTIONS'} />
          {/*Product Sort*/}
          <select value={sortType} onChange={(e)=>setSortType(e.target.value)} aria-label='Sort products'
          className='border-2 border-gray-300 text-sm px-2'>
            <option value="relevant">Sort by: Relevant</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>

        </div>
        {/* Map Products */}
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
          {
            filterProducts.map((item)=>(
              <ProductItem key={item._id} name={item.name} id={item._id} price={item.price} image={item.image} />
            ))
          }

        </div>
        {filterProducts.length === 0 && (
          <p className='text-center text-gray-500 py-20'>No products match your filters.</p>
        )}
      </div>
    </div>
  )
}

export default Collection