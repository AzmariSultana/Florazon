import React, { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl, ORDER_STATUSES } from '../config'
import { formatDate, formatPrice } from '../utils'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets';


const Orders = ({ token }) => {

  const [orders, setOrders] = useState([])

  const fetchAllOrders = useCallback(async () => {
    if (!token) {
      return null;
    }
    try {
      const response = await axios.post(backendUrl + '/api/order/list', {}, { headers: { token } })
      if (response.data.success) {
        setOrders(response.data.orders)
      } else {
        toast.error(response.data.message)
      }

    } catch (error) {
      // 401s are handled globally in App (auto-logout)
      if (error.response?.status !== 401) toast.error(error.response?.data?.message || error.message)
    }
  }, [token])

  const statusHandler = async (event,orderId) => {
    try {
      const response = await axios.post(backendUrl + '/api/order/status', {orderId, status: event.target.value}, {headers: {token}})
      if (response.data.success) {
        toast.success(response.data.message)
        await fetchAllOrders()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.error(error)
      // 401s are handled globally in App (auto-logout)
      if (error.response?.status !== 401) toast.error(error.response?.data?.message || error.message)
    }
  }
  useEffect(() => {
    fetchAllOrders();
  }, [fetchAllOrders])
  return (
    <div>
      <h1 className='text-lg font-medium text-gray-800'>Orders <span className='text-sm font-normal text-gray-500'>({orders.length})</span></h1>
      {orders.length === 0 && <p className='mt-4 text-sm text-gray-500'>No orders yet.</p>}
      <div>
        {
          orders.map((order) => (
            <div className='grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start card p-5 md:p-7 my-3 text-xs sm:text-sm text-gray-700 transition-shadow hover:shadow-lift' key={order._id}>
              <div className='w-12 h-12 rounded-full bg-cream border border-line flex items-center justify-center'><img className='w-6' src={assets.parcel_icon} alt="" /></div>
              <div>
                <div>
                  {order.items.map((item, index) => (
                    <p className='py-0.5' key={index}>{item.name} × {item.quantity} <span className='text-gray-500'>({item.size})</span></p>
                  ))}
                </div>
                <p className='mt-3 mb-2 font-medium'>{`${order.address.firstName} ${order.address.lastName}`}</p>
                <div>
                  <p>{order.address.street}</p>
                  <p>{[order.address.city, order.address.state, order.address.country, order.address.zipcode].filter(Boolean).join(', ')}</p>
                </div>
                <p>{order.address.phone}</p>
                {order.address.giftMessage && (
                  <p className='mt-3 rounded-lg bg-brand-soft px-3 py-2 italic text-ink'>Card: “{order.address.giftMessage}”</p>
                )}
              </div>
              <div>
                <p className='text-sm sm:text-[15px]'>Items: {order.items.length}</p>
                <p className='mt-3'>Method: {order.paymentMethod}</p>
                <p>Payment: {order.payment ? 'Done' : 'Pending'}</p>
                <p>Ordered: {formatDate(order.date)}</p>
                {order.address.deliveryDate && <p className='font-medium text-ink'>Deliver on: {formatDate(order.address.deliveryDate)}</p>}
              </div>
              <p className='text-sm sm:text-[15px] font-medium'>{formatPrice(order.amount)}</p>
              <select onChange={(event)=>statusHandler(event,order._id)} value={order.status} aria-label='Order status' className='px-3 py-2 font-medium cursor-pointer'>
                {ORDER_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
              </select>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Orders