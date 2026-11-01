import React from 'react'

// "LATEST BLOOMS" -> "Latest Blooms": headings are written in caps by callers but set in title case
const titleCase = (text = '') => text.toLowerCase().replace(/(^|[\s-])\S/g, (c) => c.toUpperCase())

// Section heading in the display serif, with the second word in rose.
// Use as='h1' for the main title of a page; eyebrow and subtitle are optional.
const Title = ({ text1, text2, as = 'h2', eyebrow, subtitle, align = 'left', size = 'text-3xl sm:text-4xl' }) => {
  const Tag = as
  const centered = align === 'center'
  return (
    <div className={`mb-6 ${centered ? 'text-center mx-auto' : ''}`}>
      {eyebrow && <p className='eyebrow mb-3'>{eyebrow}</p>}
      <Tag className={`font-display font-normal leading-tight text-ink ${size}`}>
        {titleCase(text1)} <span className='text-brand'>{titleCase(text2)}</span>
      </Tag>
      {subtitle && <p className={`mt-3 text-sm sm:text-base text-gray-500 leading-relaxed max-w-xl ${centered ? 'mx-auto' : ''}`}>{subtitle}</p>}
    </div>
  )
}

export default Title
