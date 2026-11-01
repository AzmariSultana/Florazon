import React from 'react'

// The store's standing promises as one quiet strip under the hero, divided by hairlines
const POLICIES = [
  {
    title: 'Hand-tied daily',
    text: 'Made on the day of delivery',
    icon: <path d='M12 21c-4.5-2.5-7-6-7-10a7 7 0 0 1 14 0c0 4-2.5 7.5-7 10zM12 7v6m-3-3h6' />,
  },
  {
    title: 'Cash on delivery',
    text: 'Pay when your flowers arrive',
    icon: <><rect x='3' y='6' width='18' height='12' rx='2.5' /><circle cx='12' cy='12' r='2.5' /></>,
  },
  {
    title: '1-day easy exchange',
    text: "Not right? We'll swap it",
    icon: <><path d='M4 9h13l-3-3' /><path d='M20 15H7l3 3' /></>,
  },
  {
    title: 'Friendly support',
    text: "Questions or changes, we're a message away",
    icon: <path d='M5 12a7 7 0 0 1 14 0v4a2 2 0 0 1-2 2h-1v-6h3M5 12v4a2 2 0 0 0 2 2h1v-6H5' />,
  },
]

const OurPolicy = () => {
  return (
    <section aria-label='Our promises' className='mt-10 lg:mt-6 grid grid-cols-2 xl:grid-cols-4 border-y border-line/80'>
      {POLICIES.map((policy, i) => (
        <div
          key={policy.title}
          className={`group flex flex-col items-start sm:flex-row sm:items-center gap-3 sm:gap-4 py-5 sm:py-6 px-3 sm:px-5 ${i % 2 === 1 ? 'border-l border-line/80' : ''} ${i >= 2 ? 'border-t xl:border-t-0 border-line/80' : ''} ${i === 2 ? 'xl:border-l' : ''}`}
        >
          <span className='flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blush to-sage-soft p-2.5 text-brand transition-transform duration-500 ease-petal group-hover:rotate-12'>
            <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.6' strokeLinecap='round' strokeLinejoin='round' className='h-full w-full' aria-hidden='true'>{policy.icon}</svg>
          </span>
          <div className='min-w-0'>
            <p className='text-sm font-medium text-ink'>{policy.title}</p>
            <p className='mt-0.5 text-xs text-gray-500 leading-snug'>{policy.text}</p>
          </div>
        </div>
      ))}
    </section>
  )
}

export default OurPolicy
