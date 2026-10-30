import React from 'react'

// Section heading: "TEXT1 TEXT2 ——". Use as='h1' for the main title of a page.
const Title = ({ text1, text2, as = 'h2' }) => {
  const Tag = as
  return (
    <div className='inline-flex gap-2 items-center mb-3'>
      <Tag className='text-gray-500 font-normal'>{text1} <span className='text-gray-700 font-medium'>{text2}</span></Tag>
      <span className='w-8 sm:w-12 h-[1px] sm:h-[1.5px] bg-gray-700' aria-hidden='true'></span>
    </div>
  )
}

export default Title
