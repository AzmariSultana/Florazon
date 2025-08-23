import Title from '../components/Title'
import {assets} from '../assets/assets'
import Newsletterbox from '../components/Newsletterbox'


const About = () => {
  return (
    <div>
      <div className='text-2xl text-center pt-8 border-t'>
        <Title text1={'ABOUT'} text2={'US'}/>

      </div>
      <div className='my-10 flex flex-col md:flex-row gap-16'>
        <img className='w-full md:max-w-[450px]' src={assets.about_img} alt=""/>
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
          <p>Florazon was founded to bring the elegance of nature into everyday life through carefully crafted floral arrangements. Each bouquet we deliver reflects our commitment to quality and meaningful connection.</p>
          <p>From dawn to dusk, we select blooms that express love, joy, and comfort, delivering nature's freshest, most graceful flowers right to your door.</p>
          <b className='text-gray-800'>Our Mission</b>
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
      <div className='flex flex-col md:flex-row text-sm mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Quality Assurance</b>
          <p className='text-gray-600'>Every Florazon bloom is handpicked for freshness and beauty, ensuring your gift arrives flawless and full of life.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Convenience</b>
          <p className='text-gray-600'>Florazon makes sending flowers simple and stress-free, with easy ordering and reliable, fast delivery right to your doorstep.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Exceptional Customer Service</b>
          <p className='text-gray-600'>At Florazon, thoughtful support meets seamless care-ensuring every step of your journey is handled with dedication and grace.</p>
        </div>

      </div>
      <Newsletterbox/>
    </div>
  )
}

export default About