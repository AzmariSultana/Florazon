import React from 'react'
import { Link } from 'react-router-dom'
import {assets} from '../assets/assets'

const Footer = () => {
  return (
    <div>
        <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
            <div>
                <img src={assets.logo} className='mb-5 w-32' alt="Florazon" />
                <p className='w-full md:w-2/3 text-gray-600'>
                From our garden's grace to your heart's embrace.
                </p>
            </div>
            <div>
                <p className='text-xl font-medium mb-5'>COMPANY</p>
                <ul className='flex flex-col gap-1 text-gray-600'>
                    <li><Link to='/' className='hover:text-black'>Home</Link></li>
                    <li><Link to='/about' className='hover:text-black'>About us</Link></li>
                    <li><Link to='/collection' className='hover:text-black'>Collection</Link></li>
                    <li><Link to='/contact' className='hover:text-black'>Contact</Link></li>
                </ul>
            </div>
            <div>
                <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
                <ul className='flex flex-col gap-1 text-gray-600'>
                    <li><a href='tel:+8801715297864' className='hover:text-black'>+880-1715-297864</a></li>
                    <li><a href='mailto:azmari.sultana47@gmail.com' className='hover:text-black'>azmari.sultana47@gmail.com</a></li>

                </ul>
            </div>

        </div>
            <div>
                <hr />
                <p className='py-5 text-sm text-center'>Copyright {new Date().getFullYear()} © florazon.com - All Rights Reserved.</p>
            </div>
    </div>
  )
}

export default Footer