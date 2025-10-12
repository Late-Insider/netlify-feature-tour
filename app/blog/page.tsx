import type { Metadata } from "next"
import { BlogGrid } from "@/components/blog-grid"

export const metadata: Metadata = {
  title: "Late Thoughts - LATE",
  description: "Perspectives on redefining success, embracing your pace, and making an impact.",
}

interface BlogPost {
  id: number
  title: string
  excerpt: string
  slug: string
  publishDate: string
  readTime: number
}

// Complete list of all 24 blog posts - bi-weekly schedule (added new Sep 20 post)
const blogPosts: BlogPost[] = [
  {
    id: 24,
    title: "Beyond Ourselves: Living in an Interconnected World",
    publishDate: "September 20, 2025",
    excerpt:
      "Why expanding our perspective beyond personal success to include others and the planet is essential for true fulfillment and sustainable progress.",
    slug: "beyond-ourselves-interconnected-world",
    readTime: 8,
  },
  {
    id: 23,
    title: "The Architecture of Authentic Success",
    publishDate: "September 6, 2025",
    excerpt: "Building a life and career that reflects your true values rather than external expectations.",
    slug: "architecture-authentic-success",
    readTime: 7,
  },
  {
    id: 22,
    title: "Mastering the Long Game",
    publishDate: "August 23, 2025",
    excerpt: "Why thinking in decades rather than quarters creates sustainable competitive advantages.",
    slug: "mastering-the-long-game",
    readTime: 6,
  },
  {
    id: 21,
    title: "The Wisdom of Strategic Withdrawal",
    publishDate: "August 9, 2025",
    excerpt: "Knowing when to step back, reassess, and redirect your energy toward what truly matters.",
    slug: "wisdom-strategic-withdrawal",
    readTime: 5,
  },
  {
    id: 20,
    title: "Creating Your Personal Renaissance",
    publishDate: "July 26, 2025",
    excerpt: "How to cultivate multiple interests and skills in an age that demands specialization.",
    slug: "creating-personal-renaissance",
    readTime: 4,
  },
  {
    id: 19,
    title: "The Power of Intentional Obscurity",
    publishDate: "July 12, 2025",
    excerpt: "Why working in the shadows can be more powerful than seeking constant visibility.",
    slug: "power-intentional-obscurity",
    readTime: 3,
  },
  {
    id: 18,
    title: "Redefining Professional Growth",
    publishDate: "June 28, 2025",
    excerpt: "Moving beyond traditional career ladders to create your own path of meaningful development.",
    slug: "redefining-professional-growth",
    readTime: 2,
  },
  {
    id: 17,
    title: "The Art of Productive Solitude",
    publishDate: "June 14, 2025",
    excerpt: "Transforming alone time into your most creative and strategic advantage.",
    slug: "art-productive-solitude",
    readTime: 1,
  },
  {
    id: 16,
    title: "Building Unshakeable Inner Authority",
    publishDate: "May 31, 2025",
    excerpt: "Developing the confidence to trust your own judgment over external validation.",
    slug: "building-unshakeable-inner-authority",
    readTime: 10,
  },
  {
    id: 15,
    title: "The Philosophy of Selective Excellence",
    publishDate: "May 17, 2025",
    excerpt: "Why trying to be good at everything leads to mediocrity, and how to choose your battles wisely.",
    slug: "philosophy-selective-excellence",
    readTime: 9,
  },
  {
    id: 14,
    title: "Navigating Success Without Losing Yourself",
    publishDate: "May 3, 2025",
    excerpt: "How to achieve your goals while maintaining your core identity and values.",
    slug: "navigating-success-without-losing-yourself",
    readTime: 8,
  },
  {
    id: 13,
    title: "The Compound Effect of Consistent Reflection",
    publishDate: "April 19, 2025",
    excerpt: "How regular self-examination creates exponential personal and professional growth.",
    slug: "compound-effect-consistent-reflection",
    readTime: 7,
  },
  {
    id: 12,
    title: "Designing Your Ideal Day",
    publishDate: "April 5, 2025",
    excerpt: "Creating daily routines that align with your energy, values, and long-term vision.",
    slug: "designing-your-ideal-day",
    readTime: 6,
  },
  {
    id: 11,
    title: "The Courage to Disappoint Others",
    publishDate: "March 22, 2025",
    excerpt: "Why saying no to others often means saying yes to your authentic self and true priorities.",
    slug: "courage-to-disappoint-others",
    readTime: 5,
  },
  {
    id: 10,
    title: "The Fear of Falling Behind (And Why It's a Lie)",
    publishDate: "March 15, 2025",
    excerpt: "Dismantling the myth that everyone else is ahead and you're lagging behind.",
    slug: "fear-of-falling-behind",
    readTime: 4,
  },
  {
    id: 9,
    title: "The Power of Being Unapologetically You",
    publishDate: "March 1, 2025",
    excerpt: "Embracing your authentic self without compromise or explanation.",
    slug: "being-unapologetically-you",
    readTime: 3,
  },
  {
    id: 8,
    title: "Rejection is Redirection",
    publishDate: "February 15, 2025",
    excerpt: "How closed doors lead to better opportunities and align you with your true path.",
    slug: "rejection-is-redirection",
    readTime: 2,
  },
  {
    id: 7,
    title: "The Late Mindset: Thriving Outside Society's Timeline",
    publishDate: "February 1, 2025",
    excerpt: "Breaking free from societal expectations and creating your own definition of success.",
    slug: "the-late-mindset",
    readTime: 1,
  },
  {
    id: 6,
    title: "You Are Your Own Rescue",
    publishDate: "January 18, 2025",
    excerpt: "Finding strength within yourself when no one else is coming to save you.",
    slug: "you-are-your-own-rescue",
    readTime: 10,
  },
  {
    id: 5,
    title: "Patience & Timing: The Power of Knowing When to Move",
    publishDate: "January 4, 2025",
    excerpt: "Understanding the delicate balance between patience and action.",
    slug: "patience-and-timing",
    readTime: 9,
  },
  {
    id: 4,
    title: "Success Isn't a Deadline, It's a Destination",
    publishDate: "December 21, 2024",
    excerpt: "How to focus on the journey rather than arbitrary timelines.",
    slug: "success-isnt-a-deadline",
    readTime: 8,
  },
  {
    id: 3,
    title: "Moving in Silence",
    publishDate: "December 7, 2024",
    excerpt: "The power of quiet progress and letting your success speak for itself.",
    slug: "moving-in-silence",
    readTime: 7,
  },
  {
    id: 2,
    title: "The Hustle Myth",
    publishDate: "November 23, 2024",
    excerpt: "Why working harder doesn't always mean working better. Redefining productivity on your own terms.",
    slug: "the-hustle-myth",
    readTime: 6,
  },
  {
    id: 1,
    title: "The Art of Showing Up",
    publishDate: "November 9, 2024",
    excerpt: "It's not about being everywhere, it's about making your presence felt when you arrive.",
    slug: "the-art-of-showing-up",
    readTime: 5,
  },
]

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-black text-white py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-16 text-center">
          <h1 className="text-5xl font-bold mb-4">Late Thoughts</h1>
          <p className="text-xl text-zinc-400">Deep dives into productivity, time, and intentional living</p>
        </header>
        <BlogGrid posts={blogPosts} />
      </div>
    </main>
  )
}
