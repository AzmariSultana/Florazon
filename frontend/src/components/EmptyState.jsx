import React from 'react'
import { Link } from 'react-router-dom'
import Blossom from './Blossom'

// Centred message for empty and signed-out states, with one clear next step
const EmptyState = ({ title, text, action }) => (
  <div className='panel px-6 py-16 sm:py-20 text-center animate-fade-up'>
    <span className='mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blush to-sage-soft'>
      <Blossom className='h-8 w-8 text-brand' />
    </span>
    <p className='mt-6 font-display text-2xl text-ink'>{title}</p>
    {text && <p className='mx-auto mt-2 max-w-sm text-sm text-gray-500 leading-relaxed'>{text}</p>}
    {action && <Link to={action.to} state={action.state} className='btn-primary mt-8'>{action.label}</Link>}
  </div>
)

export default EmptyState
