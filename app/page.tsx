import Navbar from "@/components/navbar"
import { ThemeToggle } from "@/components/theme-toggle"
import { WeeklyInsights } from "@/components/weekly-insights"
import { PodcastSection } from "@/components/podcast-section"
import { ShopTeaser } from "@/components/shop-teaser"
import { ContactSection } from "@/components/contact-section"
import FaqSection from "@/components/faq-section"
import { AuctionWaitlistModal } from "@/components/auction-waitlist-modal"

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-20">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>

        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">LATE - OWN YOUR TIME</h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Redefine success on your own terms. Join a movement that celebrates intentional living and meaningful
            impact.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="#newsletter"
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105"
            >
              Read Weekly Insights
            </a>
            <AuctionWaitlistModal />
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section id="mission" className="py-24 px-4 bg-gray-50 dark:bg-zinc-900">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold">Our Mission</h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-zinc-400 leading-relaxed">
            At LATE, we believe that being "late" isn't about missing deadlines—it's about taking the time to do things
            right. We're building a community that values quality over speed, depth over superficiality, and impact over
            mere productivity.
          </p>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="p-6 bg-white dark:bg-black rounded-lg border border-gray-200 dark:border-zinc-800">
              <h3 className="text-xl font-bold mb-3">Intentional Living</h3>
              <p className="text-gray-600 dark:text-zinc-400">
                Make every moment count by being present and purposeful in your actions.
              </p>
            </div>
            <div className="p-6 bg-white dark:bg-black rounded-lg border border-gray-200 dark:border-zinc-800">
              <h3 className="text-xl font-bold mb-3">Authentic Growth</h3>
              <p className="text-gray-600 dark:text-zinc-400">
                Grow at your own pace, focusing on sustainable progress that aligns with your values.
              </p>
            </div>
            <div className="p-6 bg-white dark:bg-black rounded-lg border border-gray-200 dark:border-zinc-800">
              <h3 className="text-xl font-bold mb-3">Meaningful Impact</h3>
              <p className="text-gray-600 dark:text-zinc-400">
                Create lasting change by prioritizing quality and depth in everything you do.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Weekly Insights Section */}
      <section id="newsletter" className="py-24 px-4">
        <WeeklyInsights />
      </section>

      {/* Podcast Section */}
      <PodcastSection />

      {/* Shop Section */}
      <ShopTeaser />

      {/* FAQ Section */}
      <FaqSection />

      {/* Contact Section */}
      <ContactSection />
    </div>
  )
}
