"use client"

import { useState } from "react"

export default function NewsletterSubscribeForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccessMessage("")

    const fd = new FormData(e.currentTarget)
    const email = String(fd.get("email") ?? "").trim()

    try {
      if (!email) {
        setError("Please enter your email address.")
        return
      }

      const res = await fetch("/api/subscribe/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "newsletter_form" }),
      })

      const payload = await res.json().catch(() => ({} as any))

      if (!res.ok || payload?.success !== true) {
        setError(payload?.error || "Subscription failed. Please try again.")
        return
      }

      e.currentTarget.reset()
      setSuccessMessage("Thanks for subscribing! We just sent you an email confirmation.")
      setTimeout(() => setSuccessMessage(""), 5000)

    } catch {
      setError("Failed to subscribe. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          className="w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-600 outline-none"
          disabled={isLoading}
        />
      </div>

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      {successMessage && (
        <p className="text-green-600 text-sm">{successMessage}</p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
      >
        {isLoading ? "Submitting..." : "Subscribe"}
      </button>
    </form>
  )
}
