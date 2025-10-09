"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface EmailGateModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (email: string) => void
  reactionType: string
}

export function EmailGateModal({ isOpen, onClose, onSubmit, reactionType }: EmailGateModalProps) {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || isSubmitting) return

    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate submission
    onSubmit(email)
    setIsSubmitting(false)
    setEmail("")
    onClose()
  }

  const reactionEmojis: Record<string, string> = {
    love: "❤️",
    insightful: "💡",
    inspiring: "✨",
    helpful: "👍",
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-zinc-900 border-zinc-800 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            {reactionEmojis[reactionType]} React to this article
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Enter your email to share your reaction and stay updated with our latest insights.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
              autoFocus
            />
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={isSubmitting} className="flex-1 bg-purple-600 hover:bg-purple-700">
              {isSubmitting ? "Submitting..." : "Submit Reaction"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-zinc-700 hover:bg-zinc-800 bg-transparent"
            >
              Cancel
            </Button>
          </div>

          <p className="text-xs text-zinc-500 text-center">
            We respect your privacy. Your email will only be used to send you valuable content.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  )
}
