"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { handleFormSubmission } from "@/actions/email-actions"

export default function EmailTest() {
  const [email, setEmail] = useState("")
  const [formType, setFormType] = useState<"book" | "podcast" | "shop" | "waitlist" | "newsletter" | "auction">(
    "newsletter",
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setResult(null)

    try {
      const formData = new FormData()
      formData.set("email", email)
      formData.set("form-name", formType)
      formData.set("_subject", `Test ${formType} email`)

      const result = await handleFormSubmission(formData)
      setResult(result)
    } catch (error) {
      setResult({ success: false, message: String(error) })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-6 bg-zinc-800 rounded-lg max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4 text-white">Email Test Tool</h2>
      <p className="text-zinc-300 mb-4">Use this tool to test the email functionality.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-1">
            Email Address
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-zinc-700 border-zinc-600 text-white placeholder:text-zinc-400"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label htmlFor="formType" className="block text-sm font-medium text-zinc-300 mb-1">
            Email Template
          </label>
          <select
            id="formType"
            value={formType}
            onChange={(e) => setFormType(e.target.value as any)}
            className="w-full px-4 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="newsletter">Newsletter</option>
            <option value="book">Book Pre-order</option>
            <option value="podcast">Podcast</option>
            <option value="shop">Shop</option>
            <option value="waitlist">Waitlist</option>
            <option value="auction">Auction</option>
          </select>
        </div>

        <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Send Test Email"}
        </Button>
      </form>

      {result && (
        <div className={`mt-4 p-3 rounded ${result.success ? "bg-green-800/30" : "bg-red-800/30"}`}>
          <p className="text-sm font-medium mb-1">{result.success ? "Success" : "Error"}</p>
          <p className="text-xs">
            {result.message || (result.success ? "Email sent successfully" : "Failed to send email")}
          </p>
          {result.success && !result.emailSent && (
            <p className="text-xs mt-2 text-yellow-400">
              Form was submitted but email failed to send. Please check your Resend API key configuration.
            </p>
          )}
        </div>
      )}

      <div className="mt-6 text-xs text-zinc-400">
        <p className="font-medium mb-1">Troubleshooting:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Make sure the RESEND_API_KEY environment variable is set correctly</li>
          <li>Check your spam/junk folder for the test emails</li>
          <li>Verify that the "from" email domain is properly configured in Resend</li>
          <li>Check server logs for any errors during email sending</li>
        </ul>
      </div>
    </div>
  )
}
