import React, { useCallback, useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import EmptyState from '../components/EmptyState';
import StatusMessage from '../components/StatusMessage';
import axios from 'axios';
import { formatDate, formatPrice, imageUrl } from '../utils/format';
import useDocumentTitle from '../utils/useDocumentTitle'

// Dot colour for each delivery stage
const STATUS_DOT = {
  'Order Placed': 'bg-gray-400',
  'Packing': 'bg-amber-400',
  'Shipped': 'bg-sky-500',
  'Out for delivery': 'bg-brand',
  'Delivered': 'bg-green-500',
}

const PAYMENT_LABELS = { COD: 'Cash on delivery' }

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
              deliveryDate: order.address?.deliveryDate,
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
    <div className='pt-6 sm:pt-10'>
      <div className='flex flex-wrap items-end justify-between gap-4'>
        <Title as='h1' eyebrow='Your account' text1={'MY'} text2={'ORDERS'} size='text-4xl sm:text-5xl' />
        {/* One refresh for the whole list: statuses change as the studio updates each order */}
        {token && orderData.length > 0 && (
          <button type='button' onClick={loadOrderData} className='btn-outline mb-6 px-5 py-2.5 text-xs'>Refresh status</button>
        )}
      </div>
      {!token && (
        <EmptyState
          title='Sign in to see your orders'
          text='Track each arrangement from the studio to your door.'
          action={{ to: '/login', state: { from: '/orders' }, label: 'Log in' }}
        />
      )}
      {token && !loading && orderData.length === 0 && (
        <EmptyState
          title="You haven't placed any orders yet."
          text='When you do, you can follow every delivery here.'
          action={{ to: '/collection', label: 'Browse collection' }}
        />
      )}
      {token && loading && <StatusMessage>Loading your orders...</StatusMessage>}
      <ul className='flex flex-col gap-3 mt-2'>
        {orderData.map((item, index) => (
          <li key={index} className='card p-4 sm:p-5 text-gray-700 animate-fade-up flex flex-col md:flex-row md:items-center md:justify-between gap-4 transition-shadow hover:shadow-lift'>
            <div className='flex items-start gap-4 sm:gap-6 text-sm'>
              <img className='w-16 sm:w-20 aspect-[4/5] object-cover rounded-2xl bg-cream flex-shrink-0' src={imageUrl(item.image?.[0], 200)} alt={item.name} loading='lazy' />
              <div>
                <p className='sm:text-base font-medium text-ink'>{item.name}</p>
                <div className='flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-sm text-gray-700'>
                  <p>{formatPrice(item.price)}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p className='rounded-full bg-blush/60 px-2.5 py-0.5 text-xs'>{item.size}</p>
                </div>
                <p className='mt-1.5 text-gray-500'>Ordered: <span className='text-gray-700'>{formatDate(item.date)}</span></p>
                {item.deliveryDate && <p className='mt-0.5 text-gray-500'>Delivery: <span className='text-gray-700'>{formatDate(item.deliveryDate)}</span></p>}
                <p className='mt-0.5 text-gray-500'>Payment: <span className='text-gray-700'>{PAYMENT_LABELS[item.paymentMethod] || item.paymentMethod}</span></p>
              </div>
            </div>
            <div className='flex shrink-0 items-center gap-2 self-start rounded-full bg-blush/50 px-3.5 py-1.5 md:self-center'>
              <span className={`w-2 h-2 rounded-full ${STATUS_DOT[item.status] || 'bg-gray-400'}`} aria-hidden='true'></span>
              <p className='text-sm'>{item.status}</p>
            </div>
          </li>
        ))}
      </ul>

    </div>
  )
}

export default Orders
