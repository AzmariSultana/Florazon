import { useEffect } from 'react'

// Sets the browser tab title, e.g. "Cart | Florazon"
const useDocumentTitle = (title) => {
  useEffect(() => {
    document.title = title ? `${title} | Florazon` : 'Florazon'
  }, [title])
}

export default useDocumentTitle
