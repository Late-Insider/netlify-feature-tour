"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EnhancedNewsletterReactions } from "@/components/enhanced-newsletter-reactions"
import { EnhancedNewsletterComments } from "@/components/enhanced-newsletter-comments"
import { SocialShare } from "@/components/social-share"

interface NewsletterArticle {
  slug: string
  title: string
  excerpt: string
  content: string
  date: string
  readTime: string
  author: string
}

interface NewsletterClientPageProps {
  article: NewsletterArticle
}

export function NewsletterClientPage({ article }: NewsletterClientPageProps) {
  const [currentUrl, setCurrentUrl] = useState("")

  useEffect(() => {
    setCurrentUrl(window.location.href)
  }, [])

  if (!article) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
          <Link href="/newsletter">
            <Button
              variant="outline"
              className="border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white bg-transparent"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Newsletter
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link href="/newsletter">
            <Button
              variant="outline"
              className="border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white bg-transparent"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Newsletter
            </Button>
          </Link>
        </div>

        {/* Article Header */}
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">{article.title}</h1>

          <div className="flex flex-wrap items-center gap-6 text-zinc-400 mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>
                {new Date(article.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{article.readTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{article.author}</span>
            </div>
          </div>

          <p className="text-xl text-zinc-300 leading-relaxed">{article.excerpt}</p>
        </header>

        {/* Article Content */}
        <article className="prose prose-invert prose-lg max-w-none mb-12">
          <div
            className="text-zinc-200 leading-relaxed space-y-6"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </article>

        {/* Social Share */}
        <div className="mb-12 p-6 bg-zinc-900 rounded-lg border border-zinc-800">
          <SocialShare title={article.title} url={currentUrl} description={article.excerpt} />
        </div>

        {/* Reactions */}
        <div className="mb-12">
          <EnhancedNewsletterReactions articleSlug={article.slug} />
        </div>

        {/* Comments */}
        <div className="mb-12">
          <EnhancedNewsletterComments articleSlug={article.slug} articleTitle={article.title} />
        </div>

        {/* Newsletter Subscription CTA */}
        <div className="mt-16 p-8 bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-lg border border-purple-500/20">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Enjoyed this insight?</h3>
            <p className="text-zinc-300 mb-6">
              Get weekly insights delivered to your inbox. Join our community of time-conscious individuals.
            </p>
            <Link href="/#newsletter">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg">
                Subscribe to Newsletter
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewsletterClientPage
