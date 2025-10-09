"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { MessageCircle, Send, User, Calendar, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { handleFormSubmission } from "@/actions/email-actions"

interface Comment {
  id: string
  name: string
  email: string
  comment: string
  timestamp: string
  isApproved: boolean
}

interface BlogCommentsProps {
  blogId: number
  blogTitle: string
}

function EnhancedBlogComments({ blogId, blogTitle }: BlogCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [userName, setUserName] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [hasProvidedInfo, setHasProvidedInfo] = useState(false)

  // Load comments and user info from localStorage on component mount
  useEffect(() => {
    const savedComments = localStorage.getItem(`blog-comments-${blogId}`)
    if (savedComments) {
      setComments(JSON.parse(savedComments))
    }

    // Check if user has already provided info
    const savedEmail = localStorage.getItem("user-email")
    const savedName = localStorage.getItem("user-name")
    if (savedEmail && savedName) {
      setHasProvidedInfo(true)
      setUserEmail(savedEmail)
      setUserName(savedName)
    }
  }, [blogId])

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !userName.trim() || !userEmail.trim()) return

    setIsSubmitting(true)

    try {
      // Create new comment
      const comment: Comment = {
        id: Date.now().toString(),
        name: userName.trim(),
        email: userEmail.trim(),
        comment: newComment.trim(),
        timestamp: new Date().toISOString(),
        isApproved: false, // Comments need approval
      }

      // Submit to admin notification system with autoresponder
      const formData = new FormData()
      formData.set("name", userName.trim())
      formData.set("email", userEmail.trim())
      formData.set("comment", newComment.trim())
      formData.set("blog_title", blogTitle)
      formData.set("blog_id", blogId.toString())
      formData.set("form-name", "blog-comment")
      formData.set("_subject", `New Comment on Blog Post: ${blogTitle}`)

      const result = await handleFormSubmission(formData)

      if (result.success) {
        // Save user info for future comments
        localStorage.setItem("user-name", userName.trim())
        localStorage.setItem("user-email", userEmail.trim())
        setHasProvidedInfo(true)

        // Add comment to local storage (pending approval)
        const updatedComments = [...comments, comment]
        setComments(updatedComments)
        localStorage.setItem(`blog-comments-${blogId}`, JSON.stringify(updatedComments))

        // Reset form
        setNewComment("")
        setSubmitSuccess(true)

        // Hide success message after 3 seconds
        setTimeout(() => setSubmitSuccess(false), 3000)
      }
    } catch (error) {
      console.error("Error submitting comment:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const approvedComments = comments.filter((comment) => comment.isApproved)

  return (
    <div className="mt-12 pt-8 border-t border-gray-200 dark:border-zinc-800">
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle className="w-6 h-6 text-purple-400" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Comments ({approvedComments.length})</h3>
      </div>

      {submitSuccess && (
        <div className="mb-6 bg-green-100 dark:bg-green-800/30 p-4 rounded-lg text-center animate-fade-in">
          <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
            <Check className="w-5 h-5" />
            <div>
              <p className="font-medium">Thank you for your comment!</p>
              <p className="text-sm">Your comment is pending approval and you'll receive a thank you email shortly.</p>
            </div>
          </div>
        </div>
      )}

      {/* Comment Form */}
      <form onSubmit={handleSubmitComment} className="mb-8 space-y-4">
        <div className="bg-gray-50 dark:bg-zinc-900 rounded-lg p-6 border border-gray-200 dark:border-zinc-800">
          <h4 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Join the Discussion</h4>

          {!hasProvidedInfo && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Input
                type="text"
                placeholder="Your name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
                className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-zinc-400"
              />
              <Input
                type="email"
                placeholder="Your email address"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                required
                className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-zinc-400"
              />
            </div>
          )}

          <Textarea
            placeholder="Share your thoughts on this article..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            required
            rows={4}
            className="mb-4 bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-zinc-400 resize-none"
          />

          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500 dark:text-zinc-500">
              Comments are moderated and you'll receive a thank you email after posting.
            </p>
            <Button
              type="submit"
              disabled={isSubmitting || !newComment.trim() || !userName.trim() || !userEmail.trim()}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Posting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Post Comment
                </>
              )}
            </Button>
          </div>
        </div>
      </form>

      {/* Comments List */}
      {approvedComments.length > 0 ? (
        <div className="space-y-6">
          {approvedComments.map((comment) => (
            <div
              key={comment.id}
              className="bg-gray-50 dark:bg-zinc-900 rounded-lg p-6 border border-gray-200 dark:border-zinc-800"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h5 className="font-medium text-gray-900 dark:text-white">{comment.name}</h5>
                    <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-zinc-500">
                      <Calendar className="w-3 h-3" />
                      {formatDate(comment.timestamp)}
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-zinc-300 leading-relaxed">{comment.comment}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <MessageCircle className="w-12 h-12 text-gray-400 dark:text-zinc-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-zinc-500">No comments yet. Be the first to share your thoughts!</p>
        </div>
      )}
    </div>
  )
}

export { EnhancedBlogComments }
export default EnhancedBlogComments
