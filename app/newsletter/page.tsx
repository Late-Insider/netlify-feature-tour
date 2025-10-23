import type { Metadata } from "next"
import { getAllNewsletterArticles } from "@/lib/newsletter-articles"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import NewsletterSubscribeForm from "@/components/newsletter-subscribe-form"

export const metadata: Metadata = {
  title: "Newsletter - LATE",
  description: "Weekly insights on productivity, time management, and intentional living from LATE.",
}

export default function NewsletterPage() {
  const articles = getAllNewsletterArticles()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">WEEKLY INSIGHTS</h1>
            <p className="text-xl md:text-2xl mb-8 text-purple-100">
              Intentional reflections, gathered in one steady cadence.
            </p>
          </div>
        </div>
      </section>

      {/* Subscribe Section */}
      <section className="py-16 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-zinc-800 dark:to-zinc-900 p-8 md:p-12 rounded-2xl shadow-lg dark:shadow-none border border-purple-100 dark:border-zinc-700">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-3 text-gray-900 dark:text-white">Subscribe to Our Newsletter</h2>
                <p className="text-lg text-gray-600 dark:text-zinc-400">
                  Get weekly insights delivered directly to your inbox. Join our community of intentional thinkers.
                </p>
              </div>

              <NewsletterSubscribeForm />
            </div>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Latest Articles</h2>
              <p className="text-lg text-gray-600 dark:text-zinc-400">
                Explore our collection of insights on living intentionally and owning your time.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <article
                  key={article.slug}
                  className="bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow-md dark:shadow-none hover:shadow-xl dark:hover:shadow-purple-500/20 transition-all duration-300 border border-gray-100 dark:border-zinc-800 hover:border-purple-300 dark:hover:border-purple-700"
                >
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm font-medium text-purple-600 dark:text-purple-400">{article.date}</span>
                      <span className="text-xs text-gray-500 dark:text-zinc-500">• {article.readTime} min read</span>
                    </div>

                    <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white line-clamp-2">
                      {article.title}
                    </h3>

                    <p className="text-gray-600 dark:text-zinc-400 mb-4 line-clamp-3">{article.excerpt}</p>

                    <Link
                      href={`/newsletter/${article.slug}`}
                      className="inline-flex items-center text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors font-medium group"
                    >
                      Read Article
                      <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
