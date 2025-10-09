import type { Metadata } from "next"
import { NewsletterClientPage } from "../[slug]/client-page"
import { ArrowLeft, Calendar, Clock } from "lucide-react"
import Link from "next/link"
import SocialShare from "@/components/social-share"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "The Art of Productive Procrastination | LATE Weekly Insights",
    description:
      "Discover how strategic delays can lead to better outcomes and more authentic decisions in this week's LATE perspective.",
    openGraph: {
      title: "The Art of Productive Procrastination | LATE Weekly Insights",
      description:
        "Discover how strategic delays can lead to better outcomes and more authentic decisions in this week's LATE perspective.",
      type: "article",
      publishedTime: "2025-09-14T00:00:00.000Z",
    },
  }
}

export default function ArtOfProductiveProcrastinationPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <NewsletterClientPage params={{ slug: "art-of-productive-procrastination" }}>
        {/* Header */}
        <header className="mb-12">
          <Link
            href="/newsletter"
            className="inline-flex items-center text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Weekly Insights
          </Link>

          <div className="mb-6">
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-zinc-400 mb-4">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                September 14, 2025
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />6 min read
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              The Art of Productive Procrastination
            </h1>
            <p className="text-xl text-gray-600 dark:text-zinc-400 leading-relaxed">
              Discover how strategic procrastination can become your secret weapon for better decision-making and
              creative breakthroughs.
            </p>
          </div>

          <div className="flex items-center justify-between border-t border-b border-gray-200 dark:border-zinc-800 py-4">
            <div className="text-sm text-gray-500 dark:text-zinc-500">LATE Weekly Insights</div>
            <SocialShare
              url={`https://late.ltd/newsletter/art-of-productive-procrastination`}
              title="The Art of Productive Procrastination"
              description="Discover how strategic procrastination can become your secret weapon for better decision-making and creative breakthroughs."
            />
          </div>
        </header>
      </NewsletterClientPage>
    </div>
  )
}
