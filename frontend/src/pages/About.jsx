import Title from '../components/Title'
import {assets} from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'
import useDocumentTitle from '../utils/useDocumentTitle'


const About = () => {
  useDocumentTitle('About')
  return (
    <div>
      <div className='text-2xl text-center pt-8 border-t'>
        <Title as='h1' text1={'ABOUT'} text2={'US'}/>

      </div>
      <div className='my-10 flex flex-col md:flex-row gap-16'>
        <img className='w-full md:max-w-[450px] rounded-lg' src={assets.about_img} alt="Yellow rose bouquet" width={675} height={732} loading='lazy'/>
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600 leading-relaxed'>
          <p>Florazon was founded to bring the elegance of nature into everyday life through carefully crafted floral arrangements. Each bouquet we deliver reflects our commitment to quality and meaningful connection.</p>
          <p>From dawn to dusk, we select blooms that express love, joy, and comfort, delivering nature's freshest, most graceful flowers right to your door.</p>
          <p className='eyebrow text-gray-700'>Our Mission</p>
          <p>
            We bring fresh flowers, bright and true,<br/>
            To share the love we hold for you.<br/>
            With every bloom, a smile we send,<br/>
            Connecting hearts from start to end.
          </p>


        </div>

      </div>
      <div className='text-xl py-4'>
        <Title text1={'WHY'} text2={'CHOOSE US'} />

      </div>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-20'>
        <div className='panel px-8 md:px-10 py-10 sm:py-14 flex flex-col gap-4 transition-shadow hover:shadow-soft'>
          <b>Quality Assurance</b>
          <p className='text-gray-600'>Every Florazon bloom is handpicked for freshness and beauty, ensuring your gift arrives flawless and full of life.</p>
        </div>
        <div className='panel px-8 md:px-10 py-10 sm:py-14 flex flex-col gap-4 transition-shadow hover:shadow-soft'>
          <b>Convenience</b>
          <p className='text-gray-600'>Florazon makes sending flowers simple and stress-free, with easy ordering and reliable, fast delivery right to your doorstep.</p>
        </div>
        <div className='panel px-8 md:px-10 py-10 sm:py-14 flex flex-col gap-4 transition-shadow hover:shadow-soft'>
          <b>Exceptional Customer Service</b>
          <p className='text-gray-600'>At Florazon, thoughtful support meets seamless care-ensuring every step of your journey is handled with dedication and grace.</p>
        </div>

      </div>
      <NewsletterBox/>
    </div>
  )
}

export default About