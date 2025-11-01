import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"

import { getAllNewsletterArticles, getNewsletterArticleBySlug } from "@/lib/newsletter-articles"

export async function generateStaticParams() {
  return getAllNewsletterArticles().map((article) => ({
    slug: article.slug,
  }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
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

export default function BlogArticleRedirect({ params }: { params: { slug: string } }) {
  const article = getNewsletterArticleBySlug(params.slug)

  if (!article) {
    notFound()
  }

  redirect(`/newsletter/${params.slug}`)
}
