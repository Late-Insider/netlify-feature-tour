"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Check, Mail } from "lucide-react"
import { handleNewsletterSubscription } from "@/actions/email-actions"

export default function NewsletterSubscribeForm() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)

    try {
      const result = await handleNewsletterSubscription(formData)

      if (result.success) {
        setIsSubmitted(true)
        // Reset form after 5 seconds
        setTimeout(() => {
          setIsSubmitted(false)
        }, 5000)
      } else {
        setError(result.message || "Something went wrong. Please try again.")
      }
    } catch (err) {
      setError("Failed to subscribe. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="text-center py-8 animate-fade-in">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-purple-600 rounded-full p-3 shadow-lg shadow-purple-500/50">
            <Check className="w-8 h-8 text-white" />
          </div>
        </div>
        <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Welcome to the Community!</h3>
        <p className="text-gray-600 dark:text-zinc-400 mb-4">
          Check your inbox for a confirmation email. You'll receive our next newsletter soon.
        </p>
        <Button
          onClick={() => setIsSubmitted(false)}
          variant="outline"
          className="border-purple-300 dark:border-purple-700 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20"
        >
          Subscribe Another Email
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          type="text"
          name="name"
          placeholder="Your Name (optional)"
          className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-zinc-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      <div>
        <Input
          type="email"
          name="email"
          placeholder="Your Email Address"
          required
          className="bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-zinc-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Subscribing...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <Mail className="w-5 h-5" />
            Subscribe to Newsletter
          </span>
        )}
      </Button>

      <p className="text-xs text-center text-gray-500 dark:text-zinc-500">
        We respect your privacy. Unsubscribe at any time.
      </p>
    </form>
  )
}
