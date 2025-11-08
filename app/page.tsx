// app/page.tsx
import Link from "next/link"
import { ArrowDown, ArrowRight } from "lucide-react"
import ShopTeaser from "@/components/shop-teaser"
import ContactSection from "@/components/contact-section"
import PodcastSection from "@/components/podcast-section"
import FaqSection from "@/components/faq-section"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "LATE - OWN YOUR TIME",
  description: "Because success isn't about being on time. It's about making an impact when you arrive.",
  keywords: ["late", "time management", "success", "mindset", "lifestyle"],
  openGraph: {
    title: "LATE - OWN YOUR TIME",
    description: "Because success isn't about being on time. It's about making an impact when you arrive.",
    url: "https://late.ltd",
    siteName: "Late",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "LATE - OWN YOUR TIME",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LATE - OWN YOUR TIME",
    description: "Because success isn't about being on time. It's about making an impact when you arrive.",
    images: ["/og-image.jpg"],
  },
}

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
        <div className="container mx-auto px-4 z-20">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1
              className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-tight animate-fade-in text-white"
              style={{ animationDelay: "0.2s" }}
            >
              OWN YOUR TIME
            </h1>
            <p
              className="text-xl md:text-2xl text-zinc-300 max-w-2xl mx-auto animate-fade-in"
              style={{ animationDelay: "0.4s" }}
            >
              Because success isn't about being on time. It's about making an impact when you arrive.
            </p>
            <div className="pt-6 animate-fade-in" style={{ animationDelay: "0.6s" }}>
              <Link
                href="#mission"
                className="inline-flex items-center gap-2 bg-white text-black px-8 py-3 rounded-full font-medium hover:bg-purple-600 hover:text-white transition-all duration-300 transform hover:scale-105"
              >
                Explore
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce z-20">
          <Link href="#mission" aria-label="Scroll to mission section">
            <ArrowDown className="w-8 h-8 text-white/70" />
          </Link>
        </div>
      </section>

      {/* Mission Section */}
      <section id="mission" className="py-24 md:py-32 bg-zinc-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white">Our Mission</h2>
            <p className="text-xl md:text-2xl text-zinc-300 mb-16 leading-relaxed">
              At LATE, we're on a mission to redefine success and empower individuals to thrive on their own timelines.
              We believe that true achievement comes not from racing against the clock, but from making a meaningful
              impact when the moment is right.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-zinc-800 p-8 rounded-lg transform transition-all duration-300 hover:scale-105 hover:bg-zinc-700">
                <h3 className="text-2xl font-bold mb-4 text-purple-400">Embrace Your Pace</h3>
                <p className="text-zinc-300">
                  We encourage you to move at a rhythm that feels authentic to you, free from the pressure of arbitrary
                  deadlines.
                </p>
              </div>
              <div className="bg-zinc-800 p-8 rounded-lg transform transition-all duration-300 hover:scale-105 hover:bg-zinc-700">
                <h3 className="text-2xl font-bold mb-4 text-purple-400">Quality Over Speed</h3>
                <p className="text-zinc-300">
                  We value thoughtful progress and meaningful outcomes over rushed results and empty achievements.
                </p>
              </div>
              <div className="bg-zinc-800 p-8 rounded-lg transform transition-all duration-300 hover:scale-105 hover:bg-zinc-700">
                <h3 className="text-2xl font-bold mb-4 text-purple-400">Redefine Success</h3>
                <p className="text-zinc-300">
                  We're here to challenge conventional notions of success and help you create a life that aligns with
                  your true values.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter CTA (replaces WeeklyInsights to avoid build-time imports) */}
      <section className="py-20 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Weekly Insights</h2>
            <p className="text-lg text-gray-600 dark:text-zinc-400 mb-8">
              Thought-provoking, soul-soothing essays—delivered once a week.
            </p>
            <Link
              href="/newsletter"
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Explore the Newsletter
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Shop Section */}
      <ShopTeaser />

      {/* Podcast Section */}
      <PodcastSection />

      {/* FAQ Section */}
      <FaqSection />

      {/* Contact Section */}
      <ContactSection />
    </main>
  )
}
