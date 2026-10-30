import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'
import { STORE } from '../constants'

const COMPANY_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About us' },
  { to: '/collection', label: 'Collection' },
  { to: '/contact', label: 'Contact' },
]

const linkClass = 'transition-colors hover:text-black'

const Footer = () => {
  return (
    <footer>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-12 mt-32 mb-10 pt-12 border-t border-line text-sm'>
        <div>
          <img src={assets.logo} className='mb-5 w-32' width={640} height={217} alt="Florazon" loading='lazy' />
          <p className='w-full md:w-2/3 text-gray-600 leading-relaxed'>{STORE.tagline}</p>
        </div>
        <div>
          <p className='eyebrow text-gray-700 mb-5'>Company</p>
          <ul className='flex flex-col gap-2 text-gray-600'>
            {COMPANY_LINKS.map((link) => (
              <li key={link.to}><Link to={link.to} className={linkClass}>{link.label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <p className='eyebrow text-gray-700 mb-5'>Get in touch</p>
          <ul className='flex flex-col gap-2 text-gray-600'>
            <li><a href={STORE.phoneHref} className={linkClass}>{STORE.phone}</a></li>
            <li><a href={`mailto:${STORE.email}`} className={`${linkClass} break-all`}>{STORE.email}</a></li>
          </ul>
        </div>
      </div>
      <div>
        <hr className='border-line' />
        <p className='py-6 text-xs tracking-wide text-center text-gray-500'>Copyright {new Date().getFullYear()} © florazon.com. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
