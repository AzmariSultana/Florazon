import { useEffect } from 'react'

const DEFAULT_TITLE = 'Florazon | Fresh flowers, hand-tied in Dhaka'
const DEFAULT_DESCRIPTION = 'Order fresh, hand-tied flowers from Florazon: single stems, mixed bouquets, wedding garlands and flower baskets, delivered with cash on delivery.'

// Sets the browser tab title (e.g. "Cart | Florazon") and, when given, the page's meta description
const useDocumentTitle = (title, description) => {
  useEffect(() => {
    document.title = title ? `${title} | Florazon` : DEFAULT_TITLE
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute('content', description || DEFAULT_DESCRIPTION)
  }, [title, description])
}

export default useDocumentTitle
