"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { MessageCircle, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"

interface Comment {
  id: string
  name: string
  email: string
  content: string
  timestamp: number
}

interface EnhancedNewsletterCommentsProps {
  articleSlug: string
}

export function EnhancedNewsletterComments({ articleSlug }: EnhancedNewsletterCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const savedComments = localStorage.getItem(`comments-${articleSlug}`)
    if (savedComments) {
      setComments(JSON.parse(savedComments))
    }
  }, [articleSlug])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !comment || isSubmitting) return

    setIsSubmitting(true)

    const newComment: Comment = {
      id: Date.now().toString(),
      name,
      email,
      content: comment,
      timestamp: Date.now(),
    }

    const updatedComments = [newComment, ...comments]
    setComments(updatedComments)
    localStorage.setItem(`comments-${articleSlug}`, JSON.stringify(updatedComments))

    // Reset form
    setName("")
    setEmail("")
    setComment("")
    setIsSubmitting(false)
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  return (
    <div className="border-t border-zinc-800 pt-10">
      <div className="flex items-center gap-3 mb-8">
        <MessageCircle className="w-6 h-6 text-purple-400" />
        <h2 className="text-2xl font-bold text-white">Comments ({comments.length})</h2>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-8">
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <Input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
          />
          <Input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
          />
        </div>

        <Textarea
          placeholder="Share your thoughts..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
          rows={4}
          className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 mb-4"
        />

        <Button type="submit" disabled={isSubmitting} className="bg-purple-600 hover:bg-purple-700">
          <Send className="w-4 h-4 mr-2" />
          {isSubmitting ? "Posting..." : "Post Comment"}
        </Button>
      </form>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-zinc-500 text-center py-8">No comments yet. Be the first to share your thoughts!</p>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-white">{c.name}</h3>
                  <p className="text-sm text-zinc-500">{formatDate(c.timestamp)}</p>
                </div>
              </div>
              <p className="text-zinc-300 leading-relaxed">{c.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export { EnhancedNewsletterComments as default }
