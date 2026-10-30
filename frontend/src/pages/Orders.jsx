import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import axios from 'axios';



const Orders = () => {
  const { backendUrl, token, currency, handleApiError }= useContext(ShopContext);

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
    <div className='border-t pt-16'>
      <div className='text-2xl'>
        <Title text1={'MY'} text2={'ORDERS'} />

      </div>
      {!token && (
        <p className='py-16 text-center text-gray-500'>Please <Link to='/login' className='underline'>log in</Link> to view your orders.</p>
      )}
      {token && !loading && orderData.length === 0 && (
        <p className='py-16 text-center text-gray-500'>You haven&apos;t placed any orders yet.</p>
      )}
      <div>
        {
          orderData.map((item,index)=>(
            <div key={index} className='py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
              <div className='flex items-start gap-6 text-sm'>
                <img className='w-16 sm:w-20' src={item.image?.[0]} alt={item.name}/>
                <div>
                  <p className='sm:text-base font-medium'>{item.name}</p>
                  <div className='flex items-center gap-3 mt-1 text-base text-gray-700'>
                    <p>{currency}{item.price}</p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Size: {item.size}</p>

                  </div>
                  <p className='mt-1'>Date: <span className='text-gray-400'>{new Date(item.date).toDateString()}</span></p>
                  <p className='mt-1'>Payment: <span className='text-gray-400'>{item.paymentMethod}</span></p>
                </div>

              </div>
              <div className='md:w-1/2 flex justify-between'>
                <div className='flex items-center gap-2'>
                  <p className='min-w-2 h-2 rounded-full bg-green-500'></p>
                  <p className='text-sm md:text-base'>{item.status}</p>

                </div>
                <button onClick={loadOrderData} className='border px-4 py-2 text-sm font-medium rounded-sm'>Track Order</button>

              </div>

            </div>
          ))
        }
      </div>

    </div>
  )
}

export default Orders
