import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { backendUrl } from '../config'
import { formatPrice, imageUrl } from '../utils'
import { toast } from 'react-toastify'

const List = ({token}) => {

  const [list,setList] =useState([])
  const [loading, setLoading] = useState(true)

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/list')
      if (response.data.success) {
        setList(response.data.products);
      }
      else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error)
      // 401s are handled globally in App (auto-logout)
      if (error.response?.status !== 401) toast.error(error.response?.data?.message || error.message)
    }

  }
  const removeProduct = async (id) => {
    if (!window.confirm('Remove this product? This cannot be undone.')) {
      return
    }
    try {
      const response = await axios.post(backendUrl + '/api/product/remove', {id} , {headers:{token}})

      if (response.data.success) {
        toast.success(response.data.message)
        await fetchList();
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      // 401s are handled globally in App (auto-logout)
      if (error.response?.status !== 401) toast.error(error.response?.data?.message || error.message)
    }
  }

  useEffect(()=>{
    fetchList().finally(() => setLoading(false))
  },[])

  return (
    <>
      <h1 className='mb-3 text-lg font-medium text-gray-800'>All Products <span className='text-sm font-normal text-gray-500'>({list.length})</span></h1>
      <div className='flex flex-col gap-2'>

        {loading && <p className='text-sm text-gray-500'>Loading products...</p>}
        {!loading && list.length === 0 && <p className='text-sm text-gray-500'>No products yet.</p>}

        {/*-------List Table Title-------*/}

        <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-2.5 px-3 rounded-md bg-white/60 border border-line text-xs uppercase tracking-wider text-gray-500'>
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className='text-center'>Action</b>
        </div>

        {/*------Product List------*/}
        {
          list.map((item)=> (
            <div className='grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-2 px-3 rounded-md border border-line bg-white text-sm transition-shadow hover:shadow-soft' key={item._id}>
              <img className='w-12 h-12 object-cover rounded-sm' src={imageUrl(item.image?.[0], 120)} alt={item.name} loading='lazy' />
              <p className='text-ink'>{item.name}</p>
              <p>{item.category}</p>
              <p>{formatPrice(item.price)}</p>
              <button type='button' onClick={()=>removeProduct(item._id)} aria-label={`Remove ${item.name}`} className='justify-self-end md:justify-self-center w-8 h-8 rounded-full text-lg leading-none transition-colors hover:bg-red-50 hover:text-red-600'>×</button>
            </div>
          ))
        }
      </div>
    </>
  )
}

export default List