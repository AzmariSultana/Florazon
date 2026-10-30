import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { backendUrl, currency } from '../config'
import { toast } from 'react-toastify'

const List = ({token}) => {

  const [list,setList] =useState([])

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
    fetchList()
  },[])

  return (
    <>
      <p className='mb-2'>All Products List</p>
      <div className='flex flex-col gap-2'>

        {/*-------List Table Title-------*/}
        {list.length === 0 && <p className='text-sm text-gray-500'>No products yet.</p>}

        <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm'>
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className='text-center'>Action</b>
        </div>

        {/*------Product List------*/}
        {
          list.map((item)=> (
            <div className='grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm' key={item._id}>
              <img className='w-12' src={item.image?.[0]} alt={item.name} />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>{currency}{item.price}</p>
              <button type='button' onClick={()=>removeProduct(item._id)} aria-label={`Remove ${item.name}`} className='text-right md:text-center cursor-pointer text-lg'>X</button>
            </div>
          ))
        }
      </div>
    </>
  )
}

export default List