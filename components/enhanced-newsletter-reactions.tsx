"use client"

import { useState, useEffect } from "react"
import { Heart, Lightbulb, Sparkles, ThumbsUp } from "lucide-react"
import { EmailGateModal } from "./email-gate-modal"

interface Reaction {
  type: string
  count: number
  userReacted: boolean
}

interface EnhancedNewsletterReactionsProps {
  articleSlug: string
}

export function EnhancedNewsletterReactions({ articleSlug }: EnhancedNewsletterReactionsProps) {
  const [reactions, setReactions] = useState<Reaction[]>([
    { type: "love", count: 0, userReacted: false },
    { type: "insightful", count: 0, userReacted: false },
    { type: "inspiring", count: 0, userReacted: false },
    { type: "helpful", count: 0, userReacted: false },
  ])
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [pendingReaction, setPendingReaction] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    // Load reactions from localStorage
    const savedReactions = localStorage.getItem(`reactions-${articleSlug}`)
    const savedEmail = localStorage.getItem("user-email")

    if (savedEmail) {
      setUserEmail(savedEmail)
    }

    if (savedReactions) {
      setReactions(JSON.parse(savedReactions))
    }
  }, [articleSlug])

  const handleReactionClick = (type: string) => {
    const reaction = reactions.find((r) => r.type === type)

    if (reaction?.userReacted) {
      // Remove reaction
      handleRemoveReaction(type)
    } else if (userEmail) {
      // Add reaction directly
      handleAddReaction(type)
    } else {
      // Show email modal
      setPendingReaction(type)
      setShowEmailModal(true)
    }
  }

  const handleEmailSubmit = (email: string) => {
    setUserEmail(email)
    localStorage.setItem("user-email", email)

    if (pendingReaction) {
      handleAddReaction(pendingReaction)
      setPendingReaction(null)
    }
  }

  const handleAddReaction = (type: string) => {
    const updatedReactions = reactions.map((r) =>
      r.type === type ? { ...r, count: r.count + 1, userReacted: true } : r,
    )
    setReactions(updatedReactions)
    localStorage.setItem(`reactions-${articleSlug}`, JSON.stringify(updatedReactions))
  }

  const handleRemoveReaction = (type: string) => {
    const updatedReactions = reactions.map((r) =>
      r.type === type ? { ...r, count: Math.max(0, r.count - 1), userReacted: false } : r,
    )
    setReactions(updatedReactions)
    localStorage.setItem(`reactions-${articleSlug}`, JSON.stringify(updatedReactions))
  }

  const reactionConfig = [
    { type: "love", icon: Heart, label: "Love", color: "text-red-500" },
    { type: "insightful", icon: Lightbulb, label: "Insightful", color: "text-yellow-500" },
    { type: "inspiring", icon: Sparkles, label: "Inspiring", color: "text-purple-500" },
    { type: "helpful", icon: ThumbsUp, label: "Helpful", color: "text-blue-500" },
  ]

  return (
    <>
      <div className="flex flex-wrap gap-3">
        {reactionConfig.map(({ type, icon: Icon, label, color }) => {
          const reaction = reactions.find((r) => r.type === type)
          return (
            <button
              key={type}
              onClick={() => handleReactionClick(type)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full border transition-all
                ${
                  reaction?.userReacted
                    ? `bg-zinc-800 border-zinc-700 ${color}`
                    : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-800"
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{label}</span>
              {reaction && reaction.count > 0 && <span className="ml-1 text-sm font-bold">{reaction.count}</span>}
            </button>
          )
        })}
      </div>

      <EmailGateModal
        isOpen={showEmailModal}
        onClose={() => {
          setShowEmailModal(false)
          setPendingReaction(null)
        }}
        onSubmit={handleEmailSubmit}
        reactionType={pendingReaction || "love"}
      />
    </>
  )
}

export { EnhancedNewsletterReactions as default }
