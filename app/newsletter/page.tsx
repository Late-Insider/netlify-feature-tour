"use client"

export default function NewsletterPage() {
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

      {/* Empty state (keep it super simple for now) */}
      <section className="py-16 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center text-gray-700 dark:text-zinc-300">
            <p>No articles yet. Subscribe section will return once we finish stabilizing this page.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
