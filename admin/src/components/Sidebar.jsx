import React from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'

const LINKS = [
  { to: '/add', label: 'Add Items', icon: assets.add_icon },
  { to: '/list', label: 'List Items', icon: assets.order_icon },
  { to: '/orders', label: 'Orders', icon: assets.order_icon },
]

const Sidebar = () => {
  return (
    <aside className='w-[18%] min-h-screen border-r border-line'>
      <nav aria-label='Admin' className='flex flex-col gap-4 pt-6 pl-[20%] text-[15px]'>
        {LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            aria-label={link.label}
            className='flex items-center gap-3 border border-line border-r-0 bg-white/60 px-3 py-2.5 rounded-l-md text-gray-600 transition-colors hover:bg-white hover:text-ink'
          >
            <img className='w-5 h-5' src={link.icon} alt="" />
            <p className='hidden md:block'>{link.label}</p>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
