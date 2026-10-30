import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import axios from 'axios';
import { formatPrice, imageUrl } from '../utils/format';
import useDocumentTitle from '../utils/useDocumentTitle'

// Dot colour for each delivery stage
const STATUS_DOT = {
  'Order Placed': 'bg-gray-400',
  'Packing': 'bg-amber-400',
  'Shipped': 'bg-sky-500',
  'Out for delivery': 'bg-brand',
  'Delivered': 'bg-green-500',
}

const Orders = () => {
  const { backendUrl, token, handleApiError }= useContext(ShopContext);
  useDocumentTitle('My Orders')

  const [orderData,setOrderData]= useState([])
  const [loading, setLoading] = useState(true)

  const loadOrderData = useCallback(async () => {
    if (!token) {
      setLoading(false)
      return
    }
    try {
      const response = await axios.post(backendUrl + '/api/order/userorders',{},{headers:{token}})
      if (response.data.success) {
        const allOrdersItem = []
        response.data.orders.forEach((order)=>{
          order.items.forEach((item)=>{
            allOrdersItem.push({
              ...item,
              status: order.status,
              payment: order.payment,
              paymentMethod: order.paymentMethod,
              date: order.date
            })
          })
        })
        setOrderData(allOrdersItem.reverse())
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      handleApiError(error)
    } finally {
      setLoading(false)
    }
  }, [backendUrl, token, handleApiError])

  useEffect(()=>{
    loadOrderData()
  },[loadOrderData])
  return (
    <div className='border-t pt-14'>
      <div className='text-2xl'>
        <Title as='h1' text1={'MY'} text2={'ORDERS'} />

      </div>
      {!token && (
        <p className='panel py-16 text-center text-gray-500'>Please <Link to='/login' state={{ from: '/orders' }} className='text-ink underline underline-offset-4'>log in</Link> to view your orders.</p>
      )}
      {token && !loading && orderData.length === 0 && (
        <div className='panel py-16 text-center text-gray-500'>
          <p className='text-ink font-medium'>You haven&apos;t placed any orders yet.</p>
          <Link to='/collection' className='btn-primary mt-6'>BROWSE COLLECTION</Link>
        </div>
      )}
      <ul className='flex flex-col gap-3 mt-2'>
        {orderData.map((item, index) => (
          <li key={index} className='card p-4 sm:p-5 text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4 transition-shadow hover:shadow-lift'>
            <div className='flex items-start gap-4 sm:gap-6 text-sm'>
              <img className='w-16 sm:w-20 aspect-[4/5] object-cover rounded-md bg-cream flex-shrink-0' src={imageUrl(item.image?.[0], 200)} alt={item.name} loading='lazy' />
              <div>
                <p className='sm:text-base font-medium text-ink'>{item.name}</p>
                <div className='flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-sm text-gray-700'>
                  <p>{formatPrice(item.price)}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Size: {item.size}</p>
                </div>
                <p className='mt-1.5 text-gray-500'>Date: <span className='text-gray-700'>{new Date(item.date).toDateString()}</span></p>
                <p className='mt-0.5 text-gray-500'>Payment: <span className='text-gray-700'>{item.paymentMethod}</span></p>
              </div>
            </div>
            <div className='md:w-1/2 flex items-center justify-between gap-4'>
              <div className='flex items-center gap-2 rounded-full border border-line bg-cream px-3 py-1'>
                <span className={`w-2 h-2 rounded-full ${STATUS_DOT[item.status] || 'bg-gray-400'}`} aria-hidden='true'></span>
                <p className='text-sm'>{item.status}</p>
              </div>
              <button type='button' onClick={loadOrderData} className='btn-outline px-4 py-2 text-xs'>TRACK ORDER</button>
            </div>
          </li>
        ))}
      </ul>

    </div>
  )
}

export default Orders
