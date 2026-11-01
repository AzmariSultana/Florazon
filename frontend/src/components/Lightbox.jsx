import React, { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

const MIN_SCALE = 1
const MAX_SCALE = 4
const STEP = 0.5

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y)

const Icon = ({ d, className = 'h-5 w-5' }) => (
  <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round' className={className} aria-hidden='true'>{d}</svg>
)
const ICONS = {
  close: <path d='M6 6l12 12M18 6L6 18' />,
  plus: <><circle cx='11' cy='11' r='7' /><path d='M11 8v6M8 11h6M20 20l-4-4' /></>,
  minus: <><circle cx='11' cy='11' r='7' /><path d='M8 11h6M20 20l-4-4' /></>,
  reset: <><path d='M4 4v6h6' /><path d='M20 12a8 8 0 1 1-2.3-5.7L20 8' /></>,
  prev: <path d='M15 5l-7 7 7 7' />,
  next: <path d='M9 5l7 7-7 7' />,
}

const toolButton = 'flex h-11 w-11 items-center justify-center rounded-full text-white/90 transition-colors hover:bg-white/15 hover:text-white disabled:opacity-35 disabled:hover:bg-transparent focus-visible:outline-white'

// Full-screen image viewer: the photo is shown as large as fits at its own aspect ratio, and can be
// zoomed (buttons, wheel, double click, pinch) and panned (drag) when enlarged.
// images: full-resolution URLs. Esc closes, arrows switch images, + / - / 0 zoom.
const Lightbox = ({ images, index, alt, onClose, onIndexChange }) => {
  const [visible, setVisible] = useState(false)
  const [scale, setScale] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const stageRef = useRef(null)
  const closeRef = useRef(null)
  const imageRef = useRef(null)
  const pointers = useRef(new Map())
  const gesture = useRef(null)
  const count = images.length

  const resetView = useCallback(() => { setScale(1); setOffset({ x: 0, y: 0 }) }, [])

  // Keep the enlarged photo from being dragged completely out of view
  const limitOffset = useCallback((next, s) => {
    const stage = stageRef.current
    if (!stage || s <= 1) return { x: 0, y: 0 }
    const maxX = (stage.clientWidth * (s - 1)) / 2
    const maxY = (stage.clientHeight * (s - 1)) / 2
    return { x: clamp(next.x, -maxX, maxX), y: clamp(next.y, -maxY, maxY) }
  }, [])

  const zoomTo = useCallback((next) => {
    const s = clamp(next, MIN_SCALE, MAX_SCALE)
    setScale(s)
    setOffset((o) => limitOffset(o, s))
  }, [limitOffset])

  const close = useCallback(() => {
    setVisible(false)
    setTimeout(onClose, 220)
  }, [onClose])

  const go = useCallback((delta) => {
    if (count < 2) return
    onIndexChange((index + delta + count) % count)
  }, [count, index, onIndexChange])

  // Open animation, page scroll lock and focus on the close button
  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(true))
    const previousOverflow = document.body.style.overflow
    const previousFocus = document.activeElement
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      cancelAnimationFrame(frame)
      document.body.style.overflow = previousOverflow
      previousFocus?.focus?.()
    }
  }, [])

  // A new photo starts fitted to the screen
  useEffect(() => { resetView(); setLoaded(false) }, [index, resetView])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') close()
      else if (e.key === 'ArrowRight') go(1)
      else if (e.key === 'ArrowLeft') go(-1)
      else if (e.key === '+' || e.key === '=') zoomTo(scale + STEP)
      else if (e.key === '-') zoomTo(scale - STEP)
      else if (e.key === '0') resetView()
      else return
      e.preventDefault()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [close, go, zoomTo, resetView, scale])

  // Wheel zoom needs a non-passive listener so the page itself does not scroll
  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return undefined
    const onWheel = (e) => { e.preventDefault(); zoomTo(scale * (e.deltaY < 0 ? 1.15 : 1 / 1.15)) }
    stage.addEventListener('wheel', onWheel, { passive: false })
    return () => stage.removeEventListener('wheel', onWheel)
  }, [scale, zoomTo])

  // Pointer events cover mouse drag, touch pan and two-finger pinch
  const onPointerDown = (e) => {
    stageRef.current.setPointerCapture(e.pointerId)
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    const pts = [...pointers.current.values()]
    if (pts.length === 2) gesture.current = { type: 'pinch', startDistance: distance(pts[0], pts[1]), startScale: scale }
    else if (pts.length === 1) gesture.current = { type: 'pan', start: { x: e.clientX, y: e.clientY }, startOffset: offset, moved: false }
    setDragging(true)
  }

  const onPointerMove = (e) => {
    if (!pointers.current.has(e.pointerId)) return
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    const g = gesture.current
    if (!g) return
    if (g.type === 'pinch') {
      const pts = [...pointers.current.values()]
      if (pts.length === 2) zoomTo(g.startScale * (distance(pts[0], pts[1]) / g.startDistance))
    } else if (g.type === 'pan') {
      const dx = e.clientX - g.start.x
      const dy = e.clientY - g.start.y
      if (Math.abs(dx) + Math.abs(dy) > 4) g.moved = true
      if (scale > 1) setOffset(limitOffset({ x: g.startOffset.x + dx, y: g.startOffset.y + dy }, scale))
    }
  }

  const onPointerUp = (e) => {
    pointers.current.delete(e.pointerId)
    const g = gesture.current
    lastGestureMoved.current = Boolean(g?.moved) || g?.type === 'pinch'
    // Fitted photo on a touch screen: a horizontal swipe changes the image
    if (g?.type === 'pan' && scale === 1 && e.pointerType !== 'mouse') {
      const dx = e.clientX - g.start.x
      if (Math.abs(dx) > 60) go(dx < 0 ? 1 : -1)
    }
    if (pointers.current.size === 0) { gesture.current = null; setDragging(false) }
    else if (pointers.current.size === 1) {
      const [p] = pointers.current.values()
      gesture.current = { type: 'pan', start: p, startOffset: offset, moved: true }
    }
  }

  const onDoubleClick = () => (scale > 1 ? resetView() : zoomTo(2.5))

  // Clicking the dim backdrop closes the viewer. Pointer capture can report clicks on the photo as clicks
  // on the stage, so the photo's on-screen box decides; a drag that just ended is not a click.
  const lastGestureMoved = useRef(false)
  const onBackdropClick = (e) => {
    if (lastGestureMoved.current) return
    // The image element fills the stage; the photo itself is the centred, aspect-fitted area inside it
    const img = imageRef.current
    let onPhoto = false
    if (img?.naturalWidth) {
      const box = img.getBoundingClientRect()
      const ratio = img.naturalWidth / img.naturalHeight
      const w = Math.min(box.width, box.height * ratio)
      const h = w / ratio
      const left = box.left + (box.width - w) / 2
      const top = box.top + (box.height - h) / 2
      onPhoto = e.clientX >= left && e.clientX <= left + w && e.clientY >= top && e.clientY <= top + h
    }
    if (!onPhoto && !e.target.closest('button')) close()
  }

  return createPortal(
    <div
      role='dialog'
      aria-modal='true'
      aria-label={`${alt}: image viewer`}
      className={`fixed inset-0 z-[70] flex flex-col bg-ink/90 backdrop-blur-sm transition-opacity duration-200 ease-out ${visible ? 'opacity-100' : 'opacity-0'}`}
    >
      {/* Top bar */}
      <div className='relative z-10 flex items-center justify-between gap-3 px-3 py-3 sm:px-5'>
        <p className='min-w-0 truncate pl-2 text-sm text-white/80'>
          {alt}{count > 1 && <span className='ml-2 text-white/50'>{index + 1} / {count}</span>}
        </p>
        <div className='flex shrink-0 items-center gap-1 rounded-full bg-white/10 p-1 backdrop-blur-md'>
          <button type='button' onClick={() => zoomTo(scale - STEP)} disabled={scale <= MIN_SCALE} aria-label='Zoom out' className={toolButton}><Icon d={ICONS.minus} /></button>
          <span className='hidden w-12 text-center text-xs tabular-nums text-white/80 sm:block' aria-live='polite'>{Math.round(scale * 100)}%</span>
          <button type='button' onClick={() => zoomTo(scale + STEP)} disabled={scale >= MAX_SCALE} aria-label='Zoom in' className={toolButton}><Icon d={ICONS.plus} /></button>
          <button type='button' onClick={resetView} disabled={scale === 1} aria-label='Fit to screen' className={toolButton}><Icon d={ICONS.reset} /></button>
          <span className='mx-1 h-6 w-px bg-white/20' aria-hidden='true' />
          <button ref={closeRef} type='button' onClick={close} aria-label='Close image viewer' className={toolButton}><Icon d={ICONS.close} /></button>
        </div>
      </div>

      {/* Stage: the photo is fitted inside with object-contain, so it is never cropped or distorted */}
      <div
        ref={stageRef}
        onClick={onBackdropClick}
        onDoubleClick={onDoubleClick}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className={`relative flex flex-1 touch-none select-none items-center justify-center overflow-hidden px-3 pb-3 sm:px-16 sm:pb-8 ${scale > 1 ? (dragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-zoom-in'}`}
      >
        {!loaded && <span className='absolute h-9 w-9 animate-spin rounded-full border-2 border-white/25 border-t-white' role='status' aria-label='Loading image' />}
        <img
          ref={imageRef}
          key={images[index]}
          src={images[index]}
          alt={alt}
          draggable={false}
          onLoad={() => setLoaded(true)}
          style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})` }}
          className={`h-full w-full object-contain [filter:drop-shadow(0_24px_48px_rgba(0,0,0,0.45))] ${dragging ? '' : 'transition-transform duration-300 ease-petal'} ${visible && loaded ? 'opacity-100' : 'opacity-0'} transition-opacity`}
        />

        {count > 1 && (
          <>
            <button type='button' onClick={(e) => { e.stopPropagation(); go(-1) }} onPointerDown={(e) => e.stopPropagation()} aria-label='Previous image' className={`${toolButton} absolute left-5 hidden sm:flex bg-white/10 backdrop-blur-md`}><Icon d={ICONS.prev} /></button>
            <button type='button' onClick={(e) => { e.stopPropagation(); go(1) }} onPointerDown={(e) => e.stopPropagation()} aria-label='Next image' className={`${toolButton} absolute right-5 hidden sm:flex bg-white/10 backdrop-blur-md`}><Icon d={ICONS.next} /></button>
          </>
        )}
      </div>

      {/* Phones: previous / next sit below the photo so they never cover it */}
      {count > 1 && (
        <div className='flex items-center justify-center gap-6 pb-2 sm:hidden'>
          <button type='button' onClick={() => go(-1)} aria-label='Previous image' className={`${toolButton} bg-white/10`}><Icon d={ICONS.prev} /></button>
          <span className='text-xs tabular-nums text-white/70'>{index + 1} / {count}</span>
          <button type='button' onClick={() => go(1)} aria-label='Next image' className={`${toolButton} bg-white/10`}><Icon d={ICONS.next} /></button>
        </div>
      )}
      <p className='pb-4 text-center text-[11px] text-white/45'>
        <span className='hidden sm:inline'>Scroll or double-click to zoom · drag to move · Esc to close</span>
        <span className='sm:hidden'>Pinch or double-tap to zoom · drag to move</span>
      </p>
    </div>,
    document.body
  )
}

export default Lightbox
