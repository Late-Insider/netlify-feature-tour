import Link from "next/link"
import { Calendar, Clock, ArrowRight } from "lucide-react"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getLatestNewsletterArticle } from "@/lib/newsletter-articles"

export default function WeeklyInsights() {
  const article = getLatestNewsletterArticle()

  return (
    <section className="bg-white dark:bg-zinc-950 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <Card className="bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-950 border border-purple-100/70 dark:border-zinc-800">
            <CardHeader className="space-y-3">
              <span className="text-sm font-medium text-purple-600 dark:text-purple-400 tracking-widest">
                THIS WEEK'S ISSUE
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
                {article.title}
              </h2>
              <p className="text-base md:text-lg text-gray-600 dark:text-zinc-400 leading-relaxed">
                {article.excerpt}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-zinc-400">
                <div className="inline-flex items-center gap-2">
                  <Calendar className="h-4 w-4" aria-hidden />
                  <span>{article.date}</span>
                </div>
                <div className="inline-flex items-center gap-2">
                  <Clock className="h-4 w-4" aria-hidden />
                  <span>{article.readTime} min read</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
              <Link href={`/newsletter/${article.slug}`} aria-label={`Read ${article.title}`}>
                <Button size="lg" className="group">
                  Read the latest issue
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link
                href="/newsletter"
                className="inline-flex items-center text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium"
              >
                View the archive
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  )
}
