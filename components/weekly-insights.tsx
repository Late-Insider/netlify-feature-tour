"use client"

import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, ArrowRight } from "lucide-react"
import { calculateReadTime } from "@/utils/calculate-read-time"
import { getLatestNewsletterArticle } from "@/lib/newsletter-articles"

interface WeeklyInsight {
  id: number
  title: string
  excerpt: string
  slug: string
  content: string
  publishDate: string
  type: "blog" | "newsletter"
  author?: string
  date?: string
  readTime?: number
}

// Combined articles from both blog and newsletter
const weeklyInsights: WeeklyInsight[] = [
  // Week of Dec 9, 2024
  {
    id: 1,
    title: "The Art of Showing Up",
    publishDate: "December 9, 2024",
    date: "December 9, 2024",
    readTime: 10,
    excerpt: "It's not about being everywhere, it's about making your presence felt when you arrive.",
    slug: "the-art-of-showing-up",
    type: "blog",
    content: `
      <p>In a world that glorifies omnipresence, there's a subtle art to showing up that's often overlooked. It's not about being everywhere—it's about making your presence felt when you do arrive.</p>
      
      <p>Think about it: would you rather be remembered as the person who was at every event but left no impression, or the one whose arrival shifted the energy of the room? The latter requires intention, presence, and a clear understanding of your own value.</p>
      
      <h2><strong>Quality Over Quantity</strong></h2>
      
      <p>The modern world rewards those who appear busy, who are constantly visible, who seem to be everywhere at once. But this approach often leads to shallow connections and diluted impact. When you spread yourself too thin, you become forgettable.</p>
      
      <p>Instead, consider the power of selective presence. Choose your moments carefully. When you do show up, bring your full self to the experience. Be completely present, engaged, and authentic.</p>
      
      <h2><strong>The Energy You Bring</strong></h2>
      
      <p>Showing up isn't just about physical presence—it's about the energy you bring to any situation. Are you distracted, checking your phone, thinking about where else you could be? Or are you fully engaged, listening actively, contributing meaningfully?</p>
      
      <p>People can sense when you're truly present versus when you're just going through the motions. Authentic presence is magnetic. It draws people in and creates memorable interactions.</p>
      
      <h2><strong>Preparation Meets Opportunity</strong></h2>
      
      <p>The art of showing up also involves being prepared for the moments that matter. This doesn't mean over-planning every interaction, but rather cultivating the skills, knowledge, and mindset that allow you to contribute value when opportunities arise.</p>
      
      <p>When you show up prepared—not just with information, but with curiosity, empathy, and genuine interest—you create value for others and establish yourself as someone worth knowing.</p>
      
      <h2><strong>The Courage to Arrive Late</strong></h2>
      
      <p>Sometimes, showing up means having the courage to arrive when you're ready, not when others expect you to be there. This isn't about being disrespectful or unreliable—it's about understanding that your best contribution might come at a different time than anticipated.</p>
      
      <p>Maybe you need more time to develop your ideas, build your skills, or find your voice. Maybe the timing isn't right for what you have to offer. The art is in knowing when to wait and when to step forward.</p>
      
      <h2><strong>Making Your Mark</strong></h2>
      
      <p>When you do show up, make it count. This might mean:</p>
      
      <ul>
        <li>Asking the question everyone else is thinking but afraid to voice</li>
        <li>Offering a perspective that shifts the conversation</li>
        <li>Bringing solutions, not just problems</li>
        <li>Connecting people who should know each other</li>
        <li>Following through on commitments others might forget</li>
      </ul>
      
      <h2><strong>The Ripple Effect</strong></h2>
      
      <p>The beautiful thing about truly showing up is the ripple effect it creates. When you bring your authentic self to an interaction, it gives others permission to do the same. When you contribute meaningfully to a conversation, it elevates the entire discussion. When you show up with intention, it inspires others to be more intentional too.</p>
      
      <p>This is how you create lasting impact—not through constant visibility, but through meaningful presence when it matters most.</p>
      
      <h2><strong>The LATE Philosophy of Presence</strong></h2>
      
      <p>At LATE, we believe that showing up is an art form that requires patience, intention, and authenticity. It's not about being fashionably late or making grand entrances—it's about understanding that your presence has value and using it strategically.</p>
      
      <p>So the next time you're deciding whether to attend an event, join a conversation, or take on an opportunity, ask yourself: Can I show up fully? Can I bring value? Can I be present in a way that matters?</p>
      
      <p>If the answer is yes, then show up with intention. If the answer is no, then perhaps it's better to wait until you can arrive as your best self.</p>
      
      <p>The art of showing up isn't about timing—it's about impact. And impact is something you can create regardless of when you arrive.</p>
    `,
  },
  // Week of Dec 16, 2024
  {
    id: 2,
    title: "The Hustle Myth",
    publishDate: "December 16, 2024",
    date: "December 16, 2024",
    readTime: 12,
    excerpt: "Why working harder doesn't always mean working better. Redefining productivity on your own terms.",
    slug: "the-hustle-myth",
    type: "blog",
    content: `
      <p>We've been sold a dangerous myth: that constant hustle is the only path to success. That if you're not working every waking hour, you're falling behind. That rest is for the weak and sleep is for the unsuccessful.</p>
      
      <p>This hustle culture has created a generation of burnt-out individuals chasing an ever-moving finish line, sacrificing their health, relationships, and sanity in pursuit of a version of success that may not even be what they truly want.</p>
      
      <h2><strong>The Origins of Hustle Culture</strong></h2>
      
      <p>The glorification of overwork isn't new, but social media has amplified it to toxic levels. We see carefully curated posts about 4 AM workouts, 16-hour workdays, and "grinding" through weekends. What we don't see are the burnout, the failed relationships, and the health problems that often accompany this lifestyle.</p>
      
      <p>The hustle myth tells us that if we're not constantly busy, constantly producing, constantly moving, we're not worthy of success. But this is a fundamental misunderstanding of how real achievement works.</p>
      
      <h2><strong>The Science of Productivity</strong></h2>
      
      <p>Research consistently shows that after a certain point, working more hours actually decreases productivity. Your brain needs rest to function optimally. Your creativity needs space to flourish. Your body needs recovery to maintain energy.</p>
      
      <p>Studies have found that people who work more than 50 hours per week are significantly less productive per hour than those who work fewer hours. The quality of work declines, mistakes increase, and innovation suffers.</p>
      
      <h2><strong>The Diminishing Returns of Overwork</strong></h2>
      
      <p>The hustle myth ignores the law of diminishing returns. The first 8 hours of focused work in a day are far more valuable than the next 4 hours of exhausted effort. Yet hustle culture celebrates the person pulling all-nighters over the person who works efficiently and goes home at a reasonable hour.</p>
      
      <p>This leads to a perverse situation where being busy becomes more important than being effective, where hours logged matter more than value created.</p>
      
      <h2><strong>Redefining Productivity</strong></h2>
      
      <p>True productivity isn't about how many hours you work—it's about the value you create in the hours you do work. It's about working smarter, not harder. It's about recognizing that sometimes, the best thing you can do for your work is to step away from it.</p>
      
      <p>Consider these alternative approaches to productivity:</p>
      
      <ul>
        <li><strong>Deep Work:</strong> Focusing intensely on cognitively demanding tasks for shorter periods</li>
        <li><strong>Strategic Rest:</strong> Taking breaks to allow your subconscious to process information</li>
        <li><strong>Energy Management:</strong> Working when your energy is highest, resting when it's low</li>
        <li><strong>Outcome Focus:</strong> Measuring success by results achieved, not hours worked</li>
      </ul>
      
      <h2><strong>The Hidden Costs of Hustle Culture</strong></h2>
      
      <p>The hustle myth doesn't just hurt productivity—it damages lives. Chronic overwork leads to:</p>
      
      <ul>
        <li>Burnout and mental health issues</li>
        <li>Strained relationships and social isolation</li>
        <li>Physical health problems</li>
        <li>Decreased creativity and innovation</li>
        <li>Loss of perspective and poor decision-making</li>
      </ul>
      
      <p>These costs are rarely factored into the hustle equation, but they're very real and often irreversible.</p>
      
      <h2><strong>The Power of Strategic Laziness</strong></h2>
      
      <p>What if instead of glorifying constant motion, we celebrated strategic stillness? What if we recognized that some of our best ideas come not when we're grinding, but when we're walking, daydreaming, or simply being present?</p>
      
      <p>Many breakthrough innovations have come from moments of apparent "laziness"—times when the mind was free to wander and make unexpected connections.</p>
      
      <h2><strong>Building a Sustainable Approach</strong></h2>
      
      <p>Instead of hustle culture, consider building a sustainable approach to work and success:</p>
      
      <h3><strong>Set Boundaries</strong></h3>
      <p>Decide when you work and when you don't. Protect your rest time as fiercely as you protect your work time.</p>
      
      <h3><strong>Focus on Systems</strong></h3>
      <p>Build systems and processes that create value even when you're not actively working.</p>
      
      <h3><strong>Prioritize Ruthlessly</strong></h3>
      <p>Not everything is equally important. Focus your energy on the activities that create the most value.</p>
      
      <h3><strong>Measure What Matters</strong></h3>
      <p>Track outcomes and impact, not just activity and hours.</p>
      
      <h3><strong>Invest in Recovery</strong></h3>
      <p>Treat rest, exercise, and relationships as investments in your long-term productivity, not obstacles to it.</p>
      
      <h2><strong>The LATE Alternative</strong></h2>
      
      <p>At LATE, we reject the hustle myth in favor of a more thoughtful approach to success. We believe that sustainable achievement comes from working with intention, resting with purpose, and understanding that your worth isn't determined by your productivity.</p>
      
      <p>Success isn't a race against time—it's a dance with it. Sometimes you move quickly, sometimes you move slowly, and sometimes you stand still. The key is moving with intention, not just motion.</p>
      
      <p>So give yourself permission to work fewer hours if it means working better hours. Give yourself permission to rest without guilt. Give yourself permission to define productivity on your own terms.</p>
      
      <p>The hustle myth wants you to believe that success requires sacrifice of everything else that matters. But what if the most productive thing you could do was to reject that myth entirely?</p>
    `,
  },
  // Week of Dec 23, 2024
  {
    id: 3,
    title: "Moving in Silence",
    publishDate: "December 23, 2024",
    date: "December 23, 2024",
    readTime: 11,
    excerpt: "The power of quiet progress and letting your success speak for itself.",
    slug: "moving-in-silence",
    type: "blog",
    content: `
      <p>In an age of constant sharing, live-streaming, and public goal-setting, there's something profoundly powerful about moving in silence. Not because you're secretive or antisocial, but because some journeys are better traveled without an audience.</p>
      
      <p>Moving in silence isn't about hiding your ambitions or being mysterious for the sake of it. It's about protecting your energy, maintaining focus, and allowing your work to develop without the pressure and distraction of external commentary.</p>
      
      <h2><strong>The Noise of Public Progress</strong></h2>
      
      <p>Social media has created a culture where we feel compelled to document every step of our journey. We announce our goals, share our daily progress, and seek validation for our efforts. But this constant performance can be exhausting and counterproductive.</p>
      
      <p>When you're always explaining what you're doing, you spend less time actually doing it. When you're constantly seeking feedback, you lose touch with your own instincts. When you're performing your progress, you may prioritize what looks good over what actually works.</p>
      
      <h2><strong>The Protection of Privacy</strong></h2>
      
      <p>Working in silence protects your ideas and efforts from several forms of interference:</p>
      
      <h3><strong>Premature Criticism</strong></h3>
      <p>Ideas in their early stages are fragile. They need time to develop before they can withstand scrutiny. Sharing too early can kill promising concepts before they have a chance to mature.</p>
      
      <h3><strong>Energy Drain</strong></h3>
      <p>Explaining your vision repeatedly to others can drain the energy you need to actually execute it. Sometimes the act of talking about doing something can satisfy the psychological need to actually do it.</p>
      
      <h3><strong>External Pressure</strong></h3>
      <p>Once you've publicly committed to something, you may feel pressured to continue even if you discover a better path. Silent work gives you the flexibility to pivot without explanation.</p>
      
      <h3><strong>Comparison and Competition</strong></h3>
      <p>When others know what you're working on, it can trigger unnecessary competition or cause you to compare your behind-the-scenes reality with others' highlight reels.</p>
      
      <h2><strong>The Focus of Solitude</strong></h2>
      
      <p>Working in silence allows for deeper focus and more authentic development. Without the distraction of managing others' opinions and expectations, you can:</p>
      
      <ul>
        <li>Follow your intuition without second-guessing</li>
        <li>Experiment freely without fear of judgment</li>
        <li>Change direction without having to explain yourself</li>
        <li>Develop your own standards rather than external ones</li>
        <li>Build confidence through internal validation</li>
      </ul>
      
      <h2><strong>The Power of Surprise</strong></h2>
      
      <p>There's something magical about revealing completed work rather than work in progress. When you move in silence and then share your results, you create genuine surprise and impact. People are more impressed by finished achievements than by promises and progress reports.</p>
      
      <p>Think about the most memorable product launches, artistic reveals, or career announcements you've witnessed. Often, the most impactful ones came with little warning—they were the result of quiet, focused work that suddenly emerged into the light.</p>
      
      <h2><strong>Building Internal Confidence</strong></h2>
      
      <p>When you work in silence, you develop a different kind of confidence—one that comes from internal validation rather than external approval. You learn to trust your own judgment, to find satisfaction in the work itself rather than in others' reactions to it.</p>
      
      <p>This internal confidence is more stable and sustainable than confidence based on external validation. It doesn't fluctuate with others' opinions or disappear when the applause stops.</p>
      
      <h2><strong>When to Break the Silence</strong></h2>
      
      <p>Moving in silence doesn't mean never sharing your work or celebrating your achievements. The key is timing and intention. Consider breaking your silence when:</p>
      
      <ul>
        <li>Your work is ready for public consumption</li>
        <li>You need collaboration or input to move forward</li>
        <li>You want to inspire others with your completed journey</li>
        <li>You're ready to teach or mentor based on your experience</li>
        <li>You need to build awareness for your work or cause</li>
      </ul>
      
      <h2><strong>The Art of Strategic Revelation</strong></h2>
      
      <p>When you do choose to share your work, you can do so strategically. Instead of documenting every step, you can tell the complete story. Instead of seeking validation for your process, you can share your results. Instead of asking for opinions, you can offer insights.</p>
      
      <p>This approach allows you to control the narrative and share your work from a position of strength rather than vulnerability.</p>
      
      <h2><strong>Different Types of Silence</strong></h2>
      
      <p>Moving in silence can take different forms depending on your situation:</p>
      
      <h3><strong>Complete Privacy</strong></h3>
      <p>Telling no one about your project until it's complete.</p>
      
      <h3><strong>Selective Sharing</strong></h3>
      <p>Sharing only with a trusted few who can provide valuable input without draining your energy.</p>
      
      <h3><strong>Professional Discretion</strong></h3>
      <p>Keeping your work private from the general public while sharing with necessary collaborators or stakeholders.</p>
      
      <h3><strong>Process Privacy</strong></h3>
      <p>Sharing your goals or results but keeping your methods and daily process private.</p>
      
      <h2><strong>The LATE Philosophy of Silent Progress</strong></h2>
      
      <p>At LATE, we believe in the power of moving in silence. Not because we're secretive, but because we understand that some of the most important work happens away from the spotlight. We believe in letting our results speak louder than our announcements.</p>
      
      <p>This doesn't mean we never share our work or celebrate our achievements. It means we're strategic about when and how we do so. We protect our creative process, trust our own judgment, and understand that not every step of the journey needs an audience.</p>
      
      <p>So consider embracing some silence in your own work. Find the power in quiet progress. Discover the confidence that comes from internal validation. And remember that sometimes, the most powerful thing you can do is let your success speak for itself.</p>
      
      <p>Move in silence, and let your results make the noise.</p>
    `,
  },
  // Week of Dec 30, 2024
  {
    id: 4,
    title: "Success Isn't a Deadline, It's a Destination",
    publishDate: "December 30, 2024",
    date: "December 30, 2024",
    readTime: 9,
    excerpt: "How to focus on the journey rather than arbitrary timelines.",
    slug: "success-isnt-a-deadline",
    type: "blog",
    content: `
      <p>We've been conditioned to view success through the lens of time. "I should be at X point by Y age." "This project needs to be completed by this date." "If I haven't achieved this milestone by that deadline, I've failed."</p>
      
      <p>But what if we've been looking at it all wrong? What if success isn't about meeting deadlines, but about reaching destinations—regardless of how long the journey takes?</p>
      
      <h2><strong>The Tyranny of Artificial Deadlines</strong></h2>
      
      <p>Most of the deadlines we stress about are arbitrary. Society tells us we should graduate by 22, find our career by 25, get married by 30, buy a house by 35. But these timelines were created for a different era, with different economic conditions and social structures.</p>
      
      <p>When we fixate on these artificial deadlines, we make decisions based on timing rather than readiness. We rush into commitments we're not prepared for, choose paths that don't align with our values, and sacrifice quality for speed.</p>
      
      <h2><strong>The Journey vs. The Timeline</strong></h2>
      
      <p>Think about the most meaningful achievements in your life. Were they valuable because you reached them quickly, or because of what they taught you along the way? Would they have been more significant if you'd reached them sooner?</p>
      
      <p>The journey to any worthwhile destination is filled with lessons, growth, and experiences that are just as valuable as the destination itself. When we rush to meet deadlines, we miss the richness of this journey.</p>
      
      <p>Success isn't a race against time—it's a journey toward becoming who you're meant to be. And that journey doesn't come with an expiration date.</p>
    `,
  },
  // Add remaining blog posts through March 10, 2025
  // Then newsletter articles from March 17, 2025 onward
  {
    id: 18,
    title: "Know Thy Self: The Foundation of All Wisdom",
    publishDate: "March 17, 2025",
    date: "March 17, 2025",
    readTime: 8,
    excerpt: "Self-awareness is the cornerstone of personal growth and effective time management.",
    slug: "know-thy-self-foundation-wisdom",
    type: "newsletter",
    author: "Jane Doe",
    content: `
      <p>In a world obsessed with external validation and constant comparison, the ancient Greek maxim "Know Thyself" has never been more relevant. This isn't just philosophical rhetoric—it's the cornerstone of authentic success and meaningful living.</p>

      <h2><strong>The Mirror of Self-Awareness</strong></h2>
      <p>Self-knowledge isn't about narcissistic self-obsession. It's about understanding your authentic motivations, recognizing your patterns, and acknowledging both your strengths and limitations. When you truly know yourself, you stop chasing other people's definitions of success and start building a life that actually fits who you are.</p>

      <p>Most people spend their entire lives running from themselves, constantly seeking external validation to fill an internal void they refuse to examine. They chase promotions they don't want, relationships that don't fulfill them, and goals that belong to someone else's vision of success.</p>

      <h2><strong>The Courage to Look Inward</strong></h2>
      <p>True self-knowledge requires brutal honesty. It means acknowledging the parts of yourself you'd rather ignore. It means recognizing when you're lying to yourself about your motivations, your fears, or your desires.</p>

      <p>This process isn't comfortable. It's much easier to blame external circumstances for your dissatisfaction than to examine whether you're living authentically. But this discomfort is the price of freedom—freedom from other people's expectations, freedom from societal programming, freedom to create a life that actually makes sense for who you are.</p>

      <h2><strong>Beyond Surface-Level Introspection</strong></h2>
      <p>Real self-knowledge goes deeper than personality tests or surface-level preferences. It's about understanding your core values, your unconscious patterns, and the stories you tell yourself about who you are and what's possible.</p>

      <p>Ask yourself: What do you do when no one is watching? What patterns keep repeating in your life? What are you afraid of, and how does that fear shape your decisions? What would you do if you knew you couldn't fail—and more importantly, what would you do if you knew failure was guaranteed but you had to do it anyway?</p>

      <h2><strong>The Paradox of Self-Knowledge</strong></h2>
      <p>Here's the paradox: the more you know yourself, the more you realize how much you don't know. True self-awareness is humble. It recognizes that you're constantly evolving, that your understanding of yourself is always incomplete, and that growth requires remaining open to new discoveries about who you are.</p>

      <p>This isn't about achieving some final state of perfect self-understanding. It's about developing an ongoing relationship with yourself—one based on curiosity rather than judgment, exploration rather than fixed conclusions.</p>

      <h2><strong>The Foundation of Authentic Action</strong></h2>
      <p>When you know yourself deeply, your actions become aligned with your authentic nature. You stop trying to force yourself into molds that don't fit. You stop pursuing goals that sound impressive but feel empty. You start making decisions from a place of genuine self-understanding rather than external pressure.</p>

      <p>This alignment isn't about perfection—it's about authenticity. It's about building a life that makes sense for who you actually are, not who you think you should be or who others expect you to be.</p>

      <p><strong>Know thyself. Everything else is commentary.</strong></p>
    `,
  },
]

