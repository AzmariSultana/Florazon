import React, { useContext, useMemo } from 'react'
import { Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import { assets } from '../assets/assets';
import CartTotal from '../components/CartTotal';



const Cart = () => {

  const { products, currency, cartItems, updateQuantity, navigate } = useContext(ShopContext);

  // Only keep entries whose product still exists, so a deleted product can't crash the page
  const cartData = useMemo(() => {
    const tempData = [];
    for (const items in cartItems) {
      const productData = products.find((product) => product._id === items);
      if (!productData) continue;
      for (const item in cartItems[items]) {
        if (cartItems[items][item] > 0) {
          tempData.push({
            _id: items,
            size: item,
            quantity: cartItems[items][item],
            productData
          })
        }
      }
    }
    return tempData;
  }, [cartItems, products])

  return (
    <div className='border-t pt-14'>
      <div className='text-2xl mb-3'>
        <Title text1={'YOUR'} text2={'CART'} />

      </div>
      {products.length === 0 && Object.keys(cartItems).length > 0 ? (
        <p className='py-16 text-center text-gray-500'>Loading your cart...</p>
      ) : cartData.length === 0 ? (
        <div className='py-16 text-center text-gray-500'>
          <p>Your cart is empty.</p>
          <Link to='/collection' className='inline-block mt-6 bg-black text-white text-sm px-8 py-3'>BROWSE COLLECTION</Link>
        </div>
      ) : (
      <>
      <div>
        {
          cartData.map((item) => {
            const { productData } = item;
            return (
              <div key={`${item._id}-${item.size}`} className='py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4 '>
                <div className='flex items-start gap-6'>
                  <img className='w-16 sm:w-20' src={productData.image?.[0]} alt={productData.name} />
                  <div>
                    <p className='text-xs sm:text-lg font-medium'>{productData.name}</p>
                    <div className='flex items-center gap-5 mt-2'>
                      <p>{currency}{productData.price}</p>
                      <p className='px-2 sm:px-3 sm:py-1 border bg-slate-50'>{item.size}</p>

                    </div>
                  </div>

                </div>
                <input onChange={(e) => e.target.value === '' || Number(e.target.value) < 1 ? null : updateQuantity(item._id, item.size, Math.floor(Number(e.target.value)))} aria-label={`Quantity of ${productData.name}`} className='border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1' type="number" min={1} defaultValue={item.quantity} />
                <button type='button' onClick={() => updateQuantity(item._id, item.size, 0)} aria-label={`Remove ${productData.name} from cart`} className='mr-4'>
                  <img className='w-4 sm:w-5' src={assets.bin_icon} alt="" />
                </button>

              </div>
            )
          })
        }
      </div>
      <div className='flex justify-end my-20'>
        <div className='w-full sm:w-[450px]'>
          <CartTotal />
          <div className='w-full text-end'>
            <button onClick={() => navigate('/place-order')} className='bg-black text-white text-sm my-8 px-8 py-3'>PROCEED TO CHECKOUT</button>

          </div>

        </div>

      </div>
      </>
      )}

    </div>
  )
}

export default Cart
