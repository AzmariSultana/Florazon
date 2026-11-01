import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import CartTotal from '../components/CartTotal'
import EmptyState from '../components/EmptyState'
import { formatPrice, imageUrl } from '../utils/format'
import StatusMessage, { LOAD_ERROR_TEXT } from '../components/StatusMessage'
import useDocumentTitle from '../utils/useDocumentTitle'
import { optionPrice, resolveOption } from '../utils/productOptions'

const stepClass = 'flex h-9 w-9 items-center justify-center rounded-full text-lg leading-none text-gray-600 transition-colors hover:bg-blush/60 hover:text-ink disabled:opacity-30 disabled:hover:bg-transparent'

// Keeps what the user is typing, but follows the cart when it changes elsewhere (e.g. after login)
const QuantityInput = ({ quantity, label, onChange }) => {
  const [value, setValue] = useState(String(quantity))
  useEffect(() => { setValue(String(quantity)) }, [quantity])

  const commit = (next) => {
    setValue(next)
    const parsed = Math.floor(Number(next))
    if (next !== '' && parsed >= 1 && parsed !== quantity) onChange(parsed)
  }

  return (
    <div className='inline-flex self-start sm:self-auto items-center rounded-full border border-line bg-white/80 p-0.5'>
      <button type='button' onClick={() => commit(String(quantity - 1))} disabled={quantity <= 1} aria-label={`Decrease ${label}`} className={stepClass}>&minus;</button>
      <input
        value={value}
        onChange={(e) => commit(e.target.value)}
        onBlur={() => { if (value === '' || Number(value) < 1) setValue(String(quantity)) }}
        aria-label={label}
        className='no-spin w-9 bg-transparent text-center text-sm outline-none'
        type='number'
        min={1}
        inputMode='numeric'
      />
      <button type='button' onClick={() => commit(String(quantity + 1))} aria-label={`Increase ${label}`} className={stepClass}>+</button>
    </div>
  )
}

const Cart = () => {
  const { products, productsStatus, cartItems, updateQuantity, navigate } = useContext(ShopContext)
  useDocumentTitle('Cart')

  // Only keep entries whose product still exists, so a deleted product can't crash the page
  const cartData = useMemo(() => {
    const tempData = []
    for (const items in cartItems) {
      const productData = products.find((product) => product._id === items)
      if (!productData) continue
      for (const item in cartItems[items]) {
        if (cartItems[items][item] > 0) {
          tempData.push({ _id: items, size: item, quantity: cartItems[items][item], productData })
        }
      }
    }
    return tempData
  }, [cartItems, products])

  return (
    <div className='pt-6 sm:pt-10'>
      <Title as='h1' eyebrow='Your basket' text1={'YOUR'} text2={'CART'} size='text-4xl sm:text-5xl' />

      {productsStatus === 'loading' && Object.keys(cartItems).length > 0 ? (
        <StatusMessage>Loading your cart...</StatusMessage>
      ) : productsStatus === 'error' ? (
        <StatusMessage retry>{LOAD_ERROR_TEXT}</StatusMessage>
      ) : cartData.length === 0 ? (
        <EmptyState title='Your cart is empty.' text='Find something lovely in the collection.' action={{ to: '/collection', label: 'Browse collection' }} />
      ) : (
        <div className='grid lg:grid-cols-[minmax(0,1fr)_380px] gap-8 lg:gap-10 items-start mt-8'>
          <ul className='flex flex-col gap-3'>
            {cartData.map((item) => {
              const { productData } = item
              return (
                <li key={`${item._id}-${item.size}`} className='group card p-3 sm:p-4 flex items-center gap-4 sm:gap-5 transition-shadow duration-500 hover:shadow-lift animate-fade-up'>
                  <Link to={`/product/${item._id}`} className='zoom-frame shrink-0 w-20 sm:w-24 aspect-[4/5] rounded-2xl'>
                    <img className='h-full w-full object-cover' src={imageUrl(productData.image?.[0], 200)} alt={productData.name} />
                  </Link>
                  <div className='flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6'>
                    <div className='flex-1 min-w-0'>
                      <Link to={`/product/${item._id}`} className='block text-sm sm:text-base font-medium text-ink transition-colors hover:text-brand'>{productData.name}</Link>
                      <div className='flex items-center gap-3 mt-1.5 text-sm text-gray-600'>
                        <p>{formatPrice(optionPrice(productData, item.size))}</p>
                        <p className='px-2.5 py-0.5 rounded-full bg-blush/60 text-xs text-gray-700'>{resolveOption(productData, item.size).label}</p>
                      </div>
                    </div>
                    <QuantityInput
                      quantity={item.quantity}
                      label={`quantity of ${productData.name}`}
                      onChange={(quantity) => updateQuantity(item._id, item.size, quantity)}
                    />
                    <p className='hidden sm:block w-24 text-right font-medium text-ink'>{formatPrice(optionPrice(productData, item.size) * item.quantity)}</p>
                  </div>
                  <button type='button' onClick={() => updateQuantity(item._id, item.size, 0)} aria-label={`Remove ${productData.name} from cart`} className='self-start sm:self-center w-9 h-9 shrink-0 rounded-full flex items-center justify-center transition-colors hover:bg-red-50'>
                    <img className='w-4 opacity-70' src={assets.bin_icon} alt="" />
                  </button>
                </li>
              )
            })}
          </ul>
          <div className='lg:sticky lg:top-24'>
            <CartTotal>
              <button type='button' onClick={() => navigate('/place-order')} className='btn-primary w-full mt-7'>Proceed to checkout</button>
              <Link to='/collection' className='btn-link block text-center mt-4'>Continue shopping</Link>
            </CartTotal>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart
