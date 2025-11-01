import { format, subWeeks } from "date-fns"

export interface NewsletterArticle {
  slug: string
  title: string
  date: string
  excerpt: string
  content: string
  author: string
  readTime: number
}

interface BaseNewsletterArticle extends Omit<NewsletterArticle, "date"> {}

const START_DATE = new Date(Date.UTC(2025, 9, 19, 12))

function createContent(
  introduction: string[],
  sections: { heading: string; paragraphs: string[] }[],
  takeaways: string[],
): string {
  const introHtml = introduction.map((paragraph) => `<p>${paragraph}</p>`).join("\n\n")

  const sectionsHtml = sections
    .map(({ heading, paragraphs }) => {
      const headingHtml = `<h2>${heading}</h2>`
      const bodyHtml = paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join("\n\n")
      return `${headingHtml}\n\n${bodyHtml}`
    })
    .join("\n\n")

  const takeawaysHtml = [
    "<h3>Keep it with You</h3>",
    "<ul>",
    ...takeaways.map((takeaway) => `  <li>${takeaway}</li>`),
    "</ul>",
  ].join("\n")

  return [introHtml, sectionsHtml, takeawaysHtml].filter(Boolean).join("\n\n")
}

const baseNewsletterArticles: BaseNewsletterArticle[] = [
  {
    slug: "late-letters-october-19-2025",
    title: "Late Letters: One Home for Every Story",
    excerpt:
      "We folded the blog into this weekly letter so every reflection now arrives in a single rhythm you can count on.",
    author: "Late Team",
    readTime: 6,
    content: createContent(
      [
        "Today we gathered every story we have told and moved it under the banner of the newsletter. The blog had a good run, but people kept asking for one place to meet us. This is that place.",
        "Each issue still carries the same care, only now the archive reads like a continuous conversation. Nothing was lost. The dates simply fall into a weekly stride so you can find your footing at a glance.",
      ],
      [
        {
          heading: "What Changed",
          paragraphs: [
            "The former blog essays now sit beside the regular letters. We smoothed their language so the voice feels consistent—plain, warm, steady. Their slugs stay the same so old links keep working.",
            "We also tuned the layout. Paragraphs breathe a little more. Headings carry clear weight. Hero art and captions hold their familiar proportions so the design language still feels like home.",
          ],
        },
        {
          heading: "How We'll Show Up",
          paragraphs: [
            "Every Sunday we will publish one issue. When we look back, the dates walk backward in seven-day steps. When we look ahead, the cadence is predictable so you can build space for it.",
            "You will keep seeing the themes you know—slow success, patient ambition, work with meaning. Folding the archive into the newsletter simply removes the guesswork of where to find them.",
          ],
        },
      ],
      [
        "All past blog entries now live in the newsletter archive with their original slugs.",
        "Issues publish weekly, stepping back seven days at a time in the archive.",
        "Design tokens, imagery, and tone stay aligned with the site you already trust.",
      ],
    ),
  },
  {
    slug: "beyond-ourselves-interconnected-world",
    title: "Beyond Ourselves: Living in an Interconnected World",
    excerpt:
      "Our choices ripple through neighbors, strangers, and the land. Seeing those threads helps us act with steadier hands.",
    author: "Late Team",
    readTime: 7,
    content: createContent(
      [
        "It is easy to believe we move alone. Deadlines and headlines make us look inward, tallying wins that belong to a single name. The truth is quieter: every gain leans on someone else's labor, patience, or soil.",
        "When we widen our view, responsibility does not feel heavy. It feels honest. We see the farmer behind the coffee, the courier behind the package, the neighbor who keeps the block calm. That awareness changes how we spend our time and money.",
      ],
      [
        {
          heading: "Seeing the Web",
          paragraphs: [
            "Interdependence shows up in routine errands. The device in your pocket carries the work of miners, engineers, and warehouse staff. The meal on your table traveled through a chain of drivers, cooks, and caregivers.",
            "Naming those links does not slow us down. It grounds us. When we know who is touched by our choices, empathy becomes practical. We start looking for vendors who pay fairly and teams that honor the land.",
          ],
        },
        {
          heading: "Acting With Care",
          paragraphs: [
            "Care can be small. Pay invoices on time. Learn the names of the people who keep your building running. Ask what your purchases signal about the future you want.",
            "Communities hold when we treat every interaction as mutual. That mindset turns consumption into participation. It reminds us we are part of a longer story than a single quarter or campaign.",
          ],
        },
      ],
      [
        "Map the people behind one routine habit and thank at least one of them.",
        "Choose a supplier or partner whose practices align with your values.",
        "Share one resource that helped you understand a broader point of view.",
      ],
    ),
  },
  {
    slug: "architecture-authentic-success",
    title: "The Architecture of Authentic Success",
    excerpt:
      "Success feels sturdier when the blueprint is your own, not borrowed from a loud timeline or someone else's ladder.",
    author: "Late Team",
    readTime: 6,
    content: createContent(
      [
        "Many of us built lives from hand-me-down plans. We stacked roles because the world praised them, not because they were ours. The result was a tall structure with thin walls.",
        "Authentic success starts when we redraw the map. It asks what kind of work gives us energy, what relationships we want to protect, and what future we hope to build. Those answers rarely look like the default script.",
      ],
      [
        {
          heading: "Drafting the Blueprint",
          paragraphs: [
            "Begin with values. List the principles you refuse to trade. Let them set the boundaries for your commitments, clients, and hours.",
            "Then note the supports you need. Maybe it is unhurried mornings, creative time, or a team that trusts you. When you document these needs, you stop apologizing for them.",
          ],
        },
        {
          heading: "Building in Phases",
          paragraphs: [
            "Construction happens in stages. Release the urge to perfect every room at once. Strengthen one beam, then move to the next.",
            "Invite feedback from people who respect your vision. They help you confirm what to keep and what to tear down without steering you off course.",
          ],
        },
      ],
      [
        "Write a short list of non-negotiable values and keep it visible.",
        "Assess one commitment against your blueprint and adjust if it no longer fits.",
        "Share your draft vision with someone who supports your voice, not their agenda.",
      ],
    ),
  },
  {
    slug: "mastering-the-long-game",
    title: "Mastering the Long Game",
    excerpt:
      "Patience paired with steady effort compounds faster than any quick win. The long game rewards the ones who stay.",
    author: "Late Team",
    readTime: 6,
    content: createContent(
      [
        "Short bursts of urgency look impressive online, yet the leaders we admire built their work over seasons. They planted, tended, and waited even when progress was invisible.",
        "The long game is not passive. It is deliberate. You set a horizon, commit to habits that feed it, and let time do the quiet lifting.",
      ],
      [
        {
          heading: "Choosing Your Horizon",
          paragraphs: [
            "Define what ten years of impact could look like. The picture may include craft mastery, debt-free operations, or a community that thrives because of your presence.",
            "Once the horizon is clear, assess today's tasks. Do they feed the long run or chase applause? Trim the noise so more hours touch the work that matters.",
          ],
        },
        {
          heading: "Practicing Patient Momentum",
          paragraphs: [
            "Consistency is kinder than intensity. Small, regular actions let you adjust without burning out.",
            "Review your progress in quiet intervals. Celebrate markers that hint at compounding—repeat customers, calm mornings, dependable partners.",
          ],
        },
      ],
      [
        "Name one long-term outcome worth investing in this week.",
        "Align a daily habit with that horizon and protect it on your calendar.",
        "Track signs of compounding instead of chasing one-off wins.",
      ],
    ),
  },
  {
    slug: "wisdom-strategic-withdrawal",
    title: "The Wisdom of Strategic Withdrawal",
    excerpt: "Stepping back on purpose is not defeat—it is how we reclaim energy and choose better battles.",
    author: "Late Team",
    readTime: 5,
    content: createContent(
      [
        "Leaving a project can sting, especially when hustle culture celebrates endless grind. Yet the bravest move is often to pause, regroup, and return with a clearer aim.",
        "Strategic withdrawal is a craft. You learn to read the signs of diminishing returns and honor your limits before they harden into resentment.",
      ],
      [
        {
          heading: "Noticing the Signals",
          paragraphs: [
            "Exhaustion that rest cannot cure, goals that no longer match your values, or partnerships that erode trust—all hint that it is time to reassess.",
            "Instead of powering through, gather the facts. Ask what the work demands, what it costs, and whether that trade still makes sense.",
          ],
        },
        {
          heading: "Withdrawing with Integrity",
          paragraphs: [
            "Communicate directly. Explain the shift without blaming. Offer a handoff plan when possible so the relationship remains intact.",
            "Use the space you gain to heal and to listen. Withdrawal is only strategic if you channel the freed energy into something truer.",
          ],
        },
      ],
      [
        "List three signs that tell you it is time to pause or pivot.",
        "Draft a graceful exit script so future withdrawals feel respectful.",
        "Schedule recovery activities before you fill the space with new obligations.",
      ],
    ),
  },
  {
    slug: "creating-personal-renaissance",
    title: "Creating Your Personal Renaissance",
    excerpt:
      "A wide curiosity is not a flaw. It is fuel for resilience when we stitch our interests into one life.",
    author: "Late Team",
    readTime: 6,
    content: createContent(
      [
        "The world tells us to specialize early and stay in our lane. Yet many of us carry restless curiosity that refuses to shrink.",
        "A personal renaissance honors that variety. You cultivate depth in one craft while letting side interests feed your imagination and your problem-solving.",
      ],
      [
        {
          heading: "Collecting Threads",
          paragraphs: [
            "List the subjects that keep tugging at you. Some may be practical, others purely joyful. None require permission.",
            "Look for overlap. Maybe your love of music shapes how you design presentations. Maybe gardening informs your patience with clients. The goal is connection, not clutter.",
          ],
        },
        {
          heading: "Designing a Rhythm",
          paragraphs: [
            "Protect time for exploration without guilt. Short weekly sessions keep skills alive and ideas fresh.",
            "Share what you learn. Cross-pollination often sparks solutions others miss because they only see one field.",
          ],
        },
      ],
      [
        "List three interests that deserve a little time each month.",
        "Find one connection between a hobby and your primary work.",
        "Teach someone a lesson from your side craft to cement what you know.",
      ],
    ),
  },
  {
    slug: "power-intentional-obscurity",
    title: "The Power of Intentional Obscurity",
    excerpt:
      "Working offstage can protect focus and let your ideas ripen before they meet the crowd.",
    author: "Late Team",
    readTime: 5,
    content: createContent(
      [
        "Visibility is overvalued. We are told to post every draft and narrate every milestone. Yet quiet seasons give us room to build without noise.",
        "Intentional obscurity is not hiding. It is choosing when to reveal your work so it arrives finished, rooted, and ready.",
      ],
      [
        {
          heading: "Shielding Your Focus",
          paragraphs: [
            "Constant feedback can shake an idea before it has legs. Create private sprints where you create for yourself first.",
            "Share progress with a trusted circle who understands context. Their reflections keep you honest without draining momentum.",
          ],
        },
        {
          heading: "Announcing on Your Terms",
          paragraphs: [
            "When the work is sturdy, plan how to introduce it. Context matters—frame the story so people see the care you invested.",
            "Lean into timing that favors the project, not the algorithm. A slow reveal often feels more personal and true.",
          ],
        },
      ],
      [
        "Set aside one project to build in private this season.",
        "Pick two people who can offer thoughtful feedback without broadcasting your drafts.",
        "Plan a launch moment that matches the tone of the work instead of chasing trends.",
      ],
    ),
  },
  {
    slug: "redefining-professional-growth",
    title: "Redefining Professional Growth",
    excerpt:
      "Careers are no longer ladders. They are gardens that need pruning, patience, and a clear sense of purpose.",
    author: "Late Team",
    readTime: 6,
    content: createContent(
      [
        "Promotions used to be the only proof of progress. Now we measure growth by the skills we gain, the lives we touch, and the alignment we keep with our values.",
        "When we treat our careers like gardens, we decide what to plant, what to trim, and where to rest the soil.",
      ],
      [
        {
          heading: "Setting Living Benchmarks",
          paragraphs: [
            "Document the capabilities you want to build this year. Pair each with habits or projects that will stretch you.",
            "Check alignment often. If a role pulls you away from your values, explore adjustments before resentment takes root.",
          ],
        },
        {
          heading: "Sharing the Harvest",
          paragraphs: [
            "Growth is communal. Mentor someone walking the path behind you. Ask for guidance from someone a few steps ahead.",
            "Celebrate progress by reflecting on how your work now serves people better than it did a year ago.",
          ],
        },
      ],
      [
        "Name one skill you are actively cultivating and why it matters.",
        "Schedule a conversation with a mentor or peer about what growth looks like now.",
        "Identify one task to prune so you have room for higher-impact work.",
      ],
    ),
  },
  {
    slug: "art-productive-solitude",
    title: "The Art of Productive Solitude",
    excerpt:
      "Quiet time is not empty. It is the workshop where ideas find shape without competing voices.",
    author: "Late Team",
    readTime: 5,
    content: createContent(
      [
        "Solitude can feel selfish in a busy world, yet it is often the only space where our clearest thinking appears.",
        "Productive solitude is structured. We choose when to step away, set an intention, and return with notes we can share.",
      ],
      [
        {
          heading: "Preparing the Space",
          paragraphs: [
            "Pick a setting that signals focus—a quiet room, a library corner, a park bench. Leave devices that tempt you to scroll.",
            "Bring a single question or project. Solitude thrives when it has a purpose, even if that purpose is reflection.",
          ],
        },
        {
          heading: "Returning with Gifts",
          paragraphs: [
            "Close each session by writing what surfaced. Even a few sentences capture the insight before the noise returns.",
            "Share the parts that can help your team. Solitude is not withdrawal from people; it is service to them through clearer thinking.",
          ],
        },
      ],
      [
        "Block an hour of solo focus this week and treat it as non-negotiable.",
        "Enter solitude with a prompt that matters so the time stays intentional.",
        "Leave with notes you can act on or share with someone who needs the clarity.",
      ],
    ),
  },
  {
    slug: "building-unshakeable-inner-authority",
    title: "Building Unshakeable Inner Authority",
    excerpt:
      "When your decisions flow from grounded conviction, outside noise loses its power.",
    author: "Late Team",
    readTime: 6,
    content: createContent(
      [
        "Inner authority is the quiet confidence that says, \"I can trust my read on this situation.\" It grows each time we act in alignment with our values and survive the outcome.",
        "You do not need to be loud to be certain. Inner authority often sounds like calm questions, patient listening, and steady follow-through.",
      ],
      [
        {
          heading: "Gathering Evidence",
          paragraphs: [
            "Reflect on moments when you honored your instincts and things worked out. These memories become proof when doubt creeps in.",
            "Study your missteps without shame. They teach you where your perspective needs more data or where fear led the way.",
          ],
        },
        {
          heading: "Standing Firm with Grace",
          paragraphs: [
            "When pressure arrives, breathe before you answer. A pause reminds you that you have agency.",
            "Speak from your values. You can be compassionate while staying firm about what is non-negotiable.",
          ],
        },
      ],
      [
        "Document three decisions that proved you can trust yourself.",
        "Identify one situation where you tend to defer and plan how you will voice your view next time.",
        "Create a grounding ritual—maybe a phrase or breath—before important conversations.",
      ],
    ),
  },
  {
    slug: "philosophy-selective-excellence",
    title: "The Philosophy of Selective Excellence",
    excerpt:
      "Trying to excel at everything dilutes the work that matters. Choose your arenas and let the rest be good enough.",
    author: "Late Team",
    readTime: 5,
    content: createContent(
      [
        "Selective excellence is not laziness. It is strategy. We only have so much energy, so we invest it where our gifts make the greatest difference.",
        "Letting some areas be simply functional frees time and attention for the projects that deserve depth.",
      ],
      [
        {
          heading: "Picking Your Arenas",
          paragraphs: [
            "List the responsibilities on your plate. Circle the few that define your unique value—those become your excellence zones.",
            "For the rest, define what \"good enough\" means. Clarity prevents guilt when you resist the pull to over-polish everything.",
          ],
        },
        {
          heading: "Maintaining Standards",
          paragraphs: [
            "Excellence requires rhythm. Build routines that support peak performance in your chosen arenas.",
            "Review boundaries often. If new tasks creep into your excellence zones without intention, reset expectations with your team.",
          ],
        },
      ],
      [
        "Choose two areas where you will invest excellence this season.",
        "Define a \"good enough\" standard for tasks outside those arenas.",
        "Communicate your focus so collaborators know where you shine and where you need support.",
      ],
    ),
  },
  {
    slug: "navigating-success-without-losing-yourself",
    title: "Navigating Success Without Losing Yourself",
    excerpt:
      "Ambition feels better when it protects your identity instead of trading it away.",
    author: "Late Team",
    readTime: 6,
    content: createContent(
      [
        "Success can slip into costume play. We try on voices and habits that are not ours because we assume they come with the role.",
        "The alternative is slower but kinder: define success on your own terms and let every milestone reflect who you really are.",
      ],
      [
        {
          heading: "Checking Your Compass",
          paragraphs: [
            "Keep a running list of values and personal non-negotiables. Before accepting a new opportunity, hold it against that list.",
            "Notice when your behavior shifts to please a room. Adjust gently. Authenticity is a practice, not a finish line.",
          ],
        },
        {
          heading: "Staying Rooted",
          paragraphs: [
            "Cultivate relationships that know the real you. They will spot when you drift and help you return without judgment.",
            "Celebrate milestones in ways that match your temperament. Maybe you crave a quiet walk instead of a spotlight. Honor that.",
          ],
        },
      ],
      [
        "Review a recent decision and note whether it aligned with your core values.",
        "Plan a small ritual that keeps you grounded during busy seasons.",
        "Thank someone who protects your authenticity and tell them why it matters.",
      ],
    ),
  },
  {
    slug: "compound-effect-consistent-reflection",
    title: "The Compound Effect of Consistent Reflection",
    excerpt:
      "A few honest notes each week sharpen judgment, soften ego, and chart progress more clearly than any dashboard.",
    author: "Late Team",
    readTime: 5,
    content: createContent(
      [
        "Reflection is simple but rarely urgent, so it falls to the side. When we make time for it, we see patterns sooner and course-correct before small problems swell.",
        "This practice does not require long retreats. Fifteen quiet minutes at the end of the week can reveal enough to keep us on course.",
      ],
      [
        {
          heading: "Keeping the Record",
          paragraphs: [
            "Set a recurring reminder. Ask yourself what worked, what felt off, and what surprised you.",
            "Write without editing. Honest notes are more useful than polished prose. Over time, they become a map of your growth.",
          ],
        },
        {
          heading: "Turning Insight into Action",
          paragraphs: [
            "Choose one small adjustment for the coming week. Maybe it is a boundary, a conversation, or a habit tweak.",
            "Share reflections with a trusted partner when helpful. External accountability keeps the practice alive.",
          ],
        },
      ],
      [
        "Schedule a weekly reflection block and guard it.",
        "Use the same questions each time so you can track trends.",
        "Act on one insight immediately to reinforce the habit.",
      ],
    ),
  },
  {
    slug: "designing-your-ideal-day",
    title: "Designing Your Ideal Day",
    excerpt:
      "A good life is built out of good days. Design one intentionally and repeat it as often as you can.",
    author: "Late Team",
    readTime: 5,
    content: createContent(
      [
        "Most days run on autopilot. We rush from meeting to meeting without asking whether the schedule serves our best work.",
        "Designing an ideal day is an act of agency. You identify the anchors that keep you grounded and structure everything else around them.",
      ],
      [
        {
          heading: "Setting the Anchors",
          paragraphs: [
            "List what you need daily—movement, deep work, meals away from screens, time with family. Put them on the calendar first.",
            "Create start and stop rituals so your brain knows when to focus and when to rest.",
          ],
        },
        {
          heading: "Protecting the Design",
          paragraphs: [
            "Say no to commitments that break the structure without serving a clear purpose.",
            "Review the layout weekly. Small adjustments keep the day responsive to real life.",
          ],
        },
      ],
      [
        "Sketch your ideal weekday hour by hour.",
        "Implement one anchor immediately and guard it for the next month.",
        "Reflect weekly on how well your day matched the design and adjust.",
      ],
    ),
  },
  {
    slug: "courage-to-disappoint-others",
    title: "The Courage to Disappoint Others",
    excerpt:
      "Saying no with kindness keeps your life aligned, even when it ruffles expectations.",
    author: "Late Team",
    readTime: 5,
    content: createContent(
      [
        "Every yes costs something. When we pile them up to please others, resentment creeps in and our best work suffers.",
        "Disappointing someone is uncomfortable, but it is kinder than pretending you can deliver when your heart is elsewhere.",
      ],
      [
        {
          heading: "Naming Your Boundaries",
          paragraphs: [
            "Know your capacity. When you understand your limits, declining an offer feels less like failure and more like stewardship.",
            "Prepare phrases that respect both parties. Clarity with warmth helps others absorb the no without confusion.",
          ],
        },
        {
          heading: "Handling the Aftermath",
          paragraphs: [
            "Some people will still push back. Stay calm. Restate your decision without defending every detail.",
            "Check in on the relationship later. Reassure them that the no was about capacity, not a lack of care.",
          ],
        },
      ],
      [
        "Identify one commitment that no longer fits and release it.",
        "Draft a kind decline message you can adapt in the future.",
        "Notice how much energy returns after you honor a boundary.",
      ],
    ),
  },
  {
    slug: "fear-of-falling-behind",
    title: "The Fear of Falling Behind (And Why It's a Lie)",
    excerpt:
      "Timelines invented by strangers have no bearing on your worth. Your pace is your own.",
    author: "Late Team",
    readTime: 5,
    content: createContent(
      [
        "Comparison is quicksand. Scroll long enough and you will find someone younger, faster, or louder. The feeling of being late follows close behind.",
        "The truth: there is no race. Your work unfolds on a timeline shaped by your responsibilities, your history, and your dreams.",
      ],
      [
        {
          heading: "Tracing the Origin",
          paragraphs: [
            "When the fear surfaces, ask whose expectation you are trying to satisfy. Most of the time it is not your own.",
            "Challenge the story. Would you be happier if you reached the milestone sooner, or do you simply want relief from judgment?",
          ],
        },
        {
          heading: "Choosing Your Pace",
          paragraphs: [
            "Set milestones based on readiness, not pressure. Slow progress built on alignment outlasts rushed wins.",
            "Celebrate the unique route you took. Detours often gave you skills the shortcut never would.",
          ],
        },
      ],
      [
        "Journal about the last time you felt behind and whose voice you heard.",
        "Define success markers tied to your context, not a peer's highlight reel.",
        "Share your pace with someone who respects it and ask for accountability when doubt returns.",
      ],
    ),
  },
  {
    slug: "being-unapologetically-you",
    title: "The Power of Being Unapologetically You",
    excerpt:
      "You do your best work when you stop shrinking and offer your full voice.",
    author: "Late Team",
    readTime: 5,
    content: createContent(
      [
        "We spend years editing ourselves to fit expectations. The result is bland work and tired hearts.",
        "When we show up whole—quirks, questions, convictions—people can finally connect with us for real.",
      ],
      [
        {
          heading: "Practicing Self-Honesty",
          paragraphs: [
            "Notice where you soften your opinions or hide your interests. Ask why.",
            "Start revealing small truths in safe rooms. Confidence grows with each honest exchange.",
          ],
        },
        {
          heading: "Finding the Right Audience",
          paragraphs: [
            "Not everyone will cheer. Seek communities that welcome your texture instead of sanding it down.",
            "Remember that your unique perspective is what draws the right collaborators and clients.",
          ],
        },
      ],
      [
        "Share one personal value or story in a setting where you usually stay quiet.",
        "Say no to an opportunity that requires you to play small.",
        "Affirm a friend when they show up authentically to encourage more of it.",
      ],
    ),
  },
  {
    slug: "rejection-is-redirection",
    title: "Rejection Is Redirection",
    excerpt:
      "A closed door hurts, but it often nudges us toward work that fits better than we imagined.",
    author: "Late Team",
    readTime: 5,
    content: createContent(
      [
        "When the email says no, it can feel like a verdict on our worth. Yet most rejections simply mean the fit was wrong—for now or for that room.",
        "Redirection becomes a gift when we pause long enough to learn what the setback is pointing us toward.",
      ],
      [
        {
          heading: "Feeling It Fully",
          paragraphs: [
            "Allow yourself to feel disappointed. Naming the emotion prevents it from festering.",
            "Then move gently into curiosity. What did this experience teach you about your strengths, your limits, or your desires?",
          ],
        },
        {
          heading: "Plotting the Next Move",
          paragraphs: [
            "List the doors that remain open—skills you can sharpen, networks you can join, projects you can start on your own.",
            "Use the feedback, if any, to adjust course. Sometimes rejection is simply timing. Sometimes it reveals a better direction entirely.",
          ],
        },
      ],
      [
        "Write a reflection on a recent rejection and note what it redirected you toward.",
        "Reach out to someone who can offer perspective or a new lead.",
        "Commit to one action that moves you forward within the week.",
      ],
    ),
  },
  {
    slug: "the-late-mindset",
    title: "The Late Mindset: Thriving Outside Society's Timeline",
    excerpt:
      "There is no shame in arriving later than expected. Often it means you were gathering the wisdom the moment required.",
    author: "Late Team",
    readTime: 6,
    content: createContent(
      [
        "Being late to a milestone does not mean you failed. It usually means you were living, learning, and caring for people in ways the timeline forgot to measure.",
        "The late mindset embraces deliberate pacing. You take in the view, collect context, and act when the ground is ready.",
      ],
      [
        {
          heading: "Honoring the Detours",
          paragraphs: [
            "Write down what you gained by taking your time—skills, empathy, stability.",
            "Share those gifts with others who rush. They may need your calm perspective.",
          ],
        },
        {
          heading: "Setting Your Cadence",
          paragraphs: [
            "Plan according to seasons of your life, not internet expectations.",
            "Check in quarterly. If the pace still feels right, stay the course. If not, adjust without shame.",
          ],
        },
      ],
      [
        "List three advantages your slower journey has given you.",
        "Encourage someone who feels behind by sharing part of your story.",
        "Choose one goal and set a timeline that respects your real life.",
      ],
    ),
  },
  {
    slug: "you-are-your-own-rescue",
    title: "You Are Your Own Rescue",
    excerpt:
      "Help can come, but the turning point usually arrives when you decide to move.",
    author: "Late Team",
    readTime: 5,
    content: createContent(
      [
        "Waiting for someone else to fix our situation keeps us stuck. Support matters, but agency matters more.",
        "Rescue begins with small actions—making the call, updating the résumé, asking for counseling, cleaning one corner of the room.",
      ],
      [
        {
          heading: "Claiming Responsibility",
          paragraphs: [
            "List the parts of your challenge that you can influence. Focus on those instead of dwelling on what others might do.",
            "Set gentle deadlines. Momentum builds when we keep promises to ourselves.",
          ],
        },
        {
          heading: "Inviting Support Wisely",
          paragraphs: [
            "Tell a friend or mentor what you are working toward so they can cheer you on.",
            "Accept help as a supplement, not a replacement, for your own action. Collaboration feels better when you already have motion.",
          ],
        },
      ],
      [
        "Identify one step you can take today without waiting for anyone else.",
        "Share your plan with someone who will hold you kindly accountable.",
        "Celebrate progress, no matter how small, to reinforce your agency.",
      ],
    ),
  },
  {
    slug: "patience-and-timing",
    title: "Patience & Timing: The Power of Knowing When to Move",
    excerpt:
      "Right moves made too soon can fail. Patience lets you strike when the moment is ready to receive your work.",
    author: "Late Team",
    readTime: 5,
    content: createContent(
      [
        "We admire bold leaps, yet most success stories are a braid of patience and decisive action.",
        "Learning to wait is not the same as stalling. It is studying the landscape so your effort lands where it can thrive.",
      ],
      [
        {
          heading: "Reading the Season",
          paragraphs: [
            "Gather data before you move. Talk to customers, peers, and mentors. Look for signals that the market or your community is ready.",
            "Notice your internal cues. Rested confidence feels different from anxious urgency.",
          ],
        },
        {
          heading: "Moving with Intent",
          paragraphs: [
            "Once the signs align, act fully. Patience pays off only if you follow through when the window opens.",
            "Afterward, review what you learned about timing so you can repeat the pattern.",
          ],
        },
      ],
      [
        "Identify a decision that needs more information before you act.",
        "List the signals that will tell you the time is right.",
        "Commit to decisive action once those signals appear.",
      ],
    ),
  },
  {
    slug: "success-isnt-a-deadline",
    title: "Success Isn't a Deadline, It's a Destination",
    excerpt:
      "Your worth is not tied to hitting a mark by a certain age. Success is a direction you keep choosing.",
    author: "Late Team",
    readTime: 6,
    content: createContent(
      [
        "Deadlines can motivate, but they also warp our view. We start racing the calendar instead of listening to the work.",
        "When success becomes a destination, the journey matters again. We savor learning, relationships, and rest because they are part of the point, not distractions from it.",
      ],
      [
        {
          heading: "Redefining the Finish Line",
          paragraphs: [
            "Write what a successful life feels like day to day. Include textures: calm mornings, trusted teammates, meaningful impact.",
            "Let those feelings guide your goals. They outlast arbitrary ages and corporate checklists.",
          ],
        },
        {
          heading: "Living the Direction",
          paragraphs: [
            "Notice the moments when you already taste success—maybe in how you handled a tough conversation or how you rested without guilt.",
            "Treat setbacks as bends in the road, not proof that you missed the deadline. Adjust and keep moving toward the feeling you named.",
          ],
        },
      ],
      [
        "Describe success using sensory detail instead of dates.",
        "Plan one ritual that helps you experience that feeling this week.",
        "Reframe a recent setback as part of the longer route.",
      ],
    ),
  },
  {
    slug: "moving-in-silence",
    title: "Moving in Silence",
    excerpt:
      "Progress does not need a spotlight. Quiet work often surprises the world when it arrives.",
    author: "Late Team",
    readTime: 5,
    content: createContent(
      [
        "Noise can dilute focus. When we announce every move, we invite opinions before the work is ready.",
        "Moving in silence lets us refine without distraction. We emerge with something solid enough to speak for itself.",
      ],
      [
        {
          heading: "Guarding the Process",
          paragraphs: [
            "Keep some plans private until they have sturdy legs. Mystery protects momentum.",
            "Use the quiet to iterate quickly. Without external commentary, you can follow intuition and data in equal measure.",
          ],
        },
        {
          heading: "Sharing at the Right Time",
          paragraphs: [
            "When you do reveal the work, frame the story. Explain the why, the how, and the care involved.",
            "Invite feedback once the foundation is set. At that stage, outside insight can help you polish without derailing the core.",
          ],
        },
      ],
      [
        "Choose one project to develop quietly for the next month.",
        "Set criteria for when it will be ready to share.",
        "Document the journey privately so you can tell the story later.",
      ],
    ),
  },
  {
    slug: "the-hustle-myth",
    title: "The Hustle Myth",
    excerpt:
      "Constant grind is not a badge of honor. Rested minds make better moves.",
    author: "Late Team",
    readTime: 6,
    content: createContent(
      [
        "Hustle culture preaches nonstop motion. Yet the most effective leaders work in waves—they focus deeply, then step back to recover.",
        "Our bodies and brains need cycles. Ignoring that truth turns passion into exhaustion.",
      ],
      [
        {
          heading: "Measuring What Matters",
          paragraphs: [
            "Track outcomes, not hours. Notice how quality improves after real rest.",
            "Replace \"busy\" with specific language about what you are building. Clarity breaks the spell of performative hustle.",
          ],
        },
        {
          heading: "Designing Sustainable Routines",
          paragraphs: [
            "Build in recovery: sleep, movement, unstructured play. Treat them as fuel, not rewards.",
            "Set realistic workloads. Overcommitting helps no one, including the clients you want to serve.",
          ],
        },
      ],
      [
        "Audit your week for needless busywork and remove one obligation.",
        "Plan rest with the same intention as work.",
        "Share a story about how recovery improved your output to shift the culture around you.",
      ],
    ),
  },
  {
    slug: "the-art-of-showing-up",
    title: "The Art of Showing Up",
    excerpt:
      "Presence matters more than ubiquity. When you arrive with intention, people feel it.",
    author: "Late Team",
    readTime: 5,
    content: createContent(
      [
        "Showing up is a choice. It means bringing attention, respect, and readiness—not just a body in a chair.",
        "We do our best work when we choose fewer rooms and enter them fully prepared to contribute.",
      ],
      [
        {
          heading: "Preparing to Arrive",
          paragraphs: [
            "Clarify why your presence matters before you walk in. Preparation signals respect for everyone involved.",
            "Leave distractions outside. Silence notifications, take notes by hand, and look people in the eye.",
          ],
        },
        {
          heading: "Following Through",
          paragraphs: [
            "Capture commitments and deliver on them quickly. Reliability is the loudest form of showing up.",
            "Thank the people who made the gathering possible. Gratitude keeps doors open.",
          ],
        },
      ],
      [
        "Decide which meetings or events deserve your full presence this week.",
        "Prepare one thoughtful question or insight for each.",
        "Close the loop afterward with clear follow-up.",
      ],
    ),
  },
  {
    slug: "mastering-energy-management",
    title: "Mastering Energy Management: The Secret to Peak Performance",
    excerpt:
      "Time management is overrated; managing energy keeps you consistent without burning out.",
    author: "Late Team",
    readTime: 6,
    content: createContent(
      [
        "You can plan every minute and still feel depleted. Energy—not hours—determines the quality of your work.",
        "When you understand your rhythms, you schedule demanding tasks when you are sharp and save lighter work for low-energy moments.",
      ],
      [
        {
          heading: "Charting Your Rhythms",
          paragraphs: [
            "Track your energy for a week. Notice when focus peaks and when it dips.",
            "Assign deep work to peak blocks and insert restorative breaks before your energy collapses.",
          ],
        },
        {
          heading: "Fueling the Four Energies",
          paragraphs: [
            "Guard physical basics—sleep, nutrition, movement. They anchor every other effort.",
            "Tend to emotional, mental, and spiritual energy with boundaries, single-tasking, and a sense of purpose.",
          ],
        },
      ],
      [
        "Log your energy levels for the next seven days.",
        "Schedule breaks before you feel fried.",
        "Revisit your purpose statement when motivation wanes.",
      ],
    ),
  },
  {
    slug: "decision-fatigue-solution",
    title: "Defeating Decision Fatigue: Automate Your Success",
    excerpt:
      "Every unnecessary choice drains focus. Automate the simple things so you can think about the work that counts.",
    author: "Late Team",
    readTime: 5,
    content: createContent(
      [
        "Decision fatigue creeps up quietly. By evening, even small choices feel hard because our mental battery is empty.",
        "Automation protects willpower. When routines handle the basics, your brain saves strength for creative thinking.",
      ],
      [
        {
          heading: "Simplifying the Routine",
          paragraphs: [
            "Standardize morning and evening habits so you start and end the day with calm.",
            "Meal plans, capsule wardrobes, and templated workflows remove dozens of micro-decisions.",
          ],
        },
        {
          heading: "Creating If-Then Rules",
          paragraphs: [
            "Use simple triggers: If it is Monday, review strategy. If a meeting request arrives, send your booking link.",
            "Batch similar tasks together. Your brain loves staying in the same mode.",
          ],
        },
      ],
      [
        "Identify three daily decisions you can automate this week.",
        "Write two if-then rules to guide recurring scenarios.",
        "End each day by prepping tomorrow's essentials.",
      ],
    ),
  },
  {
    slug: "deep-focus-mastery",
    title: "Deep Focus Mastery",
    excerpt:
      "In a world of pings, your ability to focus is a competitive advantage worth training.",
    author: "Late Team",
    readTime: 6,
    content: createContent(
      [
        "Deep focus is not a natural state anymore; it is a discipline. The more we practice, the easier it becomes to stay with a demanding task.",
        "Treat focus like a muscle. Warm up, lift for a set period, then recover before the next session.",
      ],
      [
        {
          heading: "Creating the Conditions",
          paragraphs: [
            "Clear your space of obvious distractions. Put the phone in another room and close extra tabs.",
            "Set a clear intention before each focus block so you know what success looks like.",
          ],
        },
        {
          heading: "Building Capacity",
          paragraphs: [
            "Start with 25-minute sessions if 90 feels impossible. Extend gradually as your endurance improves.",
            "When your mind wanders, guide it back without judgment. The redirection is part of the practice.",
          ],
        },
      ],
      [
        "Schedule two focused blocks this week and treat them like important meetings.",
        "Use a single-task ritual—a candle, a playlist, a stretch—to signal deep work time.",
        "Track your focus streaks to watch the muscle grow.",
      ],
    ),
  },
  {
    slug: "priority-paradox",
    title: "The Priority Paradox: Why Doing Less Achieves More",
    excerpt:
      "Focus wins. When you narrow your efforts, results multiply instead of scattering.",
    author: "Late Team",
    readTime: 5,
    content: createContent(
      [
        "We often equate busyness with importance. Yet the people achieving the most meaningful outcomes are ruthless about doing less.",
        "The paradox is simple: every new obligation dilutes the attention available for what truly matters.",
      ],
      [
        {
          heading: "Finding the Vital Few",
          paragraphs: [
            "List everything on your plate and score each task for impact versus effort.",
            "Keep the top tier, delegate or defer the rest. Say no before your calendar says it for you.",
          ],
        },
        {
          heading: "Saying Yes with Purpose",
          paragraphs: [
            "Before you accept something new, ask what must be released. Space is finite.",
            "Protect prime hours for priority work. Schedule it first and guard it fiercely.",
          ],
        },
      ],
      [
        "Identify one task to eliminate today.",
        "Block time for your highest-impact work before anything else claims it.",
        "Review your commitments weekly and adjust before overwhelm hits.",
      ],
    ),
  },
  {
    slug: "systems-over-goals",
    title: "Systems Over Goals: Building Sustainable Success",
    excerpt:
      "Goals set direction; systems carry you there by making progress automatic.",
    author: "Late Team",
    readTime: 5,
    content: createContent(
      [
        "Goals can inspire, but they can also intimidate. Systems break ambition into repeatable steps you can win every day.",
        "When you focus on the process, outcomes become byproducts of consistent behavior.",
      ],
      [
        {
          heading: "Designing Your System",
          paragraphs: [
            "Pick one goal and identify the smallest daily habit that supports it.",
            "Make the habit obvious, easy, and satisfying so you keep showing up.",
          ],
        },
        {
          heading: "Iterating with Feedback",
          paragraphs: [
            "Track execution, not just results. Did you follow the system today?",
            "Adjust when friction appears. Systems should evolve with your life, not stay rigid.",
          ],
        },
      ],
      [
        "Translate one goal into a daily or weekly habit.",
        "Remove friction that keeps you from starting the habit.",
        "Celebrate streaks to reinforce the system.",
      ],
    ),
  },
  {
    slug: "deliberate-rest",
    title: "Deliberate Rest: The Productivity Paradox",
    excerpt:
      "Rest is not the opposite of work. It is the part that lets the work shine.",
    author: "Late Team",
    readTime: 5,
    content: createContent(
      [
        "We glorify busy schedules, yet the brain needs pauses to integrate ideas and recover.",
        "Deliberate rest is intentional. You choose activities that restore mind and body so you can return sharper.",
      ],
      [
        {
          heading: "Planning Recovery",
          paragraphs: [
            "Embed micro-breaks into long work sessions—stretch, breathe, step outside.",
            "Protect weekly sabbath time. Even a half day of genuine rest resets perspective.",
          ],
        },
        {
          heading: "Resting with Purpose",
          paragraphs: [
            "Mix passive rest with active restoration like walks, art, or gentle conversation.",
            "Release guilt. Rest is an investment that pays back in clarity and stamina.",
          ],
        },
      ],
      [
        "Schedule breaks before your calendar fills up.",
        "Choose one restorative activity to practice this week.",
        "Track how rest days influence your energy and creativity.",
      ],
    ),
  },
]

export const newsletterArticles: NewsletterArticle[] = baseNewsletterArticles.map((article, index) => ({
  ...article,
  date: format(subWeeks(START_DATE, index), "MMMM d, yyyy"),
}))

export function getAllNewsletterArticles(): NewsletterArticle[] {
  return newsletterArticles
}

export function getLatestNewsletterArticle(): NewsletterArticle {
  return newsletterArticles[0]
}

export function getNewsletterArticleBySlug(slug: string): NewsletterArticle | undefined {
  return newsletterArticles.find((article) => article.slug === slug)
}
