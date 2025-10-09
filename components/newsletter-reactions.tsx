"use client"

import { useState, useEffect } from "react"
import { Heart, ThumbsUp, Lightbulb, Target } from "lucide-react"

interface Reaction {
  type: "love" | "like" | "insightful" | "inspiring"
  count: number
  userReacted: boolean
}

interface NewsletterReactionsProps {
  newsletterId: number
}

export default function NewsletterReactions({ newsletterId }: NewsletterReactionsProps) {
  const [reactions, setReactions] = useState<Reaction[]>([
    { type: "love", count: 0, userReacted: false },
    { type: "like", count: 0, userReacted: false },
    { type: "insightful", count: 0, userReacted: false },
    { type: "inspiring", count: 0, userReacted: false },
  ])

  // Load reactions from localStorage on component mount
  useEffect(() => {
    const savedReactions = localStorage.getItem(`newsletter-reactions-${newsletterId}`)
    if (savedReactions) {
      setReactions(JSON.parse(savedReactions))
    } else {
      // Initialize with some random counts for demo
      const initialReactions = [
        { type: "love" as const, count: Math.floor(Math.random() * 20) + 5, userReacted: false },
        { type: "like" as const, count: Math.floor(Math.random() * 15) + 8, userReacted: false },
        { type: "insightful" as const, count: Math.floor(Math.random() * 12) + 3, userReacted: false },
        { type: "inspiring" as const, count: Math.floor(Math.random() * 18) + 6, userReacted: false },
      ]
      setReactions(initialReactions)
      localStorage.setItem(`newsletter-reactions-${newsletterId}`, JSON.stringify(initialReactions))
    }
  }, [newsletterId])

  const handleReaction = (type: Reaction["type"]) => {
    const updatedReactions = reactions.map((reaction) => {
      if (reaction.type === type) {
        return {
          ...reaction,
          count: reaction.userReacted ? reaction.count - 1 : reaction.count + 1,
          userReacted: !reaction.userReacted,
        }
      }
      return reaction
    })

    setReactions(updatedReactions)
    localStorage.setItem(`newsletter-reactions-${newsletterId}`, JSON.stringify(updatedReactions))
  }

  const getReactionIcon = (type: Reaction["type"]) => {
    switch (type) {
      case "love":
        return <Heart className="w-5 h-5" />
      case "like":
        return <ThumbsUp className="w-5 h-5" />
      case "insightful":
        return <Lightbulb className="w-5 h-5" />
      case "inspiring":
        return <Target className="w-5 h-5" />
    }
  }

  const getReactionLabel = (type: Reaction["type"]) => {
    switch (type) {
      case "love":
        return "Love"
      case "like":
        return "Like"
      case "insightful":
        return "Insightful"
      case "inspiring":
        return "Inspiring"
    }
  }

  return (
    <div className="mt-12 pt-8 border-t border-zinc-800">
      <h3 className="text-lg font-semibold mb-4 text-white">How did this resonate with you?</h3>
      <div className="flex flex-wrap gap-3">
        {reactions.map((reaction) => (
          <button
            key={reaction.type}
            onClick={() => handleReaction(reaction.type)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-200 ${
              reaction.userReacted
                ? "bg-purple-600 border-purple-600 text-white"
                : "bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:border-zinc-600"
            }`}
          >
            {getReactionIcon(reaction.type)}
            <span className="text-sm font-medium">{getReactionLabel(reaction.type)}</span>
            <span className="text-sm">{reaction.count}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
