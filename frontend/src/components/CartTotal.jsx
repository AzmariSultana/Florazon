import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'
import { DELIVERY_FEE } from '../constants'
import { formatPrice } from '../utils/format'

const CartTotal = () => {
  const { getCartAmount } = useContext(ShopContext)
  const subtotal = getCartAmount()
  const total = subtotal === 0 ? 0 : subtotal + DELIVERY_FEE

  return (
    <div className='panel w-full p-6'>
      <div className='text-xl'>
        <Title text1={'CART'} text2={'TOTALS'} />
      </div>
      <dl className='flex flex-col gap-3 mt-2 text-sm text-gray-600'>
        <div className='flex justify-between'>
          <dt>Subtotal</dt>
          <dd>{formatPrice(subtotal)}</dd>
        </div>
        <hr className='border-line' />
        <div className='flex justify-between'>
          <dt>Shipping Fee</dt>
          <dd>{formatPrice(DELIVERY_FEE)}</dd>
        </div>
        <hr className='border-line' />
        <div className='flex justify-between font-semibold text-base text-ink'>
          <dt>Total</dt>
          <dd>{formatPrice(total)}</dd>
        </div>
      </dl>
    </div>
  )
}

export default CartTotal
