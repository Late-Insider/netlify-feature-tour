"use client"

import { useState } from "react"

import type React from "react"
import Link from "next/link"
import { ArrowRight, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { handleFormSubmission } from "@/actions/email-actions"

interface Newsletter {
  id: number
  title: string
  excerpt: string
  slug: string
  publishDate: string
}

// Latest 4 newsletters for home page preview
const latestNewsletters: Newsletter[] = [
  {
    id: 28,
    title: "Know Thy Self: The Foundation of All Wisdom",
    publishDate: "September 21, 2025",
    excerpt:
      "The ancient Greek maxim 'Know Thyself' remains the most important journey you'll ever undertake—and the key to unlocking your authentic potential.",
    slug: "know-thy-self-foundation-wisdom",
  },
  {
    id: 27,
    title: "The Art of Productive Procrastination",
    publishDate: "September 14, 2025",
    excerpt:
      "Why strategic delay and selective procrastination can be powerful tools for better decision-making and creative breakthroughs.",
    slug: "art-of-productive-procrastination",
  },
  {
    id: 26,
    title: "The Courage to Start Over",
    publishDate: "September 7, 2025",
    excerpt: "Why reinventing yourself at any age is not just possible, but necessary for authentic living.",
    slug: "courage-to-start-over",
  },
  {
    id: 25,
    title: "Mastering the Art of Selective Attention",
    publishDate: "August 31, 2025",
    excerpt:
      "In an age of infinite distractions, your ability to choose what deserves your focus determines your success.",
    slug: "mastering-selective-attention",
  },
]

export default function WeeklyNewsletter() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.set("email", email)
      formData.set("form-name", "newsletter-signup")
      formData.set("_subject", "Newsletter Signup")

      const result = await handleFormSubmission(formData)

      if (result.success) {
        setIsSubmitted(true)
        setEmailSent(result.emailSent || false)
      } else {
        console.error("Form submission failed:", result.message)
      }
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="newsletter" className="py-24 md:py-32 bg-black">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">WEEKLY INSIGHTS</h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              Deep dives into the mindset shifts and strategies that help you thrive on your own timeline.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {latestNewsletters.map((newsletter) => (
              <article
                key={newsletter.id}
                className="bg-zinc-900 rounded-lg overflow-hidden hover:bg-zinc-800 transition-all duration-300 group border border-zinc-800"
              >
                <div className="p-8">
                  <div className="flex items-center gap-2 text-sm text-purple-400 mb-3">
                    <Calendar className="w-4 h-4" />
                    {newsletter.publishDate}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-purple-400 transition-colors">
                    {newsletter.title}
                  </h3>
                  <p className="text-zinc-400 mb-6 line-clamp-3">{newsletter.excerpt}</p>
                  <Link
                    href={`/newsletter/${newsletter.slug}`}
                    className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors group/link"
                  >
                    Read Insight
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="bg-zinc-900 p-8 rounded-lg">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">Subscribe to Our Newsletter</h3>
              <p className="text-zinc-400">Get weekly insights delivered directly to your inbox.</p>
            </div>

            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    type="email"
                    placeholder="Your email address"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white"
                  />
                  <Button
                    type="submit"
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Subscribing..." : "Subscribe"}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="bg-zinc-800 p-4 rounded-lg text-center animate-fade-in max-w-md mx-auto">
                <div className="flex items-center justify-center mb-2">
                  <div className="bg-purple-600 rounded-full p-1">
                    <ArrowRight className="w-4 h-4 text-white" />
                  </div>
                </div>
                <p className="text-zinc-300">
                  Thank you for subscribing to our newsletter! You'll receive our next issue soon.
                </p>
                {emailSent && (
                  <p className="text-zinc-500 text-sm mt-2">A confirmation email has been sent to your inbox.</p>
                )}
              </div>
            )}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/newsletter"
              className="inline-flex items-center gap-2 bg-purple-600 text-white px-8 py-3 rounded-full font-medium hover:bg-purple-700 transition-all duration-300 transform hover:scale-105"
            >
              View All Insights
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
