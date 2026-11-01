import React, { useContext, useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { DELIVERY_FEE } from '../constants'
import useDocumentTitle from '../utils/useDocumentTitle'
import { formatPrice, imageUrl } from '../utils/format'
import { optionPrice, resolveOption } from '../utils/productOptions'

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
const MESSAGE_LIMIT = 200

// A date as YYYY-MM-DD in the visitor's own time zone, for the delivery date picker
const localDate = (offsetDays = 0) => {
  const d = new Date()
  d.setDate(d.getDate() + offsetDays)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const StepHeading = ({ step, children, note }) => (
  <div className='mb-6 flex flex-wrap items-center justify-between gap-x-4 gap-y-1'>
    <div className='flex items-center gap-3'>
      <span className='flex h-7 w-7 items-center justify-center rounded-full bg-ink text-xs text-white'>{step}</span>
      <h2 className='font-display text-xl text-ink'>{children}</h2>
    </div>
    {note && <p className='text-xs text-gray-500'>{note}</p>}
  </div>
)

const PlaceOrder = () => {
  const [method, setMethod] = useState('cod')
  const [submitting, setSubmitting] = useState(false)
  const { navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, products, handleApiError } = useContext(ShopContext)
  const [formData, setFormData] = useState(EMPTY_FORM)
  const [deliveryDate, setDeliveryDate] = useState(localDate(0))
  const [giftMessage, setGiftMessage] = useState('')
  useDocumentTitle('Checkout')

  // The items being ordered, for the summary beside the form
  const lines = []
  for (const id in cartItems) {
    const product = products.find((p) => p._id === id)
    if (!product) continue
    for (const size in cartItems[id]) {
      if (cartItems[id][size] > 0) lines.push({ product, option: resolveOption(product, size).label, quantity: cartItems[id][size] })
    }
  }

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
      // Delivery day and card message travel with the address, so they appear on the order for the florist
      address: { ...formData, deliveryDate, giftMessage: giftMessage.trim() },
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

  const orderLines = lines.length > 0 && (
    <ul className='mt-5 flex max-h-64 flex-col gap-3 overflow-y-auto'>
      {lines.map(({ product, option, quantity }) => (
        <li key={product._id + option} className='flex items-center gap-3'>
          <img src={imageUrl(product.image?.[0], 120)} alt='' loading='lazy' className='h-14 w-12 shrink-0 rounded-xl object-cover bg-blush/40' />
          <div className='min-w-0 flex-1'>
            <p className='truncate text-sm text-ink'>{product.name}</p>
            <p className='text-xs text-gray-500'>{option} &times; {quantity}</p>
          </div>
          <p className='shrink-0 text-sm text-ink'>{formatPrice(optionPrice(product, option) * quantity)}</p>
        </li>
      ))}
    </ul>
  )

  return (
    <form onSubmit={onSubmitHandler} className='pt-6 sm:pt-10'>
      <Title as='h1' eyebrow='Checkout' text1={'DELIVERY'} text2={'INFORMATION'} size='text-4xl sm:text-5xl' />

      <div className='grid lg:grid-cols-[minmax(0,1fr)_380px] gap-8 lg:gap-10 items-start mt-8'>
        <div className='flex flex-col gap-6'>
          {/* Delivery details */}
          <section className='card p-6 sm:p-8'>
            <StepHeading step={1}>Where should we deliver?</StepHeading>
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

          {/* Delivery day and card message */}
          <section className='card p-6 sm:p-8'>
            <StepHeading step={2} note='Arranged by hand on the day you choose'>Delivery day &amp; card</StepHeading>
            <div className='grid gap-4 sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)]'>
              <div>
                <label htmlFor='checkout-date' className='field-label'>Delivery date</label>
                <input id='checkout-date' type='date' required min={localDate(0)} max={localDate(30)} value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} className='field' />
              </div>
              <div>
                <div className='flex items-baseline justify-between'>
                  <label htmlFor='checkout-message' className='field-label'>Card message <span className='font-normal text-gray-500'>(optional)</span></label>
                  <span className='text-[11px] text-gray-500' aria-live='polite'>{giftMessage.length}/{MESSAGE_LIMIT}</span>
                </div>
                <textarea
                  id='checkout-message'
                  rows={3}
                  maxLength={MESSAGE_LIMIT}
                  value={giftMessage}
                  onChange={(e) => setGiftMessage(e.target.value)}
                  placeholder='We will write it on a card and tuck it in with your flowers.'
                  className='field resize-none leading-relaxed'
                />
              </div>
            </div>
          </section>

          {/* Payment */}
          <section className='card p-6 sm:p-8'>
            <StepHeading step={3}>Payment method</StepHeading>
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
          <CartTotal items={orderLines}>
            <button type='submit' disabled={submitting} className='btn-primary w-full mt-7'>{submitting ? 'Placing order...' : 'Place order'}</button>
            <p className='mt-4 text-center text-xs text-gray-500'>Hand-arranged on the day of delivery.</p>
          </CartTotal>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder
