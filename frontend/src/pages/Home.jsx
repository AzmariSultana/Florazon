import React, { useContext } from 'react'
import Hero from '../components/Hero'
import Reveal from '../components/Reveal'
import CategoryShowcase from '../components/CategoryShowcase'
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
      <Reveal><OurPolicy/></Reveal>
      <Reveal><CategoryShowcase/></Reveal>
      <Reveal><LatestCollection/></Reveal>
      <Reveal><BestSeller/></Reveal>
      <Reveal><NewsletterBox/></Reveal>
    </div>
  )
}

export default Home
