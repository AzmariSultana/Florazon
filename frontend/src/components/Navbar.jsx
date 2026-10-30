import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'

const NAV_LINKS = [
  { to: '/', label: 'HOME' },
  { to: '/collection', label: 'COLLECTION' },
  { to: '/about', label: 'ABOUT' },
  { to: '/contact', label: 'CONTACT' },
]

const Navbar = () => {
  const [visible, setVisible] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { setShowSearch, getCartCount, navigate, token, logout: endSession } = useContext(ShopContext)
  const location = useLocation()
  const cartCount = getCartCount()

  // Show the header's border and shadow only once content scrolls beneath it
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the mobile menu on navigation, lock page scroll while it is open, and close it with Escape
  useEffect(() => { setVisible(false) }, [location.pathname])
  useEffect(() => {
    document.body.style.overflow = visible ? 'hidden' : ''
    const onKey = (e) => e.key === 'Escape' && setVisible(false)
    if (visible) window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [visible])

  const logout = () => {
    endSession()
    navigate('/login')
  }

  const openSearch = () => {
    setShowSearch(true)
    navigate('/collection')
  }

  return (
    <>
    {/* Full-bleed sticky bar: negative margins cancel the page gutter so the glass spans the viewport */}
    <header className={`sticky top-0 z-40 -mx-4 px-4 sm:-mx-[5vw] sm:px-[5vw] md:-mx-[7vw] md:px-[7vw] lg:-mx-[9vw] lg:px-[9vw] flex items-center justify-between py-4 font-medium bg-canvas/80 backdrop-blur-md backdrop-saturate-150 border-b transition-[border-color,box-shadow] duration-300 ${scrolled ? 'border-line shadow-[0_6px_20px_-14px_rgba(43,43,43,0.25)]' : 'border-transparent'}`}>
      <Link to='/'><img src={assets.logo} className='w-36' width={640} height={217} alt="Florazon home" /></Link>

      <nav aria-label='Main'>
        <ul className='hidden sm:flex gap-6 text-[13px] tracking-wide text-gray-600'>
          {NAV_LINKS.map((link) => (
            <li key={link.to}>
              <NavLink to={link.to} className='flex flex-col items-center gap-1 transition-colors hover:text-ink [&.active]:text-ink'>
                <p>{link.label}</p>
                <hr className='w-2/4 border-none h-[1.5px] bg-ink hidden' />
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className='flex items-center gap-6'>
        <button type='button' onClick={openSearch} aria-label='Search products' className='transition-opacity hover:opacity-70'>
          <img src={assets.search_icon} className='w-5' alt="" />
        </button>

        <div className='group relative'>
          <button
            type='button'
            onClick={() => navigate(token ? '/user-profile' : '/login')}
            aria-label={token ? 'My account' : 'Log in'}
            aria-haspopup={token ? 'menu' : undefined}
            className='transition-opacity hover:opacity-70'
          >
            <img className='w-5' src={assets.profile_icon} alt="" />
          </button>
          {token && (
            // Opens on hover and on keyboard focus
            <div className='invisible opacity-0 translate-y-1 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:visible group-focus-within:opacity-100 group-focus-within:translate-y-0 transition-all duration-200 absolute right-0 pt-4 z-20'>
              <div className='card flex flex-col gap-1 w-40 p-2 text-sm text-gray-600' role='menu'>
                <button type='button' role='menuitem' onClick={() => navigate('/user-profile')} className='text-left px-3 py-2 rounded-md transition-colors hover:bg-cream hover:text-ink'>My Profile</button>
                <button type='button' role='menuitem' onClick={() => navigate('/orders')} className='text-left px-3 py-2 rounded-md transition-colors hover:bg-cream hover:text-ink'>Orders</button>
                <hr className='my-1 border-line' />
                <button type='button' role='menuitem' onClick={logout} className='text-left px-3 py-2 rounded-md transition-colors hover:bg-cream hover:text-ink'>Logout</button>
              </div>
            </div>
          )}
        </div>

        <Link to='/cart' className='relative transition-opacity hover:opacity-70' aria-label={`Cart (${cartCount} items)`}>
          <img src={assets.cart_icon} className='w-5 min-w-5' alt="" />
          <p className={`absolute right-[-6px] bottom-[-6px] min-w-4 h-4 px-1 text-center leading-4 rounded-full text-[9px] font-semibold transition-colors ${cartCount > 0 ? 'bg-brand text-white' : 'bg-ink text-white'}`}>{cartCount}</p>
        </Link>

        <button type='button' onClick={() => setVisible(true)} className='sm:hidden' aria-label='Open menu' aria-expanded={visible}>
          <img src={assets.menu_icon} className='w-5' alt="" />
        </button>
      </div>
    </header>

      {/* Sidebar menu for small screens, kept outside the header because its backdrop blur would trap
          "fixed" positioning. "invisible" keeps the links out of the tab order while closed. */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 overflow-hidden bg-canvas transition-all duration-300 ease-out ${visible ? 'w-full visible' : 'w-0 invisible'}`}
        aria-hidden={!visible}
      >
        <nav aria-label='Mobile' className='flex flex-col text-gray-600 pt-2'>
          <button type='button' onClick={() => setVisible(false)} className='flex items-center gap-4 p-3'>
            <img className='h-4 rotate-180' src={assets.dropdown_icon} alt="" />
            <p>Back</p>
          </button>
          {NAV_LINKS.map((link) => (
            <NavLink key={link.to} onClick={() => setVisible(false)} className='py-3.5 pl-6 border-b border-line text-sm tracking-wide transition-colors' to={link.to}>{link.label}</NavLink>
          ))}
        </nav>
      </div>
    </>
  )
}

export default Navbar
