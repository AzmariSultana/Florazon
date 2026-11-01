import React, { useState } from 'react'
import { toast } from 'react-toastify'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'
import { STORE } from '../constants'
import Reveal from '../components/Reveal'
import useDocumentTitle from '../utils/useDocumentTitle'

const ADDRESS = STORE.address.join(', ')
const MAP_EMBED = `https://maps.google.com/maps?q=${encodeURIComponent(ADDRESS)}&z=15&output=embed`
const DIRECTIONS = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`

const TOPICS = ['Order question', 'Custom arrangement', 'Delivery', 'Corporate or event flowers', 'Something else']

// Simple line icons drawn in the current text colour
const Icon = ({ name }) => {
  const paths = {
    pin: <><path d='M12 21s-7-6.2-7-11.5a7 7 0 1 1 14 0C19 14.8 12 21 12 21z' /><circle cx='12' cy='9.5' r='2.5' /></>,
    phone: <path d='M5 4h3.5l1.5 4-2 1.5a11 11 0 0 0 6.5 6.5l1.5-2 4 1.5V19a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1z' />,
    mail: <><rect x='3' y='5' width='18' height='14' rx='2.5' /><path d='m4 7 8 6 8-6' /></>,
    send: <><path d='M21 3 10 14' /><path d='M21 3 14.5 21l-4.5-7-7-4.5z' /></>,
    arrow: <path d='M7 17 17 7M9 7h8v8' />,
  }
  return (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.6' strokeLinecap='round' strokeLinejoin='round' className='h-full w-full' aria-hidden='true'>
      {paths[name]}
    </svg>
  )
}

const CONTACT_CARDS = [
  { icon: 'pin', label: 'Visit our studio', value: ADDRESS, href: DIRECTIONS, external: true },
  { icon: 'phone', label: 'Call us', value: STORE.phone, href: STORE.phoneHref },
  { icon: 'mail', label: 'Email us', value: STORE.email, href: `mailto:${STORE.email}` },
]

const EMPTY_FORM = { name: '', email: '', phone: '', topic: TOPICS[0], message: '' }

const Contact = () => {
  useDocumentTitle('Contact')
  const [form, setForm] = useState(EMPTY_FORM)

  const onChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  // There is no messaging backend, so the message opens in the visitor's email app, ready to send
  const onSubmit = (e) => {
    e.preventDefault()
    const details = [`Name: ${form.name}`, `Email: ${form.email}`, form.phone && `Phone: ${form.phone}`].filter(Boolean).join('\n')
    const body = `${form.message}\n\n${details}`
    window.location.href = `mailto:${STORE.email}?subject=${encodeURIComponent(`${form.topic} | ${form.name}`)}&body=${encodeURIComponent(body)}`
    toast.success('Your email app is opening with your message ready to send.')
    setForm(EMPTY_FORM)
  }

  return (
    <div>
      {/* Intro with the illustration placed straight on the page */}
      <section className='grid md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] items-center gap-6 md:gap-10 pt-6 sm:pt-10'>
        <div className='animate-fade-up'>
          <Title
            as='h1'
            eyebrow='Say hello'
            text1={'CONTACT'}
            text2={'US'}
            size='text-4xl sm:text-5xl lg:text-6xl'
            subtitle='Questions about an order, a custom arrangement or a delivery? Send us a note and our florists will get back to you.'
          />
          <div className='flex flex-wrap gap-3'>
            {STORE.phoneHref && (
              <a href={STORE.phoneHref} className='btn-primary'>
                <span className='h-4 w-4'><Icon name='phone' /></span>
                Call the studio
              </a>
            )}
            <a href='#contact-form' className={STORE.phoneHref ? 'btn-outline' : 'btn-primary'}>Write to us</a>
          </div>
        </div>
        <div className='relative flex justify-center md:justify-end'>
          <div aria-hidden='true' className='pointer-events-none absolute left-1/2 top-1/2 h-[85%] aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full bg-blush blur-3xl opacity-80' />
          <div aria-hidden='true' className='pointer-events-none absolute right-[10%] bottom-[5%] h-[45%] aspect-square rounded-full bg-sage-soft blur-3xl' />
          <img
            className='relative w-full max-w-[460px] animate-fade-up'
            src={assets.contact_img}
            alt='Illustration of a person calling the Florazon studio'
            width={727}
            height={545}
          />
        </div>
      </section>

      {/* Contact details */}
      <Reveal as='section' className='mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
        {CONTACT_CARDS.map((card, i) => (
          <a
            key={card.label}
            href={card.href}
            target={card.external ? '_blank' : undefined}
            rel={card.external ? 'noreferrer' : undefined}
            className={`group panel flex items-start gap-4 p-5 sm:p-6 ${i === CONTACT_CARDS.length - 1 ? 'md:col-span-2 xl:col-span-1' : ''} transition-all duration-500 ease-petal hover:-translate-y-1 hover:shadow-lift`}
          >
            <span className='flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blush to-sage-soft p-2.5 text-brand transition-transform duration-500 ease-petal group-hover:rotate-6'>
              <Icon name={card.icon} />
            </span>
            <span className='min-w-0 flex-1'>
              <span className='eyebrow block'>{card.label}</span>
              <span className='mt-1.5 block text-sm sm:text-[15px] font-medium text-ink break-words transition-colors group-hover:text-brand'>{card.value}</span>
            </span>
            <span className={`h-4 w-4 shrink-0 text-gray-400 ${card.href ? '' : 'invisible'} transition-all duration-300 group-hover:text-brand group-hover:-translate-y-0.5 group-hover:translate-x-0.5`}>
              <Icon name='arrow' />
            </span>
          </a>
        ))}
      </Reveal>

      {/* Form and map */}
      <Reveal as='section' className='mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] items-stretch'>
        <form id='contact-form' onSubmit={onSubmit} className='card scroll-mt-28 p-6 sm:p-9'>
          <h2 className='font-display text-2xl sm:text-3xl text-ink'>Send us a <span className='text-brand'>message</span></h2>
          <p className='mt-2 text-sm text-gray-500'>We usually reply within one working day.</p>

          <div className='mt-7 grid gap-4 sm:grid-cols-2'>
            <div>
              <label htmlFor='contact-name' className='field-label'>Your name</label>
              <input id='contact-name' name='name' value={form.name} onChange={onChange} autoComplete='name' required className='field h-12' />
            </div>
            <div>
              <label htmlFor='contact-email' className='field-label'>Email address</label>
              <input id='contact-email' name='email' type='email' value={form.email} onChange={onChange} autoComplete='email' required className='field h-12' />
            </div>
            <div>
              <label htmlFor='contact-phone' className='field-label'>Phone <span className='text-gray-400 font-normal'>(optional)</span></label>
              <input id='contact-phone' name='phone' type='tel' value={form.phone} onChange={onChange} autoComplete='tel' className='field h-12' />
            </div>
            <div>
              <label htmlFor='contact-topic' className='field-label'>Topic</label>
              <div className='relative'>
                <select id='contact-topic' name='topic' value={form.topic} onChange={onChange} className='field h-12 appearance-none pr-10 cursor-pointer'>
                  {TOPICS.map((topic) => <option key={topic}>{topic}</option>)}
                </select>
                <img src={assets.dropdown_icon} alt='' className='pointer-events-none absolute right-4 top-1/2 h-2.5 -translate-y-1/2 rotate-90 opacity-50' />
              </div>
            </div>
            <div className='sm:col-span-2'>
              <label htmlFor='contact-message' className='field-label'>Message</label>
              <textarea id='contact-message' name='message' value={form.message} onChange={onChange} rows={5} required className='field resize-y min-h-[140px] leading-relaxed' placeholder='Tell us about your order, the occasion or the flowers you have in mind.' />
            </div>
          </div>

          <div className='mt-6 flex flex-col sm:flex-row sm:items-center gap-4'>
            <button type='submit' className='btn-primary group w-full sm:w-auto py-4'>
              Send message
              <span className='h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5'><Icon name='send' /></span>
            </button>
            <p className='text-xs text-gray-500 leading-relaxed'>Opens your email app with your message ready to send.</p>
          </div>
        </form>

        <div className='flex flex-col gap-6'>
          <div className='card relative flex-1 min-h-[300px] overflow-hidden p-2'>
            <iframe
              title={`Map showing ${ADDRESS}`}
              src={MAP_EMBED}
              loading='lazy'
              referrerPolicy='no-referrer-when-downgrade'
              className='h-full w-full min-h-[284px] rounded-[1.25rem] border-0 [filter:saturate(0.8)_contrast(0.95)]'
            />
            <a
              href={DIRECTIONS}
              target='_blank'
              rel='noreferrer'
              className='group absolute bottom-5 left-5 right-5 sm:right-auto flex items-center gap-3 rounded-2xl border border-white/70 bg-white/75 py-2.5 pl-3 pr-4 shadow-glass backdrop-blur-xl transition-colors hover:bg-white/90'
            >
              <span className='h-8 w-8 shrink-0 rounded-xl bg-ink p-1.5 text-white'><Icon name='pin' /></span>
              <span className='min-w-0'>
                <span className='block text-sm font-medium text-ink'>Florazon studio</span>
                <span className='block text-xs text-gray-500'>Get directions</span>
              </span>
            </a>
          </div>

          <div className='panel p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
            <div>
              <h2 className='font-display text-xl text-ink'>Careers at Florazon</h2>
              <p className='mt-1 text-sm text-gray-500'>Learn more about our teams and job openings.</p>
            </div>
            <a href={`mailto:${STORE.email}?subject=Careers%20at%20Florazon`} className='btn-outline shrink-0 px-6 py-3'>Explore jobs</a>
          </div>
        </div>
      </Reveal>

      <Reveal><NewsletterBox /></Reveal>
    </div>
  )
}

export default Contact
