import { ArrowDownRight, Menu } from 'lucide-react'

export default function Home() {
  return (
    <main className="relative min-h-svh overflow-hidden bg-[#071525] text-white">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/go-within-ocean.png')" }}
      />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-[#091a31]/35 via-[#11162c]/25 to-[#030b17]/75" />
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_63%_38%,rgba(255,100,61,0.2),transparent_34%),linear-gradient(90deg,rgba(3,13,28,0.34),transparent_45%,rgba(9,6,28,0.2))]" />

      <header className="relative z-10 flex items-center justify-between px-6 py-7 sm:px-10 lg:px-16 lg:py-9">
        <a href="#top" className="group flex items-center gap-3" aria-label="Go Within home">
          <span className="flex size-9 items-center justify-center rounded-full border border-white/45 bg-white/10 backdrop-blur-sm transition group-hover:bg-white/20">
            <span className="size-2 rounded-full bg-orange-200 shadow-[0_0_18px_rgba(255,196,140,0.9)]" />
          </span>
          <span className="text-[11px] font-medium uppercase tracking-[0.34em] text-white/90">Go Within</span>
        </a>
        <button type="button" className="flex size-11 items-center justify-center rounded-full border border-white/35 bg-black/10 text-white backdrop-blur-md transition hover:bg-white/15" aria-label="Open navigation">
          <Menu className="size-5" strokeWidth={1.5} />
        </button>
      </header>

      <section id="top" className="relative z-10 flex min-h-[calc(100svh-96px)] items-center justify-center px-6 pb-24 pt-10 text-center sm:px-10">
        <div className="flex max-w-3xl flex-col items-center">
          <p className="mb-6 text-[10px] font-medium uppercase tracking-[0.5em] text-orange-100/80 sm:text-xs">A practice of presence</p>
          <h1 className="font-serif text-[clamp(4.25rem,15vw,11rem)] font-light leading-[0.8] tracking-[-0.075em] text-white drop-shadow-[0_4px_28px_rgba(0,0,0,0.35)]">Go Within</h1>
          <p className="mt-9 max-w-md text-sm font-light leading-7 text-white/75 sm:text-base sm:leading-8">Find the quiet beneath the noise.<br className="hidden sm:block" /> Return to the part of you that already knows.</p>
          <a href="#begin" className="mt-9 inline-flex items-center gap-4 rounded-full border border-white/50 bg-white px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#101a2b] shadow-[0_8px_36px_rgba(0,0,0,0.2)] transition hover:-translate-y-0.5 hover:bg-orange-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#101a2b]">
            Begin the journey
            <ArrowDownRight className="size-4" strokeWidth={1.5} />
          </a>
        </div>
      </section>

      <div className="absolute bottom-7 left-6 right-6 z-10 flex items-end justify-between text-[10px] uppercase tracking-[0.28em] text-white/55 sm:bottom-9 sm:left-10 sm:right-10 lg:left-16 lg:right-16">
        <span>46° 12&apos; N / 124° 06&apos; W</span>
        <span className="hidden sm:block">Scroll to explore</span>
        <span>Vol. 01</span>
      </div>
    </main>
  )
}
