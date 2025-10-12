import Link from "next/link"
import { Clock } from "lucide-react"

interface BlogPost {
  slug: string
  title: string
  excerpt: string
  date: string
  readTime: number
}

interface BlogGridProps {
  posts: BlogPost[]
}

export function BlogGrid({ posts }: BlogGridProps) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post) => (
        <Link
          key={post.slug}
          href={`/blog/${post.slug}`}
          className="group bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden hover:border-purple-500 transition-all"
        >
          <div className="p-6">
            <div className="flex items-center gap-4 text-sm text-zinc-500 mb-3">
              <time>{post.date}</time>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {post.readTime} min read
              </span>
            </div>
            <h2 className="text-xl font-bold mb-2 group-hover:text-purple-400 transition-colors">{post.title}</h2>
            <p className="text-zinc-400">{post.excerpt}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}
