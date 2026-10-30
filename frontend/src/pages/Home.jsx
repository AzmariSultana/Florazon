import React, { useContext } from 'react'
import Hero from '../components/Hero'
import LatestCollection from '../components/LatestCollection';
import BestSeller from '../components/BestSeller'
import OurPolicy from '../components/OurPolicy';
import NewsletterBox from '../components/NewsletterBox';
import StatusMessage, { LOAD_ERROR_TEXT } from '../components/StatusMessage';
import { ShopContext } from '../context/ShopContext';
import useDocumentTitle from '../utils/useDocumentTitle';

const Home = () => {
  const { productsStatus } = useContext(ShopContext)
  useDocumentTitle(null)
  return (
    <div>
      <Hero />
      {productsStatus === 'error' && <StatusMessage retry>{LOAD_ERROR_TEXT}</StatusMessage>}
      <LatestCollection/>
      <BestSeller/>
      <OurPolicy/>
      <NewsletterBox/>
    </div>
  )
}

export default Home