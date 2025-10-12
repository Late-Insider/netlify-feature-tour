"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { MessageCircle, Send, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"

interface Comment {
  id: string
  name: string
  content: string
  timestamp: string
}

interface BlogCommentsProps {
  blogId: number
}

export default function BlogComments({ blogId }: BlogCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [userName, setUserName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load comments from localStorage on component mount
  useEffect(() => {
    const savedComments = localStorage.getItem(`blog-comments-${blogId}`)
    if (savedComments) {
      setComments(JSON.parse(savedComments))
    }

    // Load saved user name
    const savedUserName = localStorage.getItem("user-name")
    if (savedUserName) {
      setUserName(savedUserName)
    }
  }, [blogId])

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !userName.trim()) return

    setIsSubmitting(true)

    const comment: Comment = {
      id: Date.now().toString(),
      name: userName.trim(),
      content: newComment.trim(),
      timestamp: new Date().toISOString(),
    }

    const updatedComments = [comment, ...comments]
    setComments(updatedComments)
    localStorage.setItem(`blog-comments-${blogId}`, JSON.stringify(updatedComments))
    localStorage.setItem("user-name", userName.trim())

    setNewComment("")
    setIsSubmitting(false)
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="mt-12 pt-8 border-t border-gray-200 dark:border-zinc-800">
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle className="w-5 h-5 text-purple-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Comments ({comments.length})</h3>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmitComment} className="mb-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="text"
            placeholder="Your name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
            className="bg-gray-50 dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-zinc-400"
          />
        </div>
        <Textarea
          placeholder="Share your thoughts on this post..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          required
          rows={3}
          className="bg-gray-50 dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-zinc-400"
        />
        <Button
          type="submit"
          disabled={isSubmitting || !newComment.trim() || !userName.trim()}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          <Send className="w-4 h-4 mr-2" />
          {isSubmitting ? "Posting..." : "Post Comment"}
        </Button>
      </form>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-gray-500 dark:text-zinc-400 text-center py-8">
            Be the first to share your thoughts on this post.
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-gray-50 dark:bg-zinc-800/50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="bg-purple-600 rounded-full p-2 flex-shrink-0">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-gray-900 dark:text-white">{comment.name}</span>
                    <span className="text-sm text-gray-500 dark:text-zinc-500">
                      {formatTimestamp(comment.timestamp)}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-zinc-300 leading-relaxed">{comment.content}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
