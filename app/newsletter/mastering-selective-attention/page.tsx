import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { NewsletterReactions } from "@/components/newsletter-reactions"
import { NewsletterComments } from "@/components/newsletter-comments"

export default function SelectiveAttentionPage() {
  return (
    <main className="min-h-screen bg-black text-white py-24 px-6">
      <article className="max-w-3xl mx-auto">
        <Link href="/newsletter" className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Newsletter
        </Link>

        <header className="mb-12">
          <time className="text-sm text-zinc-500">August 31, 2025</time>
          <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4">Mastering the Art of Selective Attention</h1>
          <p className="text-xl text-zinc-400">Learning what to ignore is as important as what to focus on</p>
        </header>

        <div className="prose prose-invert prose-lg max-w-none">
          <p>
            In a world of infinite information and constant stimulation, the most valuable skill isn't paying
            attention—it's knowing what to ignore. Your attention is finite. How you allocate it determines the quality
            of your life.
          </p>

          <h2>The Attention Economy</h2>
          <p>
            Every app, website, and notification is engineered to capture your attention. The average person is exposed
            to thousands of messages daily, each one competing for a slice of your mental bandwidth. Without a strategy
            for selective attention, you're letting others determine what you think about.
          </p>

          <h2>The Focusing Question</h2>
          <p>
            Before engaging with anything, ask: "Does this serve my current goals or values?" Not "Is this interesting?"
            or "Might this be useful someday?" Those questions lead to information hoarding. The focusing question is
            ruthlessly practical.
          </p>

          <h2>Three Levels of Filtering</h2>
          <p>Develop a three-tier system for processing information:</p>

          <ol>
            <li>
              <strong>Level 1 - Ignore:</strong> Most things fit here. Scroll past without engagement. No guilt.
            </li>
            <li>
              <strong>Level 2 - Note:</strong> Potentially useful information. Save it with a tag, but don't process
              now.
            </li>
            <li>
              <strong>Level 3 - Engage:</strong> Directly relevant to current projects. Give it full attention
              immediately.
            </li>
          </ol>

          <p>Most people treat everything as Level 3. That's why they're overwhelmed.</p>

          <h2>The Practice of Strategic Ignorance</h2>
          <p>Deliberately choosing what not to know is a practice, not a one-time decision:</p>

          <ul>
            <li>Unsubscribe from newsletters you don't read within one day of receiving</li>
            <li>Turn off notifications for apps that aren't truly urgent</li>
            <li>Schedule specific times for information consumption</li>
            <li>Let go of FOMO—you can't know everything, and that's okay</li>
            <li>Trust that important information will find you</li>
          </ul>

          <h2>The Paradox of Less</h2>
          <p>
            Counter-intuitively, consuming less information makes you better informed about what matters. By ignoring
            the noise, the signal becomes clear. You can go deep instead of staying shallow across too many topics.
          </p>

          <p>
            Your attention is your life. Spend it intentionally, and guard it fiercely. The art of selective attention
            is the art of building the life you want.
          </p>
        </div>

        <NewsletterReactions />
        <NewsletterComments />
      </article>
    </main>
  )
}
