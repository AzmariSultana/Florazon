import React, { useContext, useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { DELIVERY_FEE } from '../constants'
import useDocumentTitle from '../utils/useDocumentTitle'

// Delivery form layout: each inner array is one row of inputs
const FIELD_ROWS = [
  [{ name: 'firstName', placeholder: 'First name', autoComplete: 'given-name' }, { name: 'lastName', placeholder: 'Last name', autoComplete: 'family-name' }],
  [{ name: 'email', placeholder: 'Email address', type: 'email', autoComplete: 'email' }],
  [{ name: 'street', placeholder: 'Street', autoComplete: 'street-address' }],
  [{ name: 'city', placeholder: 'City', autoComplete: 'address-level2' }, { name: 'state', placeholder: 'State', autoComplete: 'address-level1' }],
  [{ name: 'zipcode', placeholder: 'Zipcode', inputMode: 'numeric', autoComplete: 'postal-code' }, { name: 'country', placeholder: 'Country', autoComplete: 'country-name' }],
  [{ name: 'phone', placeholder: 'Phone', type: 'tel', autoComplete: 'tel' }],
]

const EMPTY_FORM = Object.fromEntries(FIELD_ROWS.flat().map((field) => [field.name, '']))

const PlaceOrder = () => {
  const [method, setMethod] = useState('cod')
  const [submitting, setSubmitting] = useState(false)
  const { navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, products, handleApiError } = useContext(ShopContext)
  const [formData, setFormData] = useState(EMPTY_FORM)
  useDocumentTitle('Checkout')

  const onChangeHandler = (event) => {
    const { name, value } = event.target
    setFormData(data => ({ ...data, [name]: value }))
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault()
    if (!token) {
      toast.error('Please log in to place an order')
      navigate('/login', { state: { from: '/place-order' } })
      return
    }

    const orderItems = []
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        if (cartItems[items][item] > 0) {
          const itemInfo = products.find(product => product._id === items)
          if (itemInfo) {
            // prices are recalculated on the server, so only identifiers are needed
            orderItems.push({ _id: itemInfo._id, size: item, quantity: cartItems[items][item] })
          }
        }
      }
    }

    if (orderItems.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    const orderData = {
      address: formData,
      items: orderItems,
      amount: getCartAmount() + DELIVERY_FEE
    }

    try {
      setSubmitting(true)
      if (method === 'cod') {
        const response = await axios.post(backendUrl + '/api/order/place', orderData, { headers: { token } })

        if (response.data.success) {
          setCartItems({})
          toast.success('Order placed successfully')
          navigate('/orders')
        } else {
          toast.error(response.data.message)
        }
      }
    } catch (error) {
      handleApiError(error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-8 pt-5 sm:pt-14 min-h-[80vh] border-t'>
      {/* Delivery details */}
      <div className='card flex flex-col gap-4 w-full sm:max-w-[520px] p-6 sm:p-8 self-start'>
        <div className='text-xl sm:text-2xl mb-1'>
          <Title as='h1' text1={'DELIVERY'} text2={'INFORMATION'} />
        </div>
        {FIELD_ROWS.map((row) => (
          <div key={row.map((f) => f.name).join('-')} className='flex gap-3'>
            {row.map((field) => (
              <input
                key={field.name}
                required
                name={field.name}
                type={field.type || 'text'}
                inputMode={field.inputMode}
                autoComplete={field.autoComplete}
                placeholder={field.placeholder}
                aria-label={field.placeholder}
                value={formData[field.name]}
                onChange={onChangeHandler}
                className='field'
              />
            ))}
          </div>
        ))}
      </div>

      {/* Summary and payment */}
      <div className='w-full sm:w-auto sm:min-w-[340px]'>
        <div>
          <CartTotal />
        </div>
        <div className='mt-10'>
          <Title text1={'PAYMENT'} text2={'METHOD'} />
          <div role='radiogroup' aria-label='Payment method'>
            <div
              onClick={() => setMethod('cod')}
              role='radio'
              aria-checked={method === 'cod'}
              tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setMethod('cod')}
              className={`flex items-center gap-3 rounded-md border px-4 py-3 cursor-pointer mt-2 transition-all ${method === 'cod' ? 'border-ink bg-white shadow-soft' : 'border-gray-200 hover:border-gray-400'}`}
            >
              <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${method === 'cod' ? 'border-ink' : 'border-gray-300'}`}><span className={`w-2 h-2 rounded-full ${method === 'cod' ? 'bg-ink' : ''}`}></span></span>
              <p className='text-gray-700 text-sm font-medium tracking-wide'>CASH ON DELIVERY</p>
            </div>
          </div>
        </div>
        <div className='w-full mt-8'>
          <button type='submit' disabled={submitting} className='btn-primary w-full'>{submitting ? 'PLACING ORDER...' : 'PLACE ORDER'}</button>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder
