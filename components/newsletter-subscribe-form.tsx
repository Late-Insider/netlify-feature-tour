"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Check, Mail } from "lucide-react"

const ERROR_MESSAGES: Record<string, string> = {
  supabase_env_missing: "Service is temporarily unavailable. Please try again.",
  invalid_input: "Please check your input.",
  supabase_error: "We couldn’t save your request. Please try again.",
}

export default function NewsletterSubscribeForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccessMessage("")

    const formData = new FormData(e.currentTarget)
    const email = String(formData.get("email") ?? "").trim()

    try {
      if (!email) {
        setError("Please enter your email address.")
        return
      }

      const response = await fetch("/api/subscribe/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          source: "newsletter_form",
        }),
      })

      const payload = await response.json().catch(() => ({ ok: false }))

      if (!response.ok || !payload.ok) {
        const reason: string | undefined = payload?.reason
        setError(reason && ERROR_MESSAGES[reason] ? ERROR_MESSAGES[reason] : "We couldn’t save your request. Please try again.")
        return
      }

      e.currentTarget.reset()
      setSuccessMessage(
        payload.alreadySubscribed
          ? "You're already on the list. We'll keep you posted."
          : "Check your inbox to confirm your subscription.",
      )
      setTimeout(() => setSuccessMessage(""), 5000)
    } catch (err) {
      setError("We couldn’t save your request. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {successMessage && (
        <div className="flex items-start gap-3 rounded-lg border border-purple-200 bg-purple-50 px-4 py-3 text-purple-700 dark:border-purple-800 dark:bg-purple-900/30 dark:text-purple-200">
          <Check className="mt-0.5 h-5 w-5" />
          <div>
            <p className="font-semibold">Subscribed!</p>
            <p className="text-sm">{successMessage}</p>
          </div>
        </div>
      )}

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
