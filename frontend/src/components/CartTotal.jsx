import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { DELIVERY_FEE } from '../constants'
import { formatPrice } from '../utils/format'

const CartTotal = ({ children }) => {
  const { getCartAmount, getCartCount } = useContext(ShopContext)
  const subtotal = getCartAmount()
  const total = subtotal === 0 ? 0 : subtotal + DELIVERY_FEE
  const count = getCartCount()

  return (
    <div className='panel w-full p-6 sm:p-7'>
      <div className='flex items-baseline justify-between'>
        <h2 className='font-display text-2xl text-ink'>Order <span className='text-brand'>summary</span></h2>
        <p className='text-xs text-gray-500'>{count} {count === 1 ? 'item' : 'items'}</p>
      </div>
      <dl className='flex flex-col gap-3.5 mt-6 text-sm text-gray-600'>
        <div className='flex justify-between'>
          <dt>Subtotal</dt>
          <dd className='text-ink'>{formatPrice(subtotal)}</dd>
        </div>
        <div className='flex justify-between'>
          <dt>Shipping Fee</dt>
          <dd className='text-ink'>{formatPrice(DELIVERY_FEE)}</dd>
        </div>
        <div className='h-px bg-line my-1' />
        <div className='flex justify-between items-baseline'>
          <dt className='font-medium text-ink'>Total</dt>
          <dd className='font-display text-2xl text-ink'>{formatPrice(total)}</dd>
        </div>
      </dl>
      {children}
    </div>
  )
}

export default CartTotal
