"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { handleFormSubmission } from "@/actions/email-actions"

export default function EmailDebug() {
  const [email, setEmail] = useState("")
  const [formType, setFormType] = useState<
    "book" | "podcast" | "shop" | "waitlist" | "newsletter" | "auction-waitlist" | "contact"
  >("contact")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, `[${new Date().toISOString()}] ${message}`])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setResult(null)
    setLogs([])

    addLog(`Starting test for ${formType} form with email ${email}`)

    try {
      const formData = new FormData()
      formData.set("email", email)
      formData.set("form-name", formType)
      formData.set("_subject", `Test ${formType} submission`)

      // Add name and message for contact form
      if (formType === "contact") {
        formData.set("name", "Test User")
        formData.set(
          "message",
          "This is a test message to verify Microsoft Graph autoresponders and admin notifications are working.",
        )
      }

      addLog("Form data prepared, submitting...")
      const result = await handleFormSubmission(formData)
      addLog(`Submission result: ${JSON.stringify(result)}`)
      setResult(result)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      addLog(`Error: ${errorMessage}`)
      setResult({ success: false, message: errorMessage })
    } finally {
      setIsSubmitting(false)
      addLog("Test completed")
    }
  }

  return (
    <div className="p-6 bg-zinc-800 rounded-lg max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4 text-white">Microsoft Graph Email Test</h2>
      <p className="text-zinc-300 mb-4">Test admin notifications (Formspree) + autoresponders (Microsoft Graph).</p>

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
            Form Type
          </label>
          <select
            id="formType"
            value={formType}
            onChange={(e) => setFormType(e.target.value as any)}
            className="w-full px-4 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="contact">Contact Form</option>
            <option value="newsletter">Newsletter</option>
            <option value="podcast">Podcast</option>
            <option value="shop">Shop</option>
            <option value="waitlist">Waitlist</option>
            <option value="auction-waitlist">Auction Waitlist</option>
          </select>
        </div>

        <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white" disabled={isSubmitting}>
          {isSubmitting ? "Testing Microsoft Graph..." : "Test Email System"}
        </Button>
      </form>

      {logs.length > 0 && (
        <div className="mt-4 p-3 rounded bg-black/30 max-h-40 overflow-y-auto">
          <p className="text-sm font-medium mb-1 text-white">Debug Logs:</p>
          {logs.map((log, i) => (
            <p key={i} className="text-xs text-zinc-400 whitespace-pre-wrap">
              {log}
            </p>
          ))}
        </div>
      )}

      {result && (
        <div className={`mt-4 p-3 rounded ${result.success ? "bg-green-800/30" : "bg-red-800/30"}`}>
          <p className="text-sm font-medium mb-1">{result.success ? "Success! 🎉" : "Error ❌"}</p>
          <p className="text-xs mb-2">{result.message}</p>

          {result.success && result.emailSent && (
            <div className="mt-2 p-2 bg-green-900/30 rounded text-xs">
              <p className="text-green-400 font-medium">✅ Both systems working:</p>
              <p className="text-green-300">• Admin notification sent via Formspree</p>
              <p className="text-green-300">• Autoresponder sent via Microsoft Graph</p>
            </div>
          )}
        </div>
      )}

      <div className="mt-6 text-xs text-zinc-400">
        <p className="font-medium mb-1">🚀 New System Status:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>✅ Admin notifications: Formspree (working)</li>
          <li>🆕 Autoresponders: Microsoft Graph API</li>
          <li>📧 Professional email templates with LATE branding</li>
          <li>🔒 Secure authentication via Azure AD</li>
          <li>📊 Detailed logging for troubleshooting</li>
        </ul>
      </div>
    </div>
  )
}
