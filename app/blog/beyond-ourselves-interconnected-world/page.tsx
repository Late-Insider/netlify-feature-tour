import Link from "next/link"
import { ArrowLeft, Clock } from "lucide-react"
import { EnhancedBlogReactions } from "@/components/enhanced-blog-reactions"
import { EnhancedBlogComments } from "@/components/enhanced-blog-comments"

export default function BeyondOurselvesPage() {
  return (
    <main className="min-h-screen bg-black text-white py-24 px-6">
      <article className="max-w-3xl mx-auto">
        <Link href="/blog" className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blog
        </Link>

        <header className="mb-12">
          <div className="flex items-center gap-4 text-sm text-zinc-500 mb-4">
            <time>March 15, 2025</time>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />8 min read
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4">
            Beyond Ourselves: Living in an Interconnected World
          </h1>
          <p className="text-xl text-zinc-400">Understanding our role in the larger ecosystem of humanity</p>
        </header>

        <div className="prose prose-invert prose-lg max-w-none">
          <p>
            We live in the most connected era in human history, yet we often feel more isolated than ever. This paradox
            isn't just a social problem—it's a philosophical one that shapes how we understand our place in the world.
          </p>

          <h2>The Illusion of Separation</h2>
          <p>
            Modern Western culture promotes a myth of radical individualism—the idea that we are fundamentally separate
            beings, self-contained and independent. But this is a relatively recent construct. For most of human
            history, our ancestors understood something we've forgotten: we are deeply interconnected with each other
            and our environment.
          </p>

          <p>
            Every breath you take contains atoms that were once part of other living beings. Every thought you have is
            shaped by language and ideas passed down through generations. Your success depends on infrastructure built
            by people you'll never meet. Separation is the illusion; connection is the reality.
          </p>

          <h2>The Ripple Effect</h2>
          <p>
            Your actions ripple outward in ways you can't fully perceive. A smile to a stranger might improve their day,
            leading them to treat someone else with kindness. That person might then make a decision that affects dozens
            of others. The butterfly effect isn't just meteorological—it's social and moral.
          </p>

          <p>
            This means two things: First, you have more impact than you realize. Second, you bear more responsibility
            than you might want to admit. Every choice matters because every choice affects the whole.
          </p>

          <h2>Extending the Circle</h2>
          <p>
            We naturally care about those close to us—family, friends, community. The moral challenge is extending that
            circle of concern outward. Not to the point of self-destruction, but toward a recognition that strangers'
            wellbeing affects our own.
          </p>

          <p>How to practice this expansion:</p>

          <ul>
            <li>
              <strong>Recognize shared humanity:</strong> Everyone you meet is fighting battles you know nothing about
            </li>
            <li>
              <strong>Consider second-order effects:</strong> How do your choices affect people beyond your immediate
              circle?
            </li>
            <li>
              <strong>Support systemic improvements:</strong> Individual charity is good; fixing broken systems is
              better
            </li>
            <li>
              <strong>Practice perspective-taking:</strong> Regularly imagine life from radically different viewpoints
            </li>
          </ul>

          <h2>The Environmental Dimension</h2>
          <p>
            Our interconnection extends beyond humans. We're part of a vast ecological system where every species plays
            a role. The extinction of a beetle species you've never heard of might eventually affect the food on your
            plate. Everything is connected.
          </p>

          <p>
            This isn't environmentalism as sacrifice—it's enlightened self-interest. Protecting the web of life protects
            us. We don't have to choose between human flourishing and environmental health; they're the same thing on a
            long enough timeline.
          </p>

          <h2>Digital Interconnection</h2>
          <p>
            Technology has created new forms of interconnection while sometimes weakening old ones. We can instantly
            communicate with someone across the globe but struggle to connect with our neighbors. We have access to all
            human knowledge but feel overwhelmed and confused.
          </p>

          <p>
            The task isn't to reject technology but to use it wisely—strengthening real connections rather than
            replacing them with shallow substitutes. Every tool can build or destroy; intention determines the outcome.
          </p>

          <h2>Living the Interconnected Life</h2>
          <p>Understanding interconnection intellectually is one thing. Living it is another. It requires:</p>

          <ol>
            <li>
              <strong>Humility:</strong> Recognizing you're part of something larger than yourself
            </li>
            <li>
              <strong>Responsibility:</strong> Acting with awareness of your impact
            </li>
            <li>
              <strong>Empathy:</strong> Feeling connection to distant others
            </li>
            <li>
              <strong>Service:</strong> Contributing to collective wellbeing
            </li>
            <li>
              <strong>Wisdom:</strong> Seeing the web of relationships clearly
            </li>
          </ol>

          <h2>The Personal and the Universal</h2>
          <p>
            None of this means sacrificing your individual needs or goals. In fact, understanding interconnection often
            helps you achieve them more effectively. When you help others succeed, you create an environment where
            you're more likely to succeed. When you strengthen your community, you strengthen yourself.
          </p>

          <p>
            The key is balance—honoring both your individual journey and your role in the larger whole. Not losing
            yourself in the collective, but not isolating yourself from it either.
          </p>

          <h2>Starting Where You Are</h2>
          <p>You don't have to save the world tomorrow. Start with one conscious act of interconnection today:</p>

          <ul>
            <li>Have a real conversation with someone instead of a transactional exchange</li>
            <li>Make one decision considering its ripple effects</li>
            <li>Support one cause that benefits people you'll never meet</li>
            <li>Learn about one issue outside your direct experience</li>
            <li>Practice seeing yourself as part of a larger whole</li>
          </ul>

          <p>
            We are not separate. We never were. The work is simply remembering what we've always known: we rise and fall
            together. Choose to rise.
          </p>
        </div>

        <EnhancedBlogReactions articleSlug="beyond-ourselves-interconnected-world" />
        <EnhancedBlogComments articleSlug="beyond-ourselves-interconnected-world" />
      </article>
    </main>
  )
}
