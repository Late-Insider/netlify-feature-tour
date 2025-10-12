import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { NewsletterReactions } from "@/components/newsletter-reactions"
import { NewsletterComments } from "@/components/newsletter-comments"

export default function KnowThySelfPage() {
  return (
    <main className="min-h-screen bg-black text-white py-24 px-6">
      <article className="max-w-3xl mx-auto">
        <Link href="/newsletter" className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Newsletter
        </Link>

        <header className="mb-12">
          <time className="text-sm text-zinc-500">September 21, 2025</time>
          <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4">Know Thy Self: The Foundation of All Wisdom</h1>
          <p className="text-xl text-zinc-400">Ancient wisdom meets modern science in understanding self-awareness</p>
        </header>

        <div className="prose prose-invert prose-lg max-w-none">
          <p>
            The ancient Greek aphorism "know thyself" was inscribed at the Temple of Apollo at Delphi. Thousands of
            years later, this principle remains the cornerstone of personal development and achievement.
          </p>

          <h2>The Self-Awareness Paradox</h2>
          <p>
            Modern neuroscience has revealed something fascinating: most of our decisions are made before we're
            consciously aware of them. Our brains process vast amounts of information below the threshold of
            consciousness, yet we believe we're in complete control.
          </p>

          <p>
            True self-knowledge requires acknowledging this paradox. We are both more and less in control than we think.
            Understanding this balance is crucial for personal growth.
          </p>

          <h2>The Three Layers of Self-Knowledge</h2>
          <p>Self-awareness operates on three distinct levels:</p>

          <ol>
            <li>
              <strong>Surface Self:</strong> The persona we present to the world, shaped by social expectations and
              immediate circumstances.
            </li>
            <li>
              <strong>Narrative Self:</strong> The story we tell ourselves about who we are, built from memories and
              beliefs.
            </li>
            <li>
              <strong>Core Self:</strong> The fundamental patterns of thought, emotion, and behavior that drive us
              beneath conscious awareness.
            </li>
          </ol>

          <p>Most people only explore the first layer. Real transformation happens when we venture deeper.</p>

          <h2>Practical Steps to Self-Knowledge</h2>
          <p>
            Understanding yourself isn't about navel-gazing. It's about building awareness through systematic
            observation:
          </p>

          <ul>
            <li>Track your energy levels throughout the day for two weeks</li>
            <li>Note situations that trigger strong emotional responses</li>
            <li>Identify patterns in your decision-making</li>
            <li>Question your automatic assumptions about yourself</li>
            <li>Seek feedback from people who know you in different contexts</li>
          </ul>

          <h2>The Time Investment</h2>
          <p>
            Self-knowledge isn't a weekend project. It's a lifetime practice. But the returns compound dramatically.
            Every hour invested in understanding yourself saves countless hours of pursuing goals that don't align with
            your true nature or fighting against your natural tendencies.
          </p>

          <p>The ancient wisdom holds: know thyself. The modern addition: and act accordingly.</p>
        </div>

        <NewsletterReactions />
        <NewsletterComments />
      </article>
    </main>
  )
}
