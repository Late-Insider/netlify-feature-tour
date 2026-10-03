'use client'

import { useEffect, useState } from 'react'
import { ArrowDownRight, X } from 'lucide-react'
import { NavigationDrawer } from '@/components/navigation-drawer'

function BronzeKeyMark({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <circle cx="16" cy="15" r="8.25" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="16" cy="15" r="3.1" stroke="currentColor" strokeWidth="1.4" />
      <path d="M22.4 20.8 38.8 37.2M31.4 29.8l3.5-3.5M35.5 33.9l3.1-3.1" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.5 6.9c-2.4-1.1-5-.7-6.9.7M9.1 22.8c1.8 1.3 4.1 1.7 6.3 1" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity=".7" />
    </svg>
  )
}

function InstagramIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3.25" y="3.25" width="17.5" height="17.5" rx="5" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="4.1" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="17.35" cy="6.8" r="1" fill="currentColor" />
    </svg>
  )
}

function TikTokIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M14.2 4v10.1a4.3 4.3 0 1 1-3.4-4.2v2.35a2 2 0 1 0 1.1 1.85V4h2.3c.25 1.2 1.02 2.07 2.3 2.42v2.28A5.45 5.45 0 0 1 14.2 8V4Z" fill="currentColor" />
    </svg>
  )
}

export default function Home() {
  const [showSubscribe, setShowSubscribe] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <NavigationDrawer />
    <main className="relative min-h-svh overflow-hidden bg-[#071525] text-white">
      <div aria-hidden="true" className="hero-parallax absolute inset-[-8%] bg-cover bg-center" style={{ backgroundImage: "url('/images/go-within-ocean.png')", transform: `translate3d(0, ${scrollY * 0.12}px, 0) scale(1.08)` }} />
      <div aria-hidden="true" className="hero-overlay absolute inset-0 bg-gradient-to-b from-[#091a31]/35 via-[#11162c]/25 to-[#030b17]/80" />
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_63%_38%,rgba(255,100,61,0.2),transparent_34%),linear-gradient(90deg,rgba(3,13,28,0.34),transparent_45%,rgba(9,6,28,0.2))]" />

      <header className="relative z-10 flex items-center justify-between px-6 py-7 sm:px-10 lg:px-16 lg:py-9">
        <a href="#top" className="group flex items-center gap-3" aria-label="Go Within home">
          <BronzeKeyMark className="size-10 text-[#c28b61] drop-shadow-[0_0_14px_rgba(210,153,98,0.42)] transition group-hover:text-[#edb17a]" />
          <span className="text-[11px] font-medium uppercase tracking-[0.34em] text-white/90">Go Within</span>
        </a>
      </header>

      <section id="top" className="relative z-10 flex min-h-[calc(100svh-96px)] items-center justify-center px-6 pb-24 pt-10 text-center sm:px-10">
        <div className="hero-content flex max-w-3xl flex-col items-center">
          <h2 className="mb-6 font-serif text-xl font-light italic tracking-wide text-orange-50/90 sm:text-2xl">A Daily Invitation to Presence.</h2>
          <h1 className="font-serif text-[clamp(4.25rem,15vw,11rem)] font-light leading-[0.8] tracking-[-0.075em] text-white drop-shadow-[0_4px_28px_rgba(0,0,0,0.35)]">Go Within</h1>
          <p className="mt-5 max-w-xl text-sm font-light leading-7 text-white/75 sm:text-base sm:leading-8">Find the quiet beneath the noise. Every day, we publish a single, five-minute reflection designed to return you to the part of you that already knows. Welcome to the practice.</p>
          <button type="button" onClick={() => setShowSubscribe((current) => !current)} className="mt-9 inline-flex items-center gap-4 rounded-full border border-white/50 bg-white px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#101a2b] shadow-[0_8px_36px_rgba(0,0,0,0.2)] transition hover:-translate-y-0.5 hover:bg-orange-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#101a2b]">
            Subscribe to Echo
            <ArrowDownRight className={`size-4 transition-transform ${showSubscribe ? 'rotate-90' : ''}`} strokeWidth={1.5} />
          </button>
          <div className={`grid transition-[grid-template-rows,opacity,margin] duration-700 ease-out ${showSubscribe ? 'mt-5 grid-rows-[1fr] opacity-100' : 'mt-0 grid-rows-[0fr] opacity-0'}`}>
            <form className="min-h-0 overflow-hidden" onSubmit={(event) => event.preventDefault()}>
              <div className="flex w-[min(90vw,26rem)] items-center rounded-full border border-white/30 bg-[#071525]/35 p-1.5 backdrop-blur-md">
                <label htmlFor="email" className="sr-only">Email address</label>
                <input id="email" type="email" required placeholder="Your email address" className="min-w-0 flex-1 bg-transparent px-4 py-2 text-sm text-white outline-none placeholder:text-white/45" />
                <button type="submit" className="rounded-full bg-[#c28b61] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#101a2b] transition hover:bg-[#edb17a]">Join</button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <footer className="absolute bottom-7 left-6 right-6 z-10 flex items-end justify-between text-[10px] uppercase tracking-[0.28em] text-white/55 sm:bottom-9 sm:left-10 sm:right-10 lg:left-16 lg:right-16">
        <span>Follow the Practice</span>
        <div className="flex items-center gap-4 normal-case tracking-normal text-white/65">
          <a href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="Follow Go Within on X" className="transition hover:text-white"><X className="size-4" strokeWidth={1.5} /></a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Follow Go Within on Instagram" className="transition hover:text-white"><InstagramIcon className="size-4" /></a>
          <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" aria-label="Follow Go Within on TikTok" className="transition hover:text-white"><TikTokIcon className="size-4" /></a>
        </div>
        <span className="hidden sm:block">Vol. 01</span>
      </footer>
    </main>
    </>
  )
}

