import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import CartTotal from '../components/CartTotal'
import { formatPrice, imageUrl } from '../utils/format'
import StatusMessage, { LOAD_ERROR_TEXT } from '../components/StatusMessage'
import useDocumentTitle from '../utils/useDocumentTitle'

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
    <input
      value={value}
      onChange={(e) => commit(e.target.value)}
      onBlur={() => { if (value === '' || Number(value) < 1) setValue(String(quantity)) }}
      aria-label={label}
      className='w-14 sm:w-20 rounded-md border border-gray-300 px-2 py-1.5 text-sm text-center outline-none transition-[border-color,box-shadow] hover:border-gray-400 focus:border-ink focus:ring-4 focus:ring-brand-soft'
      type='number'
      min={1}
      inputMode='numeric'
    />
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
    <div className='border-t pt-14'>
      <div className='text-2xl mb-3'>
        <Title as='h1' text1={'YOUR'} text2={'CART'} />
      </div>

      {productsStatus === 'loading' && Object.keys(cartItems).length > 0 ? (
        <StatusMessage>Loading your cart...</StatusMessage>
      ) : productsStatus === 'error' ? (
        <StatusMessage retry>{LOAD_ERROR_TEXT}</StatusMessage>
      ) : cartData.length === 0 ? (
        <div className='panel py-16 text-center text-gray-500'>
          <p className='text-ink font-medium'>Your cart is empty.</p>
          <p className='mt-1 text-sm'>Find something lovely in the collection.</p>
          <Link to='/collection' className='btn-primary mt-6'>BROWSE COLLECTION</Link>
        </div>
      ) : (
        <>
          <ul>
            {cartData.map((item) => {
              const { productData } = item
              return (
                <li key={`${item._id}-${item.size}`} className='py-5 border-b border-line first:border-t text-gray-700 grid grid-cols-[4fr_1fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4'>
                  <div className='flex items-start gap-4 sm:gap-6'>
                    <Link to={`/product/${item._id}`} className='flex-shrink-0'>
                      <img className='w-16 sm:w-20 aspect-[4/5] object-cover rounded-md bg-cream' src={imageUrl(productData.image?.[0], 200)} alt={productData.name} />
                    </Link>
                    <div>
                      <Link to={`/product/${item._id}`} className='text-sm sm:text-base font-medium text-ink transition-colors hover:text-brand'>{productData.name}</Link>
                      <div className='flex items-center gap-3 mt-2 text-sm'>
                        <p>{formatPrice(productData.price)}</p>
                        <p className='px-2.5 py-0.5 rounded-full border border-line bg-cream text-xs text-gray-600'>{item.size}</p>
                      </div>
                    </div>
                  </div>
                  <QuantityInput
                    quantity={item.quantity}
                    label={`Quantity of ${productData.name}`}
                    onChange={(quantity) => updateQuantity(item._id, item.size, quantity)}
                  />
                  <button type='button' onClick={() => updateQuantity(item._id, item.size, 0)} aria-label={`Remove ${productData.name} from cart`} className='w-9 h-9 rounded-full flex items-center justify-center justify-self-end sm:justify-self-start transition-colors hover:bg-red-50'>
                    <img className='w-4' src={assets.bin_icon} alt="" />
                  </button>
                </li>
              )
            })}
          </ul>
          <div className='flex justify-end my-16'>
            <div className='w-full sm:w-[420px]'>
              <CartTotal />
              <div className='w-full text-end'>
                <button type='button' onClick={() => navigate('/place-order')} className='btn-primary w-full mt-4'>PROCEED TO CHECKOUT</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Cart
