import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface BlogPost {
  id: number
  title: string
  excerpt: string
  slug: string
  publishDate: string
}

// Latest 4 blog posts for home page preview
const latestBlogPosts: BlogPost[] = [
  {
    id: 24,
    title: "Beyond Ourselves: Living in an Interconnected World",
    publishDate: "September 20, 2025",
    excerpt:
      "Why expanding our perspective beyond personal success to include others and the planet is essential for true fulfillment and sustainable progress.",
    slug: "beyond-ourselves-interconnected-world",
  },
  {
    id: 23,
    title: "The Architecture of Authentic Success",
    publishDate: "September 6, 2025",
    excerpt: "Building a life and career that reflects your true values rather than external expectations.",
    slug: "architecture-authentic-success",
  },
  {
    id: 22,
    title: "Mastering the Long Game",
    publishDate: "August 23, 2025",
    excerpt: "Why thinking in decades rather than quarters creates sustainable competitive advantages.",
    slug: "mastering-the-long-game",
  },
  {
    id: 21,
    title: "The Wisdom of Strategic Withdrawal",
    publishDate: "August 9, 2025",
    excerpt: "Knowing when to step back, reassess, and redirect your energy toward what truly matters.",
    slug: "wisdom-strategic-withdrawal",
  },
]

export default function BlogGrid() {
  return (
    <section id="blog" className="py-24 md:py-32 bg-zinc-900">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">LATE THOUGHTS</h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              Bi-weekly perspectives on redefining success, embracing your pace, and making an impact when the moment is
              right.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {latestBlogPosts.map((post) => (
              <article
                key={post.id}
                className="bg-zinc-800 rounded-lg overflow-hidden hover:bg-zinc-700 transition-all duration-300 group"
              >
                <div className="p-8">
                  <div className="text-sm text-zinc-500 mb-3">{post.publishDate}</div>
                  <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-purple-400 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-zinc-400 mb-6 line-clamp-3">{post.excerpt}</p>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors group/link"
                  >
                    Read More
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 bg-white text-black px-8 py-3 rounded-full font-medium hover:bg-purple-600 hover:text-white transition-all duration-300 transform hover:scale-105"
            >
              View All Posts
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
