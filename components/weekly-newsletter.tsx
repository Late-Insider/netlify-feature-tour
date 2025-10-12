import Link from "next/link"
import { ArrowRight } from "lucide-react"

const newsletters = [
  {
    slug: "know-thy-self-foundation-wisdom",
    title: "Know Thy Self: The Foundation of All Wisdom",
    excerpt: "Ancient wisdom meets modern science in understanding self-awareness",
    date: "Sept 21, 2025",
  },
  {
    slug: "art-of-productive-procrastination",
    title: "The Art of Productive Procrastination",
    excerpt: "Why strategic delay can be your secret weapon for better decisions",
    date: "Sept 14, 2025",
  },
  {
    slug: "courage-to-start-over",
    title: "The Courage to Start Over",
    excerpt: "Why abandoning sunk costs might be your path to freedom",
    date: "Sept 7, 2025",
  },
  {
    slug: "mastering-selective-attention",
    title: "Mastering the Art of Selective Attention",
    excerpt: "Learning what to ignore is as important as what to focus on",
    date: "Aug 31, 2025",
  },
]

export function WeeklyNewsletter() {
  return (
    <section className="py-20 px-6 bg-zinc-900/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Weekly Insights</h2>
          <p className="text-zinc-400 text-lg">
            Deep dives into productivity, intentional living, and making time work for you
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {newsletters.map((newsletter) => (
            <Link
              key={newsletter.slug}
              href={`/newsletter/${newsletter.slug}`}
              className="group bg-black border border-zinc-800 rounded-lg p-6 hover:border-purple-500 transition-all"
            >
              <time className="text-sm text-zinc-500">{newsletter.date}</time>
              <h3 className="text-xl font-bold mt-2 mb-2 group-hover:text-purple-400 transition-colors">
                {newsletter.title}
              </h3>
              <p className="text-zinc-400 mb-4">{newsletter.excerpt}</p>
              <span className="inline-flex items-center text-purple-400 group-hover:text-purple-300">
                Read more
                <ArrowRight className="ml-2 w-4 h-4" />
              </span>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/newsletter"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            View All Articles
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
