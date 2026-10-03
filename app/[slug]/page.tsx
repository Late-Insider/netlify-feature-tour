import Link from 'next/link'
import { NavigationDrawer } from '@/components/navigation-drawer'

const pages: Record<string, string> = {
  'our-story': 'Our Story',
  echo: 'Echo (Daily Essay)',
  gallery: 'The Gallery',
  initiatives: 'Initiatives',
  partnerships: 'Partnerships',
}

export function generateStaticParams() {
  return Object.keys(pages).map((slug) => ({ slug }))
}

export default async function PlaceholderPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const title = pages[slug] ?? 'The Practice'

  return (
    <main className="relative flex min-h-svh overflow-hidden bg-[#071525] text-white">
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,100,61,0.18),transparent_32%),linear-gradient(135deg,#071525_0%,#10162c_55%,#24152a_100%)]" />
      <div aria-hidden="true" className="absolute inset-0 opacity-30 bg-[url('/images/go-within-ocean.png')] bg-cover bg-center mix-blend-screen" />
      <header className="relative z-10 flex w-full items-center justify-between self-start px-6 py-7 sm:px-10 lg:px-16 lg:py-9">
        <Link href="/" className="text-[11px] font-medium uppercase tracking-[0.34em] text-white/90 transition hover:text-[#edb17a]">Go Within</Link>
        <NavigationDrawer />
      </header>
      <section className="absolute inset-0 flex items-center justify-center px-6 text-center">
        <div className="hero-content flex max-w-2xl flex-col items-center">
          <p className="mb-7 text-[10px] uppercase tracking-[0.42em] text-[#c28b61]">The Practice</p>
          <h1 className="font-serif text-[clamp(3.5rem,10vw,8rem)] font-light leading-none tracking-[-0.06em]">{title}</h1>
          <p className="mt-8 text-sm font-light leading-7 text-white/65 sm:text-base">Content arriving tomorrow. Welcome to the practice.</p>
          <Link href="/" className="mt-10 border-b border-[#c28b61] pb-2 text-[10px] uppercase tracking-[0.3em] text-[#edb17a] transition hover:text-white">Return home</Link>
        </div>
      </section>
    </main>
  )
}
