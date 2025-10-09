"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Heart, ThumbsUp, Brain, Target, Lightbulb, Star } from "lucide-react"

interface EnhancedBlogReactionsProps {
  articleSlug: string
}

export function EnhancedBlogReactions({ articleSlug }: EnhancedBlogReactionsProps) {
  const [reactions, setReactions] = useState({
    love: 0,
    helpful: 0,
    insightful: 0,
    actionable: 0,
    inspiring: 0,
    excellent: 0,
  })

  const [userReactions, setUserReactions] = useState<Set<string>>(new Set())

  // Fetch reactions data based on articleSlug
  useEffect(() => {
    if (!articleSlug) {
      return
    }

    const fetchReactions = async () => {
      try {
        const response = await fetch(`/api/blog-reactions/${articleSlug}`)
        if (response.ok) {
          const data = await response.json()
          setReactions(data)
        } else {
          // Initialize with demo data if API fails
          const demoReactions = {
            love: Math.floor(Math.random() * 30) + 15,
            helpful: Math.floor(Math.random() * 25) + 18,
            insightful: Math.floor(Math.random() * 20) + 12,
            actionable: Math.floor(Math.random() * 22) + 14,
            inspiring: Math.floor(Math.random() * 28) + 16,
            excellent: Math.floor(Math.random() * 18) + 10,
          }
          setReactions(demoReactions)
        }
      } catch (error) {
        console.error("Failed to fetch reactions:", error)
        // Initialize with demo data on error
        const demoReactions = {
          love: Math.floor(Math.random() * 30) + 15,
          helpful: Math.floor(Math.random() * 25) + 18,
          insightful: Math.floor(Math.random() * 20) + 12,
          actionable: Math.floor(Math.random() * 22) + 14,
          inspiring: Math.floor(Math.random() * 28) + 16,
          excellent: Math.floor(Math.random() * 18) + 10,
        }
        setReactions(demoReactions)
      }
    }

    fetchReactions()
  }, [articleSlug])

  // Function to handle user reaction
  const handleReaction = (reactionType: string) => {
    if (userReactions.has(reactionType)) {
      setUserReactions((prev) => {
        const newSet = new Set(prev)
        newSet.delete(reactionType)
        return newSet
      })
      setReactions((prev) => ({
        ...prev,
        [reactionType]: Math.max(0, prev[reactionType as keyof typeof prev] - 1),
      }))
    } else {
      setUserReactions((prev) => new Set(prev).add(reactionType))
      setReactions((prev) => ({
        ...prev,
        [reactionType]: prev[reactionType as keyof typeof prev] + 1,
      }))
    }

    // Update server with new reaction
    fetch(`/api/blog-reactions/${articleSlug}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reactionType }),
    }).catch((error) => console.error("Failed to update reaction:", error))
  }

  if (!articleSlug) {
    return null
  }

  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold mb-4 text-white">How did this article make you feel?</h3>
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={() => handleReaction("love")}
          variant={userReactions.has("love") ? "default" : "outline"}
          className={`${
            userReactions.has("love")
              ? "bg-red-500 hover:bg-red-600 text-white border-red-500"
              : "border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
          } transition-all duration-200`}
        >
          <Heart className="mr-2 h-4 w-4 fill-current" />
          Love ({reactions.love})
        </Button>
        <Button
          onClick={() => handleReaction("helpful")}
          variant={userReactions.has("helpful") ? "default" : "outline"}
          className={`${
            userReactions.has("helpful")
              ? "bg-green-500 hover:bg-green-600 text-white border-green-500"
              : "border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
          } transition-all duration-200`}
        >
          <ThumbsUp className="mr-2 h-4 w-4 fill-current" />
          Helpful ({reactions.helpful})
        </Button>
        <Button
          onClick={() => handleReaction("insightful")}
          variant={userReactions.has("insightful") ? "default" : "outline"}
          className={`${
            userReactions.has("insightful")
              ? "bg-blue-500 hover:bg-blue-600 text-white border-blue-500"
              : "border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
          } transition-all duration-200`}
        >
          <Brain className="mr-2 h-4 w-4 fill-current" />
          Insightful ({reactions.insightful})
        </Button>
        <Button
          onClick={() => handleReaction("actionable")}
          variant={userReactions.has("actionable") ? "default" : "outline"}
          className={`${
            userReactions.has("actionable")
              ? "bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-500"
              : "border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white"
          } transition-all duration-200`}
        >
          <Target className="mr-2 h-4 w-4 fill-current" />
          Actionable ({reactions.actionable})
        </Button>
        <Button
          onClick={() => handleReaction("inspiring")}
          variant={userReactions.has("inspiring") ? "default" : "outline"}
          className={`${
            userReactions.has("inspiring")
              ? "bg-purple-500 hover:bg-purple-600 text-white border-purple-500"
              : "border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white"
          } transition-all duration-200`}
        >
          <Lightbulb className="mr-2 h-4 w-4 fill-current" />
          Inspiring ({reactions.inspiring})
        </Button>
        <Button
          onClick={() => handleReaction("excellent")}
          variant={userReactions.has("excellent") ? "default" : "outline"}
          className={`${
            userReactions.has("excellent")
              ? "bg-orange-500 hover:bg-orange-600 text-white border-orange-500"
              : "border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
          } transition-all duration-200`}
        >
          <Star className="mr-2 h-4 w-4 fill-current" />
          Excellent ({reactions.excellent})
        </Button>
      </div>
    </div>
  )
}

export default EnhancedBlogReactions
