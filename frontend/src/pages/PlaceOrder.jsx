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
    <form onSubmit={onSubmitHandler} className='pt-6 sm:pt-10'>
      <Title as='h1' eyebrow='Checkout' text1={'DELIVERY'} text2={'INFORMATION'} size='text-4xl sm:text-5xl' />

      <div className='grid lg:grid-cols-[minmax(0,1fr)_380px] gap-8 lg:gap-10 items-start mt-8'>
        <div className='flex flex-col gap-6'>
          {/* Delivery details */}
          <section className='card p-6 sm:p-8'>
            <div className='flex items-center gap-3 mb-6'>
              <span className='flex h-7 w-7 items-center justify-center rounded-full bg-ink text-xs text-white'>1</span>
              <h2 className='font-display text-xl text-ink'>Where should we deliver?</h2>
            </div>
            <div className='flex flex-col gap-4'>
              {FIELD_ROWS.map((row) => (
                <div key={row.map((f) => f.name).join('-')} className='grid gap-4 sm:grid-flow-col sm:auto-cols-fr'>
                  {row.map((field) => (
                    <div key={field.name}>
                      <label htmlFor={`checkout-${field.name}`} className='field-label'>{field.placeholder}</label>
                      <input
                        id={`checkout-${field.name}`}
                        required
                        name={field.name}
                        type={field.type || 'text'}
                        inputMode={field.inputMode}
                        autoComplete={field.autoComplete}
                        value={formData[field.name]}
                        onChange={onChangeHandler}
                        className='field'
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </section>

          {/* Payment */}
          <section className='card p-6 sm:p-8'>
            <div className='flex items-center gap-3 mb-6'>
              <span className='flex h-7 w-7 items-center justify-center rounded-full bg-ink text-xs text-white'>2</span>
              <h2 className='font-display text-xl text-ink'>Payment method</h2>
            </div>
            <div role='radiogroup' aria-label='Payment method'>
              <div
                onClick={() => setMethod('cod')}
                role='radio'
                aria-checked={method === 'cod'}
                tabIndex={0}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setMethod('cod')}
                className={`flex items-center gap-4 rounded-2xl border px-5 py-4 cursor-pointer transition-all duration-300 ${method === 'cod' ? 'border-ink bg-blush/30 shadow-soft' : 'border-line hover:border-gray-400'}`}
              >
                <span className={`w-5 h-5 shrink-0 rounded-full border-2 flex items-center justify-center ${method === 'cod' ? 'border-ink' : 'border-gray-300'}`}><span className={`w-2.5 h-2.5 rounded-full transition-transform ${method === 'cod' ? 'bg-ink scale-100' : 'scale-0'}`}></span></span>
                <div>
                  <p className='text-sm font-medium text-ink'>Cash on delivery</p>
                  <p className='text-xs text-gray-500 mt-0.5'>Pay when your flowers arrive.</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Summary */}
        <div className='lg:sticky lg:top-24'>
          <CartTotal>
            <button type='submit' disabled={submitting} className='btn-primary w-full mt-7'>{submitting ? 'Placing order...' : 'Place order'}</button>
            <p className='mt-4 text-center text-xs text-gray-500'>Hand-arranged on the day of delivery.</p>
          </CartTotal>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder
