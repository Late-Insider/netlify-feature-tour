import type { Metadata } from "next"
import { ArrowLeft, Clock, Calendar, User } from "lucide-react"
import Link from "next/link"
import { EnhancedBlogReactions } from "@/components/enhanced-blog-reactions"
import { EnhancedBlogComments } from "@/components/enhanced-blog-comments"
import { SocialShare } from "@/components/social-share"

export const metadata: Metadata = {
  title: "Beyond Ourselves: Living in an Interconnected World | LATE",
  description:
    "Exploring the importance of thinking beyond personal success to consider our impact on others and the planet.",
}

export default function BeyondOurselvesPage() {
  const blogPost = {
    id: 24,
    title: "Beyond Ourselves: Living in an Interconnected World",
    date: "September 20, 2025",
    readTime: "8 min read",
    author: "LATE Team",
    excerpt:
      "In our pursuit of personal success and self-optimization, we sometimes forget a fundamental truth: we are not islands. Our choices ripple outward, affecting others and the planet in ways both seen and unseen.",
    slug: "beyond-ourselves-interconnected-world",
  }

  return (
    <main className="pt-24 pb-16 bg-black text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/blog"
            className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-8 transition-colors"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Late Thoughts
          </Link>

          <article className="mb-16">
            <header className="mb-12">
              <div className="flex items-center gap-4 text-sm text-zinc-500 mb-4">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {blogPost.date}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {blogPost.readTime}
                </div>
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {blogPost.author}
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">{blogPost.title}</h1>
              <p className="text-xl text-zinc-400 leading-relaxed">{blogPost.excerpt}</p>
            </header>

            <div className="prose prose-lg prose-invert max-w-none">
              <p className="text-xl text-zinc-300 mb-8 leading-relaxed">
                In our hyper-individualistic culture, we're taught to focus inward: optimize yourself, maximize your
                potential, achieve your goals. While personal growth is important, this singular focus can blind us to a
                fundamental truth—we exist within an intricate web of relationships that extends far beyond our
                immediate circle.
              </p>

              <h2 className="text-2xl font-bold text-white mt-12 mb-6">The Illusion of Separation</h2>

              <p className="mb-6">
                Modern life creates an illusion of separation. We live in individual homes, drive individual cars,
                pursue individual careers, and curate individual social media profiles. This infrastructure of
                individualism makes it easy to forget that every choice we make sends ripples through the interconnected
                system we're all part of.
              </p>

              <p className="mb-6">
                The coffee you drink connects you to farmers in distant countries. The clothes you wear link you to
                factory workers whose names you'll never know. The energy powering your devices ties you to ecosystems
                and communities affected by extraction and production. We are not separate—we are interconnected in ways
                both beautiful and sobering.
              </p>

              <div className="bg-purple-900/20 border-l-4 border-purple-500 p-6 my-8 rounded-r-lg">
                <h3 class="text-purple-400 font-bold text-lg mb-3">💜 The LATE Perspective</h3>
                <p class="text-zinc-300 italic">
                  "True success isn't just about what you achieve for yourself—it's about how your achievements
                  contribute to the flourishing of the whole. When we expand our definition of 'self' to include others
                  and the planet, our actions naturally become more thoughtful and sustainable."
                </p>
              </div>

              <h2 className="text-2xl font-bold text-white mt-12 mb-6">The Ripple Effect of Our Choices</h2>

              <p className="mb-6">
                Every decision you make—from what you buy to how you treat others—creates ripples. Some are immediate
                and visible: the smile you give a stranger, the tip you leave a server, the way you respond to conflict.
                Others are delayed and invisible: the carbon footprint of your lifestyle, the working conditions of
                those who make your products, the cultural messages you reinforce through your choices.
              </p>

              <p className="mb-6">
                This isn't about guilt or perfectionism—it's about awareness. When we understand our interconnectedness,
                we can make more conscious choices that align with our values and contribute to the kind of world we
                want to live in.
              </p>

              <h2 className="text-2xl font-bold text-white mt-12 mb-6">Expanding Our Circle of Concern</h2>

              <p className="mb-6">
                Psychologist and philosopher Peter Singer introduced the concept of the "expanding circle"—the idea that
                moral progress involves extending our concern beyond ourselves to include wider and wider circles of
                beings. This expansion might look like:
              </p>

              <ul className="list-disc list-inside mb-6 space-y-2 text-zinc-300">
                <li>
                  <strong>From self to family:</strong> Considering how our choices affect those closest to us
                </li>
                <li>
                  <strong>From family to community:</strong> Thinking about our impact on neighbors and local systems
                </li>
                <li>
                  <strong>From community to society:</strong> Recognizing our role in larger social and economic
                  structures
                </li>
                <li>
                  <strong>From society to species:</strong> Considering future generations and global humanity
                </li>
                <li>
                  <strong>From species to planet:</strong> Including other species and ecosystems in our moral
                  consideration
                </li>
              </ul>

              <h2 className="text-2xl font-bold text-white mt-12 mb-6">Practical Ways to Think Beyond Ourselves</h2>

              <h3 className="text-xl font-semibold text-purple-300 mt-8 mb-4">1. Practice Perspective-Taking</h3>
              <p className="mb-6">
                Before making decisions, ask yourself: "How might this affect others?" Consider not just immediate
                impacts, but long-term consequences. Who benefits from this choice? Who might be harmed? What would this
                look like if everyone made the same decision?
              </p>

              <h3 className="text-xl font-semibold text-purple-300 mt-8 mb-4">2. Consume Consciously</h3>
              <p className="mb-6">
                Every purchase is a vote for the kind of world you want to see. Research the companies you support.
                Choose products that align with your values. Consider the full lifecycle of what you buy—from production
                to disposal.
              </p>

              <h3 className="text-xl font-semibold text-purple-300 mt-8 mb-4">3. Engage in Your Community</h3>
              <p className="mb-6">
                Strong communities create resilient societies. Volunteer for causes you care about. Support local
                businesses. Participate in civic processes. Build relationships with your neighbors. Your local
                engagement strengthens the social fabric we all depend on.
              </p>

              <h3 className="text-xl font-semibold text-purple-300 mt-8 mb-4">4. Consider Future Generations</h3>
              <p className="mb-6">
                Indigenous cultures often consider the impact of decisions on seven generations into the future. What
                kind of world are we leaving for our children and grandchildren? How can our choices today contribute to
                their flourishing?
              </p>

              <h3 className="text-xl font-semibold text-purple-300 mt-8 mb-4">5. Practice Gratitude and Reciprocity</h3>
              <p className="mb-6">
                Recognize the countless people and systems that make your life possible. Express gratitude not just in
                words, but in actions. Look for ways to give back to the communities and ecosystems that support you.
              </p>

              <div className="bg-zinc-800 p-6 rounded-lg my-8">
                <h3 className="text-white font-bold text-lg mb-4">This Week's Challenge: The Interconnection Audit</h3>
                <p className="text-zinc-300 mb-4">
                  For one week, practice seeing the connections behind your daily activities:
                </p>
                <ul className="list-disc list-inside text-zinc-300 space-y-2">
                  <li>When you eat, think about the journey your food took to reach you</li>
                  <li>When you use technology, consider the people who designed and built it</li>
                  <li>When you interact with others, notice how your mood and energy affect them</li>
                  <li>When you make purchases, research one company's values and practices</li>
                  <li>When you dispose of something, trace where it goes next</li>
                </ul>
                <p className="text-zinc-300 mt-4">
                  At the end of the week, reflect: How did this awareness change your perspective? What connections
                  surprised you? How might you adjust your choices based on what you learned?
                </p>
              </div>

              <h2 className="text-2xl font-bold text-white mt-12 mb-6">The Paradox of Interconnected Individualism</h2>

              <p className="mb-6">
                Here's the beautiful paradox: when we expand our concern beyond ourselves, we don't lose our
                individuality—we discover our authentic place within the larger whole. We realize that our personal
                flourishing is intimately connected to the flourishing of others and the planet.
              </p>

              <p className="mb-6">
                This doesn't mean sacrificing your dreams or neglecting your needs. It means pursuing your goals in ways
                that contribute to rather than detract from the common good. It means finding success that feels
                meaningful because it serves something larger than yourself.
              </p>

              <h2 className="text-2xl font-bold text-white mt-12 mb-6">The Science of Connection</h2>

              <p className="mb-6">
                Research consistently shows that people who feel connected to something larger than themselves report
                higher levels of life satisfaction, better mental health, and greater resilience. When we expand our
                circle of concern, we don't just help others—we help ourselves by tapping into our fundamental need for
                meaning and connection.
              </p>

              <p className="mb-6">
                Studies in environmental psychology show that people who feel connected to nature are more likely to
                engage in pro-environmental behaviors and report greater well-being. Social psychology research
                demonstrates that communities with higher levels of social capital—trust, reciprocity, and civic
                engagement—have better outcomes across virtually every measure of quality of life.
              </p>

              <h2 className="text-2xl font-bold text-white mt-12 mb-6">Starting Where You Are</h2>

              <p className="mb-6">
                Thinking beyond ourselves doesn't require grand gestures or perfect knowledge. It starts with small
                shifts in awareness and incremental changes in behavior. It's about asking better questions, making more
                conscious choices, and gradually expanding our circle of concern.
              </p>

              <p className="mb-6">
                You don't have to solve climate change or end poverty to make a difference. You can start by being more
                present with the people in your life, more thoughtful about your consumption, more engaged in your
                community, and more aware of your impact.
              </p>

              <p className="text-lg text-zinc-300 mt-8">
                In a world that often feels fragmented and divided, remembering our interconnectedness is both a radical
                act and a return to ancient wisdom. We are not separate beings competing for scarce resources—we are
                part of an intricate web of relationships that can either support mutual flourishing or mutual
                destruction.
              </p>

              <p className="text-lg text-zinc-300 mt-6">
                The choice is ours, and it starts with how we choose to see ourselves in relation to the world around
                us. When we expand our definition of success to include the well-being of others and the planet, we
                don't just create a better world—we create a more meaningful life for ourselves.
              </p>
            </div>
          </article>

          {/* Social Share Section */}
          <div className="mb-12">
            <SocialShare
              url={`https://late.ltd/blog/${blogPost.slug}`}
              title={blogPost.title}
              description={blogPost.excerpt}
            />
          </div>

          {/* Reactions Section */}
          <div className="mb-12">
            <EnhancedBlogReactions blogId={blogPost.id} blogTitle={blogPost.title} />
          </div>

          {/* Comments Section */}
          <div>
            <EnhancedBlogComments blogId={blogPost.id} blogTitle={blogPost.title} />
          </div>
        </div>
      </div>
    </main>
  )
}
