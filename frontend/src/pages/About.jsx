import React, { useContext, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'
import Blossom from '../components/Blossom'
import { ShopContext } from '../context/ShopContext'
import { formatPrice } from '../utils/format'
import Reveal from '../components/Reveal'
import useDocumentTitle from '../utils/useDocumentTitle'

const STEPS = [
  { title: 'Chosen at first light', text: 'From dawn, we pick blooms for their freshness, colour and fragrance, the ones that best say love, joy or comfort.' },
  { title: 'Arranged by hand', text: 'Every bouquet is put together by hand on the day of delivery, so it reaches you at its freshest.' },
  { title: 'Delivered with care', text: 'Wrapped, finished and brought to the door, so it arrives looking as lovely as the moment it was made.' },
]

const PROMISES = [
  {
    icon: <><path d='M12 21c-4.5-2.5-7-6-7-10a7 7 0 0 1 14 0c0 4-2.5 7.5-7 10z' /><path d='m9 11 2 2 4-4' /></>,
    title: 'Quality you can see',
    text: 'Every bloom is handpicked for freshness and beauty, so your gift arrives flawless and full of life.',
  },
  {
    icon: <><rect x='3' y='7' width='18' height='13' rx='2.5' /><path d='M8 7V5a4 4 0 0 1 8 0v2' /></>,
    title: 'Effortless ordering',
    text: 'Choose a design, pick a size, pay on delivery. Sending flowers should feel as simple as it is thoughtful.',
  },
  {
    icon: <path d='M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z' />,
    title: 'Care at every step',
    text: 'Questions, changes or a special request? We are a message away and handle every order with dedication.',
  },
]

const About = () => {
  useDocumentTitle('About', 'The story behind Florazon: fresh flowers chosen at first light and arranged by hand on the day of delivery.')
  const { products } = useContext(ShopContext)

  // Real figures from the live catalogue, plus the store's standing promises
  const stats = useMemo(() => [
    { value: products.length || '—', label: 'designs in the collection' },
    { value: products.filter((item) => item.bestseller).length || '—', label: 'customer favourites' },
    { value: '1 day', label: 'easy exchange' },
    { value: 'COD', label: 'pay when it arrives' },
  ], [products])

  // The arrangement shown in the cut-out, linked so visitors can shop it
  const featured = useMemo(() => products.find((item) => item.name === 'Blush Lily Garden Crate'), [products])

  return (
    <div>
      {/* Introduction */}
      <section className='grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] items-center gap-12 lg:gap-16 pt-6 sm:pt-10'>
        <div className='animate-fade-up order-2 lg:order-1'>
          <p className='eyebrow'>Our story</p>
          <h1 className='mt-4 font-display text-4xl sm:text-5xl lg:text-[3.4rem] leading-[1.1] text-ink'>
            Rooted in care,<br /><span className='text-brand'>arranged with love.</span>
          </h1>
          <p className='mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-gray-600'>
            Florazon began with a simple wish: to bring the elegance of nature into everyday life. Each arrangement we create carries our commitment to quality and to the connections flowers help us share.
          </p>
          <p className='mt-4 max-w-xl leading-relaxed text-gray-500'>
            Whether it is a birthday, an apology or a quiet thank you, we choose blooms that say what words sometimes cannot, and bring nature&apos;s freshest, most graceful flowers right to your door.
          </p>
          <div className='mt-9 flex flex-wrap gap-3'>
            <Link to='/collection' className='btn-primary group'>
              Explore the collection
              <span aria-hidden='true' className='transition-transform duration-300 group-hover:translate-x-1'>&rarr;</span>
            </Link>
            <Link to='/contact' className='btn-outline'>Talk to a florist</Link>
          </div>
        </div>

        {/* The cut-out crate from the collection on a soft halo, with two small notes on
            opposite corners: the craft promise and a link to this exact arrangement */}
        <div className='relative order-1 lg:order-2 mx-auto w-full max-w-[520px]'>
          <div aria-hidden='true' className='pointer-events-none absolute -left-10 top-0 h-[60%] aspect-square rounded-full bg-blush blur-3xl opacity-80' />
          <div aria-hidden='true' className='pointer-events-none absolute -right-10 bottom-0 h-[50%] aspect-square rounded-full bg-sage-soft blur-3xl' />
          <div className='relative aspect-square'>
            {/* Halo: a soft circle the arrangement sits in front of */}
            <div aria-hidden='true' className='absolute inset-[7%] rounded-full bg-gradient-to-br from-blush via-cream to-sage-soft border border-white/80 shadow-[inset_0_2px_0_rgba(255,255,255,0.8),0_30px_60px_-30px_rgba(60,40,45,0.25)]' />
            <img
              className='absolute left-1/2 top-[52%] w-[84%] -translate-x-1/2 -translate-y-1/2 [filter:drop-shadow(0_26px_30px_rgba(60,40,45,0.24))] transition-transform duration-700 ease-petal hover:scale-[1.03]'
              src={assets.about_crate}
              alt='Pink lilies, gerberas and roses arranged in a rustic wooden crate'
              width={705}
              height={656}
            />
            <div className='absolute left-0 top-[8%] flex items-center gap-2.5 rounded-2xl border border-white/80 bg-white/75 px-4 py-2.5 shadow-glass backdrop-blur-md'>
              <Blossom className='h-5 w-5 shrink-0 text-brand' />
              <div>
                <p className='whitespace-nowrap font-display text-sm sm:text-base leading-tight text-ink'>Hand-tied daily</p>
                <p className='hidden sm:block whitespace-nowrap text-[11px] text-gray-500'>Made on the day it is delivered</p>
              </div>
            </div>
            {featured && (
              <Link
                to={`/product/${featured._id}`}
                className='group absolute right-0 bottom-[6%] flex items-center gap-3 rounded-2xl border border-white/80 bg-white/75 py-2.5 pl-4 pr-3 shadow-glass backdrop-blur-md transition-colors hover:bg-white/90'
              >
                <div>
                  <p className='eyebrow text-[10px]'>Pictured</p>
                  <p className='whitespace-nowrap text-sm font-medium text-ink'>{featured.name}</p>
                  <p className='text-xs text-brand'>from {formatPrice(featured.price)}</p>
                </div>
                <span aria-hidden='true' className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-sm text-white transition-transform duration-300 group-hover:translate-x-0.5'>&rarr;</span>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Figures */}
      <Reveal as='section' className='mt-20 panel grid grid-cols-2 md:grid-cols-4 divide-line md:divide-x'>
        {stats.map((stat) => (
          <div key={stat.label} className='px-6 py-7 sm:py-8 text-center'>
            <p className='font-display text-3xl sm:text-4xl text-ink'>{stat.value}</p>
            <p className='mt-1.5 text-xs sm:text-sm text-gray-500'>{stat.label}</p>
          </div>
        ))}
      </Reveal>

      {/* How a bouquet comes together */}
      <Reveal as='section' className='mt-24'>
        <Title align='center' eyebrow='Our craft' text1={'HOW EVERY BOUQUET'} text2={'COMES TOGETHER'} />
        <ol className='relative mt-12 grid gap-10 md:grid-cols-3 md:gap-8'>
          {/* Thin line joining the three steps on wide screens */}
          <span aria-hidden='true' className='absolute left-[16.6%] right-[16.6%] top-6 hidden h-px bg-gradient-to-r from-transparent via-brand/30 to-transparent md:block' />
          {STEPS.map((step, i) => (
            <li key={step.title} className='relative text-center animate-fade-up' style={{ animationDelay: `${i * 120}ms` }}>
              <span className='relative mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-white/80 bg-white font-display text-lg text-brand shadow-soft'>
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className='mt-5 font-display text-xl text-ink'>{step.title}</h3>
              <p className='mx-auto mt-2 max-w-xs text-sm leading-relaxed text-gray-500'>{step.text}</p>
            </li>
          ))}
        </ol>
      </Reveal>

      {/* Mission */}
      <Reveal as='section' className='relative mx-auto mt-24 max-w-4xl overflow-hidden rounded-4xl bg-gradient-to-br from-blush via-cream to-sage-soft border border-white/80 px-5 sm:px-8 py-11 sm:py-14 text-center shadow-soft'>
        <Blossom className='absolute -left-5 -top-5 h-20 w-20 sm:h-24 sm:w-24 text-brand/40 rotate-12' />
        <Blossom className='absolute -right-6 -bottom-6 h-24 w-24 sm:h-28 sm:w-28 text-sage/40 -rotate-12' />
        <div className='relative'>
          <p className='eyebrow'>Our mission</p>
          <blockquote className='mt-4 font-display text-[clamp(0.9rem,4.1vw,1.25rem)] sm:text-[1.65rem] leading-relaxed text-ink'>
            We bring fresh flowers, bright and true,<br />
            To share the love we hold for you.<br />
            With every bloom, a smile we send,<br />
            <span className='text-brand'>Connecting hearts from start to end.</span>
          </blockquote>
          <Blossom className='mx-auto mt-6 h-5 w-5 text-brand' />
        </div>
      </Reveal>

      {/* Why choose us */}
      <Reveal as='section' className='mt-24'>
        <Title eyebrow='Why Florazon' text1={'WHY'} text2={'CHOOSE US'} subtitle='Small details, done properly, every single time.' />
        <div className='mt-4 grid gap-4 lg:grid-cols-3'>
          {PROMISES.map((item) => (
            <div key={item.title} className='group panel p-7 sm:p-8 transition-all duration-500 ease-petal hover:-translate-y-1 hover:shadow-lift'>
              <span className='flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blush to-sage-soft p-3 text-brand transition-transform duration-500 ease-petal group-hover:rotate-6'>
                <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.6' strokeLinecap='round' strokeLinejoin='round' className='h-full w-full' aria-hidden='true'>{item.icon}</svg>
              </span>
              <h3 className='mt-6 font-display text-xl text-ink'>{item.title}</h3>
              <p className='mt-2 text-sm leading-relaxed text-gray-500'>{item.text}</p>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal><NewsletterBox /></Reveal>
    </div>
  )
}

export default About
