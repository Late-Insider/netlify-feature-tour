"use client"

import Link from "next/link"

interface RelatedPost {
  slug: string
  title: string
  excerpt: string
  date: string
}

interface RelatedPostsProps {
  posts: RelatedPost[]
  currentSlug: string
}

export function RelatedPosts({ posts, currentSlug }: RelatedPostsProps) {
  const relatedPosts = posts.filter((post) => post.slug !== currentSlug).slice(0, 3)

  if (relatedPosts.length === 0) return null

  return (
    <section className="mt-16 pt-16 border-t border-zinc-800">
      <h2 className="text-2xl font-bold mb-8">Related Articles</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {relatedPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/newsletter/${post.slug}`}
            className="group block bg-zinc-900 border border-zinc-800 rounded-lg p-6 hover:border-purple-500 transition-all"
          >
            <h3 className="font-semibold mb-2 group-hover:text-purple-400 transition-colors">{post.title}</h3>
            <p className="text-sm text-zinc-400 mb-3 line-clamp-2">{post.excerpt}</p>
            <p className="text-xs text-zinc-500">{post.date}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default RelatedPosts
