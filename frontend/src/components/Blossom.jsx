import React from 'react'

// A small five-petal flower used as an ornament on panels and notes
const Blossom = ({ className = '' }) => (
  <svg viewBox='0 0 40 40' className={className} aria-hidden='true'>
    {[0, 72, 144, 216, 288].map((angle) => (
      <ellipse key={angle} cx='20' cy='11' rx='5.5' ry='9' transform={`rotate(${angle} 20 20)`} fill='currentColor' opacity='0.35' />
    ))}
    <circle cx='20' cy='20' r='3.5' fill='currentColor' />
  </svg>
)

export default Blossom
