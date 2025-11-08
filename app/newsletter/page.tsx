// app/newsletter/page.tsx
import dynamic from "next/dynamic"

// Load the client component only on the client
const NewsletterSubscribeForm = dynamic(
  () =>
    import("@/components/newsletter-subscribe-form").then((m) => m.default ?? m),
  { ssr: false }
)

export const dynamic = "force-dynamic"
export const revalidate = 0

export default function NewsletterPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      {/* Hero */}
      <section className="relative py-20 bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">WEEKLY INSIGHTS</h1>
            <p className="text-xl md:text-2xl text-purple-100">
              Thought-provoking, soul-soothing essays — one letter at a time.
            </p>
          </div>
        </div>
      </section>

      {/* Under reconstruction notice */}
      <section className="py-12 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="rounded-2xl border border-purple-200 dark:border-zinc-700 bg-purple-50/60 dark:bg-zinc-800 p-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-3 text-gray-900 dark:text-white">
                Page under reconstruction
              </h2>
              <p className="text-lg text-gray-600 dark:text-zinc-400">
                We’re rebuilding the archive. Articles will be accessible again soon.
              </p>
            </div>
            <p className="mt-6 text-sm text-gray-500 dark:text-zinc-500">Thanks for your patience.</p>
          </div>
        </div>
      </section>

      {/* Subscribe box (client-only form) */}
      <section className="py-16 bg-white dark:bg-zinc-900">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-zinc-800 dark:to-zinc-900 p-8 md:p-12 rounded-2xl shadow-lg dark:shadow-none border border-purple-100 dark:border-zinc-700">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold mb-3 text-gray-900 dark:text-white">Subscribe to the Newsletter</h3>
                <p className="text-lg text-gray-600 dark:text-zinc-400">
                  Get new essays delivered weekly. Join the inner circle.
                </p>
              </div>

              <NewsletterSubscribeForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
