import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { NewsletterReactions } from "@/components/newsletter-reactions"
import { NewsletterComments } from "@/components/newsletter-comments"

export default function CourageToStartOverPage() {
  return (
    <main className="min-h-screen bg-black text-white py-24 px-6">
      <article className="max-w-3xl mx-auto">
        <Link href="/newsletter" className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Newsletter
        </Link>

        <header className="mb-12">
          <time className="text-sm text-zinc-500">September 7, 2025</time>
          <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4">The Courage to Start Over</h1>
          <p className="text-xl text-zinc-400">Why abandoning sunk costs might be your path to freedom</p>
        </header>

        <div className="prose prose-invert prose-lg max-w-none">
          <p>
            You've invested months—maybe years—into a project, relationship, or career path. The results aren't what you
            hoped for, but you keep going. Why? Because of everything you've already put in. This is the sunk cost
            fallacy in action, and it's costing you more than you realize.
          </p>

          <h2>The Psychology of Sunk Costs</h2>
          <p>
            Humans are loss-averse. We feel the pain of losing something twice as intensely as the pleasure of gaining
            something equivalent. This means we'll often continue investing in failing ventures just to avoid admitting
            we made a mistake.
          </p>

          <p>
            But here's the truth: the time and resources you've already spent are gone regardless of what you do next.
            The only question that matters is: what's the best use of your future time and resources?
          </p>

          <h2>The Cost of Continuing</h2>
          <p>
            When you persist with something that's not working, you're not just wasting current time and energy. You're
            also paying an opportunity cost—all the things you could be doing instead.
          </p>

          <ul>
            <li>New skills you could be developing</li>
            <li>Better opportunities you're missing</li>
            <li>Relationships you're neglecting</li>
            <li>Projects that align with who you're becoming</li>
          </ul>

          <h2>Signs It's Time to Start Over</h2>
          <p>Consider starting over when:</p>

          <ol>
            <li>Your reasons for continuing are about past investment, not future potential</li>
            <li>You're consistently unhappy or unfulfilled</li>
            <li>Your goals or values have fundamentally changed</li>
            <li>You're actively avoiding thinking about the situation</li>
            <li>You know deep down it's not working</li>
          </ol>

          <h2>The Art of the Strategic Restart</h2>
          <p>
            Starting over doesn't mean everything was wasted. You've learned valuable lessons. You've developed skills
            and connections. You're not back at zero—you're at a new level one.
          </p>

          <p>
            The courage to start over is the courage to honor your growth. You're different now than when you began.
            Your path should reflect that.
          </p>
        </div>

        <NewsletterReactions />
        <NewsletterComments />
      </article>
    </main>
  )
}
