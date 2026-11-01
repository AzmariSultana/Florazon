import { Suspense, lazy, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SearchBar from './components/SearchBar'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// The home page ships with the main bundle; every other page loads on first visit
const Collection = lazy(() => import('./pages/Collection'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const Product = lazy(() => import('./pages/Product'))
const Cart = lazy(() => import('./pages/Cart'))
const Login = lazy(() => import('./pages/Login'))
const PlaceOrder = lazy(() => import('./pages/PlaceOrder'))
const Orders = lazy(() => import('./pages/Orders'))
const Profile = lazy(() => import('./pages/Profile'))
const NotFound = lazy(() => import('./pages/NotFound'))

// Start each page at the top instead of keeping the previous page's scroll position
const ScrollToTop = () => {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

// Quiet placeholder while a page's code loads
const PageFallback = () => (
  <div className='flex min-h-[60vh] items-center justify-center' role='status' aria-label='Loading page'>
    <span className='h-8 w-8 animate-spin rounded-full border-2 border-blush border-t-brand' />
  </div>
)

const App = () => {
  const { pathname } = useLocation()
  return (
    <div className='px-[var(--gutter)]'>
      {/* Keyboard users can jump past the navigation straight to the page content */}
      <a href='#main' className='sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-sm focus:text-white focus:shadow-lift'>
        Skip to content
      </a>
      <ScrollToTop />
      <ToastContainer position='top-right' autoClose={3000} />
      <Navbar />
      <SearchBar />
      {/* Keyed by path so each page fades in when navigated to */}
      <main id='main' tabIndex={-1} key={pathname} className='animate-page-in outline-none'>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/collection' element={<Collection />} />
            <Route path='/about' element={<About />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='/product/:productId' element={<Product />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/login' element={<Login />} />
            <Route path='/user-profile' element={<Profile />} />
            <Route path='/place-order' element={<PlaceOrder />} />
            <Route path='/orders' element={<Orders />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}

export default App
