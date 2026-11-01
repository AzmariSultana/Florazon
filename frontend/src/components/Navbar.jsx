import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/collection', label: 'Collection' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

const menuItemClass = 'text-left px-3 py-2 rounded-xl transition-colors hover:bg-blush/60 hover:text-ink'

const Navbar = () => {
  const [visible, setVisible] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { setShowSearch, getCartCount, navigate, token, logout: endSession } = useContext(ShopContext)
  const location = useLocation()
  const cartCount = getCartCount()

  // Frost the header and give it a hairline only once content scrolls beneath it
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
    <header className={`sticky top-0 z-40 -mx-[var(--gutter)] px-[var(--gutter)] border-b transition-all duration-500 ease-petal ${scrolled ? 'bg-canvas/75 backdrop-blur-xl backdrop-saturate-150 border-line/80 shadow-[0_8px_24px_-18px_rgba(60,40,45,0.3)]' : 'bg-transparent border-transparent'}`}>
      <div className={`flex items-center justify-between transition-[padding] duration-500 ease-petal ${scrolled ? 'py-3' : 'py-5'}`}>
        <Link to='/' className='shrink-0'><img src={assets.logo} className='w-[108px] sm:w-[118px]' width={489} height={83} alt="Florazon home" /></Link>

        <nav aria-label='Main' className='hidden md:block'>
          <ul className='flex items-center gap-1 rounded-full border border-white/80 bg-white/50 p-1 shadow-glass backdrop-blur-md text-[13px] tracking-wide text-gray-600'>
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) => `block rounded-full px-5 py-2 transition-all duration-300 ease-petal ${isActive ? 'bg-ink text-white shadow-soft' : 'hover:bg-white hover:text-ink'}`}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className='flex items-center gap-1 sm:gap-2'>
          <button type='button' onClick={openSearch} aria-label='Search products' className='icon-btn'>
            <img src={assets.search_icon} className='w-[18px]' alt="" />
          </button>

          <div className='group relative'>
            <button
              type='button'
              onClick={() => navigate(token ? '/user-profile' : '/login')}
              aria-label={token ? 'My account' : 'Log in'}
              aria-haspopup={token ? 'menu' : undefined}
              className='icon-btn'
            >
              <img className='w-[18px]' src={assets.profile_icon} alt="" />
            </button>
            {token && (
              // Opens on hover and on keyboard focus
              <div className='invisible opacity-0 translate-y-1 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:visible group-focus-within:opacity-100 group-focus-within:translate-y-0 transition-all duration-300 ease-petal absolute right-0 pt-3 z-20'>
                <div className='flex flex-col gap-0.5 w-44 p-2 rounded-2xl border border-white/80 bg-white/85 backdrop-blur-xl shadow-lift text-sm text-gray-600' role='menu'>
                  <button type='button' role='menuitem' onClick={() => navigate('/user-profile')} className={menuItemClass}>My Profile</button>
                  <button type='button' role='menuitem' onClick={() => navigate('/orders')} className={menuItemClass}>Orders</button>
                  <hr className='my-1 border-line' />
                  <button type='button' role='menuitem' onClick={logout} className={menuItemClass}>Logout</button>
                </div>
              </div>
            )}
          </div>

          <Link to='/cart' className='icon-btn' aria-label={`Cart (${cartCount} items)`}>
            <img src={assets.cart_icon} className='w-[18px] min-w-[18px]' alt="" />
            {cartCount > 0 && (
              <span key={cartCount} className='absolute top-0.5 right-0.5 min-w-[18px] h-[18px] px-1 text-center leading-[18px] rounded-full bg-brand text-white text-[10px] font-semibold ring-2 ring-canvas animate-fade-up'>{cartCount}</span>
            )}
          </Link>

          <button type='button' onClick={() => setVisible(true)} className='icon-btn md:hidden' aria-label='Open menu' aria-expanded={visible}>
            <img src={assets.menu_icon} className='w-[18px]' alt="" />
          </button>
        </div>
      </div>
    </header>

      {/* Menu for small screens, kept outside the header because its backdrop blur would trap
          "fixed" positioning. "invisible" keeps the links out of the tab order while closed. */}
      <div
        className={`fixed inset-0 z-50 md:hidden transition-[visibility] duration-500 ${visible ? 'visible' : 'invisible'}`}
        aria-hidden={!visible}
      >
        <div onClick={() => setVisible(false)} className={`absolute inset-0 bg-ink/20 backdrop-blur-sm transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`} />
        <nav
          aria-label='Mobile'
          className={`absolute top-0 right-0 bottom-0 w-[85%] max-w-sm flex flex-col bg-canvas px-6 pt-5 pb-8 shadow-lift transition-transform duration-500 ease-petal ${visible ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className='flex items-center justify-between'>
            <img src={assets.logo} className='w-24' width={489} height={83} alt="" />
            <button type='button' onClick={() => setVisible(false)} className='icon-btn' aria-label='Close menu'>
              <img className='w-3.5' src={assets.cross_icon} alt="" />
            </button>
          </div>
          <div className='mt-10 flex flex-col'>
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={() => setVisible(false)}
                className={({ isActive }) => `flex items-center justify-between py-4 border-b border-line font-display text-2xl transition-colors ${isActive ? 'text-brand' : 'text-ink hover:text-brand'}`}
              >
                {link.label}
                <span aria-hidden='true' className='text-base text-gray-400'>&rarr;</span>
              </NavLink>
            ))}
          </div>
          <Link to='/collection' onClick={() => setVisible(false)} className='btn-primary mt-auto'>Shop the collection</Link>
        </nav>
      </div>
    </>
  )
}

export default Navbar
