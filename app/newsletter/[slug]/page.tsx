import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, ArrowLeft, User } from "lucide-react"
import { EnhancedNewsletterReactions } from "@/components/enhanced-newsletter-reactions"
import { EnhancedNewsletterComments } from "@/components/enhanced-newsletter-comments"
import { SocialShare } from "@/components/social-share"
import { getAllNewsletterArticles, getNewsletterArticleBySlug } from "@/lib/newsletter-articles"

export async function generateStaticParams() {
  const articles = getAllNewsletterArticles()
  return articles.map((article) => ({
    slug: article.slug,
  }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const article = getNewsletterArticleBySlug(params.slug)

  if (!article) {
    return {
      title: "Article Not Found - LATE",
    }
  }

  return {
    title: `${article.title} - LATE`,
    description: article.excerpt,
  }
}

export default function NewsletterArticlePage({ params }: { params: { slug: string } }) {
  const article = getNewsletterArticleBySlug(params.slug)

  if (!article) {
    notFound()
  }

  const articleUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://late-website.vercel.app"}/newsletter/${params.slug}`

  return (
    <div className="min-h-screen py-20 px-4">
      <article className="container mx-auto max-w-4xl">
        {/* Back Button */}
        <Link href="/newsletter">
          <Button variant="ghost" className="mb-8 group">
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to All Insights
          </Button>
        </Link>

        {/* Article Header */}
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">{article.title}</h1>

          <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="font-medium">{article.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{article.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{article.readTime} min read</span>
            </div>
          </div>

          <p className="text-xl text-muted-foreground leading-relaxed">{article.excerpt}</p>
        </header>

        {/* Article Content */}
        <div
          className="prose prose-lg dark:prose-invert max-w-none mb-12 prose-headings:font-bold prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-p:mb-6 prose-p:leading-relaxed prose-strong:text-lg prose-strong:font-bold"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Divider */}
        <div className="border-t border-border my-12" />

        {/* Social Share */}
        <div className="mb-12">
          <SocialShare url={articleUrl} title={article.title} />
        </div>

        {/* Reactions */}
        <div className="mb-12">
          <EnhancedNewsletterReactions articleSlug={params.slug} />
        </div>

        {/* Comments */}
        <div className="mb-12">
          <EnhancedNewsletterComments articleSlug={params.slug} />
        </div>

        {/* Back Button Bottom */}
        <div className="text-center pt-12 border-t border-border">
          <Link href="/newsletter">
            <Button size="lg" variant="outline" className="group bg-transparent">
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to All Insights
            </Button>
          </Link>
        </div>
      </article>
    </div>
  )
}
