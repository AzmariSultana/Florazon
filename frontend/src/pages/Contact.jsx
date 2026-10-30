import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'
import { STORE } from '../constants'
import useDocumentTitle from '../utils/useDocumentTitle'

const Contact = () => {
  useDocumentTitle('Contact')
  return (
    <div>
      <div className='text-center text-2xl pt-10 border-t'>
        <Title as='h1' text1={'CONTACT'} text2={'US'} />
      </div>
      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28'>
        <img className='w-full md:max-w-[480px]' src={assets.contact_img} alt="Florazon store" width={960} height={985} loading='lazy' />
        <div className='flex flex-col justify-center items-start gap-6'>
          <h2 className='font-semibold text-xl text-gray-600'>Our Store</h2>
          <address className='not-italic text-gray-500 leading-relaxed'>
            {STORE.address.map((line) => <span key={line} className='block'>{line}</span>)}
          </address>
          <p className='text-gray-500 leading-relaxed'>
            Tel: <a href={STORE.phoneHref} className='transition-colors hover:text-black'>{STORE.phone}</a><br />
            Email: <a href={`mailto:${STORE.email}`} className='break-all transition-colors hover:text-black'>{STORE.email}</a>
          </p>
          <h2 className='font-semibold text-xl text-gray-600'>Careers at Florazon</h2>
          <p className='text-gray-500'>Learn more about our teams and job openings.</p>
          <a href={`mailto:${STORE.email}?subject=Careers%20at%20Florazon`} className='btn-outline px-8 py-4'>Explore Jobs</a>
        </div>
      </div>
      <NewsletterBox />
    </div>
  )
}

export default Contact
