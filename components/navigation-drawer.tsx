'use client'

import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'

const links = [
  { label: 'Our Story', href: '/our-story' },
  { label: 'Echo (Daily Essay)', href: '/echo' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Initiatives', href: '/initiatives' },
  { label: 'Partnerships', href: '/partnerships' },
]

export function NavigationDrawer() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('keydown', closeOnEscape)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', closeOnEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed right-6 top-7 z-20 flex size-11 items-center justify-center rounded-full border border-white/35 bg-black/10 text-white backdrop-blur-md transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:right-10 lg:right-16 lg:top-9"
        aria-label="Open navigation"
        aria-expanded={isOpen}
        aria-controls="site-navigation"
      >
        <Menu className="size-5" strokeWidth={1.5} />
      </button>

      <div className={`fixed inset-0 z-[100] transition ${isOpen ? 'pointer-events-auto visible' : 'pointer-events-none invisible'}`}>
        <button
          type="button"
          className={`absolute inset-0 z-0 bg-[#030b17]/60 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsOpen(false)}
          aria-label="Close navigation overlay"
        />
        <aside
          id="site-navigation"
          aria-label="Site navigation"
          aria-hidden={!isOpen}
          className={`drawer-panel absolute right-0 top-0 z-[101] flex h-full w-[min(88vw,31rem)] flex-col bg-[#071525] px-7 py-7 text-white shadow-[-20px_0_80px_rgba(0,0,0,0.35)] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] sm:px-12 sm:py-10 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-7">
            <span className="text-[10px] uppercase tracking-[0.38em] text-[#c28b61]">The Practice</span>
            <button type="button" onClick={() => setIsOpen(false)} className="flex size-11 items-center justify-center rounded-full border border-white/20 text-white/75 transition hover:border-white/60 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white" aria-label="Close navigation">
              <X className="size-5" strokeWidth={1.5} />
            </button>
          </div>
          <nav className="flex flex-1 flex-col justify-center gap-5" aria-label="Primary navigation">
            {links.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="group flex items-baseline gap-5 border-b border-white/10 pb-5 text-2xl font-light tracking-tight text-white/85 opacity-90 transition-all duration-300 hover:pl-2 hover:text-white hover:opacity-100 sm:text-3xl"
                style={{ transitionDelay: isOpen ? `${index * 45}ms` : '0ms' }}
              >
                <span className="text-[10px] font-medium tracking-[0.2em] text-[#c28b61]">0{index + 1}</span>
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>
          <p className="max-w-xs text-xs font-light leading-6 text-white/45">A quiet place for reflection, attention, and the return to what is already here.</p>
        </aside>
      </div>
    </>
  )
}