export default function WeeklyInsights() {
  const latestArticle = getLatestNewsletterArticle()
  const readTime = calculateReadTime(latestArticle.content)

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Weekly Insights
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Deep dives into productivity, time management, and personal growth. Published every week.
          </p>
        </div>

        {/* Latest Article Card */}
        <Card className="mb-8 overflow-hidden border-2 hover:border-purple-500 transition-all duration-300 hover:shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-purple-600/10 to-pink-600/10 border-b">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-600 text-white text-xs font-medium">
                Latest
              </span>
              <Calendar className="h-4 w-4" />
              <span>{latestArticle.date}</span>
              <Clock className="h-4 w-4 ml-2" />
              <span>{latestArticle.readTime} min read</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mb-2 hover:text-purple-600 transition-colors">
              <Link href={`/newsletter/${latestArticle.slug}`}>{latestArticle.title}</Link>
            </h3>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-muted-foreground leading-relaxed mb-4">{latestArticle.excerpt}</p>
            <div className="flex items-center text-sm text-muted-foreground">
              <span className="font-medium">{latestArticle.author}</span>
            </div>
          </CardContent>
          <CardFooter className="bg-muted/30 border-t">
            <Link href={`/newsletter/${latestArticle.slug}`} className="w-full">
              <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white group">
                Read Full Article
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* View All Button */}
        <div className="text-center">
          <Link href="/newsletter">
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white transition-all duration-300 group bg-transparent"
            >
              View All Weekly Insights
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
