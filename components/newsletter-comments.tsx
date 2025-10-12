"use client"

import type React from "react"

import { useState } from "react"

interface Comment {
  id: number
  author: string
  content: string
  date: string
}

export function NewsletterComments() {
  const [comments] = useState<Comment[]>([
    {
      id: 1,
      author: "Sarah M.",
      content: "This really resonated with me. Thank you for sharing!",
      date: "2 days ago",
    },
    {
      id: 2,
      author: "John D.",
      content: "Excellent insights. Looking forward to implementing these ideas.",
      date: "3 days ago",
    },
  ])

  const [newComment, setNewComment] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle comment submission
    setNewComment("")
  }

  return (
    <div className="mt-16 border-t border-zinc-800 pt-8">
      <h3 className="text-2xl font-bold mb-6">Comments</h3>

      <form onSubmit={handleSubmit} className="mb-8">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Share your thoughts..."
          className="w-full px-4 py-3 bg-black border border-zinc-800 rounded-lg focus:outline-none focus:border-purple-500 min-h-[100px]"
        />
        <button
          type="submit"
          className="mt-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold hover:opacity-90 transition-opacity"
        >
          Post Comment
        </button>
      </form>

      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <div className="flex items-start justify-between mb-2">
              <span className="font-semibold">{comment.author}</span>
              <span className="text-xs text-zinc-500">{comment.date}</span>
            </div>
            <p className="text-zinc-400">{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
