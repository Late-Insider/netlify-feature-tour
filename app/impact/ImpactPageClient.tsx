"use client"

import { useState } from "react"
import Link from "next/link"
import { Users, Palette, Trophy, Heart, BookOpen, Paintbrush, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import AuctionWaitlistModal from "@/components/auction-waitlist-modal"

export default function ImpactPageClient() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 dark:from-zinc-950 dark:to-purple-950/20">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors font-medium group"
        >
          <Home className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
          Back to Home
        </Link>
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Our Impact
          </h1>
          <p className="text-xl text-gray-700 dark:text-zinc-300 leading-relaxed">
            At LATE, we believe in the transformative power of art and community. Through The LATE Auction, we're
            building a platform where creativity meets purpose, and every piece tells a story of positive change.
          </p>
        </div>
      </section>

      {/* The LATE Auction Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl dark:shadow-purple-500/10 overflow-hidden border border-purple-100 dark:border-purple-900/30">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-white">
              <div className="flex items-center gap-3 mb-4">
                <Trophy className="w-8 h-8" />
                <h2 className="text-3xl md:text-4xl font-bold">The LATE Auction</h2>
              </div>
              <p className="text-lg text-purple-100">
                Exclusive artwork curated for collectors who value creativity and impact
              </p>
            </div>

            <div className="p-8">
              <div className="mb-8">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-bold text-purple-600 dark:text-purple-400">€5,000</span>
                  <span className="text-gray-600 dark:text-zinc-400">Starting Price</span>
                </div>
                <p className="text-gray-600 dark:text-zinc-400">For limited edition pieces from emerging artists</p>
              </div>

              {/* Coming Soon Items */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {[
                  { title: "Abstract Dreams", artist: "Artist Collaboration 1" },
                  { title: "Digital Renaissance", artist: "Artist Collaboration 2" },
                  { title: "Modern Horizons", artist: "Artist Collaboration 3" },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-zinc-800 dark:to-purple-900/20 p-6 rounded-xl border border-purple-200 dark:border-purple-800/50 shadow-lg shadow-purple-500/10"
                  >
                    <div className="aspect-square bg-gradient-to-br from-purple-200 to-pink-200 dark:from-purple-900/40 dark:to-pink-900/40 rounded-lg mb-4 flex items-center justify-center">
                      <Paintbrush className="w-12 h-12 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="font-bold text-lg mb-1 text-gray-900 dark:text-white">{item.title}</h3>
                    <p className="text-sm text-purple-600 dark:text-purple-400 mb-2">{item.artist}</p>
                    <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-semibold px-3 py-1 rounded-full inline-block">
                      Coming Soon
                    </div>
                  </div>
                ))}
              </div>

              {/* Exclusive Benefits */}
              <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-xl border border-purple-200 dark:border-purple-800/50 mb-8">
                <h3 className="font-bold text-xl mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                  <Heart className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  Exclusive Benefits
                </h3>
                <ul className="space-y-3">
                  {[
                    "Certificate of Authenticity for every piece",
                    "Direct connection with featured artists",
                    "First access to new collections",
                    "Invitation to exclusive LATE community events",
                  ].map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3 text-gray-700 dark:text-zinc-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-600 dark:bg-purple-400 mt-2 flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Button */}
              <div className="text-center">
                <Button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg font-semibold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300"
                >
                  Join the Auction
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Initiatives */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Community Initiatives
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Mentorship Program */}
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-xl shadow-lg dark:shadow-purple-500/10 border border-purple-100 dark:border-purple-900/30 hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4 shadow-lg shadow-purple-500/30">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Mentorship Program</h3>
              <p className="text-gray-600 dark:text-zinc-400 mb-4">
                Connecting established artists with emerging talent to foster growth and learning.
              </p>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-zinc-400">
                {["One-on-one guidance", "Portfolio reviews", "Industry insights", "Networking opportunities"].map(
                  (item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-600 dark:bg-purple-400" />
                      {item}
                    </li>
                  ),
                )}
              </ul>
            </div>

            {/* Educational Grants */}
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-xl shadow-lg dark:shadow-purple-500/10 border border-purple-100 dark:border-purple-900/30 hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4 shadow-lg shadow-purple-500/30">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Educational Grants</h3>
              <p className="text-gray-600 dark:text-zinc-400 mb-4">
                Supporting artists in their educational journey with financial assistance and resources.
              </p>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-zinc-400">
                {["Tuition support", "Workshop access", "Material stipends", "Online course subscriptions"].map(
                  (item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-600 dark:bg-purple-400" />
                      {item}
                    </li>
                  ),
                )}
              </ul>
            </div>

            {/* Creative Arts Spaces */}
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-xl shadow-lg dark:shadow-purple-500/10 border border-purple-100 dark:border-purple-900/30 hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4 shadow-lg shadow-purple-500/30">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Creative Arts Spaces</h3>
              <p className="text-gray-600 dark:text-zinc-400 mb-4">
                Providing accessible studio spaces and equipment for artists to create and collaborate.
              </p>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-zinc-400">
                {[
                  "Affordable studio rentals",
                  "Equipment access",
                  "Collaborative workshops",
                  "Exhibition opportunities",
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-600 dark:bg-purple-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Our Commitment */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto bg-white dark:bg-zinc-900 p-12 rounded-2xl shadow-xl dark:shadow-purple-500/10 border border-purple-100 dark:border-purple-900/30">
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Our Commitment</h2>
          <p className="text-lg text-gray-700 dark:text-zinc-300 leading-relaxed">
            Every purchase through The LATE Auction directly contributes to these initiatives. We're not just selling
            art; we're building a sustainable ecosystem where creativity thrives, artists are supported, and collectors
            become part of a meaningful movement. Together, we're creating a future where art and impact go hand in
            hand.
          </p>
        </div>
      </section>

      {/* Modal */}
      <AuctionWaitlistModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}
