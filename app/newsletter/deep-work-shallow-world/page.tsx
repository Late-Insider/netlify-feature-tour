import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { EnhancedNewsletterReactions } from "@/components/enhanced-newsletter-reactions"
import { EnhancedNewsletterComments } from "@/components/enhanced-newsletter-comments"

export default function DeepWorkPage() {
  return (
    <main className="min-h-screen bg-black text-white py-24 px-6">
      <article className="max-w-3xl mx-auto">
        <Link href="/newsletter" className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Newsletter
        </Link>

        <header className="mb-12">
          <time className="text-sm text-zinc-500">August 17, 2025</time>
          <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4">Deep Work in a Shallow World</h1>
          <p className="text-xl text-zinc-400">
            Why the ability to focus deeply is becoming rare—and therefore valuable
          </p>
        </header>

        <div className="prose prose-invert prose-lg max-w-none">
          <p>
            In 1665, Cambridge University closed due to the plague. A young Isaac Newton retreated to his family farm
            and, without distractions, developed calculus, the laws of motion, and gravitational theory. Today, we call
            this his "Year of Wonders." It was really just a year of uninterrupted deep work.
          </p>

          <h2>The Depth Recession</h2>
          <p>
            We're experiencing what Cal Newport calls "the depth recession"—a systematic reduction in our collective
            ability to focus deeply. The average office worker checks email 74 times per day and switches tasks every
            three minutes. This isn't multitasking; it's attention fragmentation.
          </p>

          <p>
            The cost isn't just productivity. It's the inability to engage with complex problems that require sustained
            concentration. We're losing the capacity for the work that creates real value.
          </p>

          <h2>What Deep Work Actually Means</h2>
          <p>
            Deep work is professional activity performed in a state of distraction-free concentration that pushes your
            cognitive capabilities to their limit. It's characterized by:
          </p>

          <ul>
            <li>Zero interruptions for extended periods (90+ minutes)</li>
            <li>Working at the edge of your ability</li>
            <li>Complete focus on a single complex task</li>
            <li>Producing high-quality output that's hard to replicate</li>
          </ul>

          <p>
            It's not just "focused work." It's work that demands and develops your highest level of cognitive function.
          </p>

          <h2>The Economic Reality</h2>
          <p>
            As deep work becomes rarer, it becomes more valuable. Tasks requiring shallow work can be automated or
            outsourced. Tasks requiring deep work cannot—at least not yet, and possibly not ever.
          </p>

          <p>
            Your ability to do deep work is increasingly what separates you economically. The person who can solve
            complex problems, synthesize disparate information, and create genuinely new things will always be in
            demand.
          </p>

          <h2>Building a Deep Work Practice</h2>
          <p>Start with these non-negotiable foundations:</p>

          <ol>
            <li>
              <strong>Sacred Time:</strong> Block 90-minute sessions where deep work is the only option. No exceptions.
            </li>
            <li>
              <strong>Environment Design:</strong> Create a space that signals "deep work mode" to your brain. Same
              place, same setup.
            </li>
            <li>
              <strong>Ritual:</strong> Develop a pre-work routine that transitions your mind into deep work state.
            </li>
            <li>
              <strong>Shutdown:</strong> End each deep work session with a clear stopping point. Helps maintain
              sustainability.
            </li>
          </ol>

          <h2>The Resistance You'll Face</h2>
          <p>
            Your brain will resist deep work. It's harder than shallow work. You'll feel the urge to check your phone,
            refresh email, or "quickly" look something up. This is normal. The distraction impulse is a trained behavior
            that takes time to unlearn.
          </p>

          <p>
            Your colleagues and environment will resist too. Deep work requires saying no to meetings, turning off
            notifications, and being unavailable. This makes people uncomfortable in cultures built around constant
            availability.
          </p>

          <h2>The Paradox of Productivity</h2>
          <p>
            Here's what most people miss: four hours of deep work produces more value than eight hours of fragmented
            work. But it feels like you're doing less because you're not constantly busy. You have to trust the process
            and measure results, not activity.
          </p>

          <p>The shallow world rewards visible busyness. Deep work rewards invisible results. Choose wisely.</p>

          <h2>Starting Tomorrow</h2>
          <p>
            Don't try to transform your entire work life overnight. Start with one 90-minute deep work session tomorrow.
            Just one. Protect it fiercely. Notice the difference in what you produce.
          </p>

          <p>
            Then do it again the next day. And the next. Build the habit before you expand the time. Consistency beats
            intensity in developing this practice.
          </p>

          <p>
            In a world optimized for distraction, your ability to focus deeply is a superpower. The question is: will
            you develop it, or let it atrophy?
          </p>
        </div>

        <EnhancedNewsletterReactions articleSlug="deep-work-shallow-world" />
        <EnhancedNewsletterComments articleSlug="deep-work-shallow-world" />
      </article>
    </main>
  )
}
