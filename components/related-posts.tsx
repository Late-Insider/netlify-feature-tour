import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface BlogPost {
  id: number
  title: string
  excerpt: string
  slug: string
}

interface RelatedPostsProps {
  currentPostId: number
  posts: BlogPost[]
  maxPosts?: number
}

export default function RelatedPosts({ currentPostId, posts, maxPosts = 3 }: RelatedPostsProps) {
  // Filter out the current post and get a limited number of related posts
  const relatedPosts = posts.filter((post) => post.id !== currentPostId).slice(0, maxPosts)

  if (relatedPosts.length === 0) {
    return null
  }

  return (
    <div className="mt-16 pt-8 border-t border-gray-200 dark:border-zinc-800">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Related Posts</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedPosts.map((post) => (
          <div
            key={post.id}
            className="bg-gray-50 dark:bg-zinc-800 rounded-lg overflow-hidden hover:bg-gray-100 dark:hover:bg-zinc-700 transition-all duration-300"
          >
            <div className="p-5">
              <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">{post.title}</h3>
              <p className="text-gray-600 dark:text-zinc-400 text-sm mb-3 line-clamp-2">{post.excerpt}</p>
              <Link
                href={`/blog/${post.slug}`}
                className="inline-flex items-center text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors text-sm group"
              >
                Read More
                <ArrowRight className="ml-1 w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
