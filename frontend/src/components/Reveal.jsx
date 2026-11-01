import React, { useEffect, useRef, useState } from 'react'

// Fades and lifts its content the first time it scrolls into view.
// delay (ms) staggers items in a row; without IntersectionObserver the content simply shows.
const Reveal = ({ children, className = '', delay = 0, as = 'div' }) => {
  const Tag = as
  const ref = useRef(null)
  const [shown, setShown] = useState(typeof IntersectionObserver === 'undefined')

  useEffect(() => {
    if (shown || !ref.current) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setShown(true)
        observer.disconnect()
      }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 })
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [shown])

  return (
    <Tag
      ref={ref}
      style={{ transitionDelay: shown ? `${delay}ms` : '0ms' }}
      className={`transition-[opacity,transform] duration-[900ms] ease-petal ${shown ? 'opacity-100' : 'opacity-0 translate-y-6'} ${className}`}
    >
      {children}
    </Tag>
  )
}

export default Reveal
