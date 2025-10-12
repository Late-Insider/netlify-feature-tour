"use client"

import { useState } from "react"

export function EmailTest() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleTest = async () => {
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/test-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({
        success: false,
        message: "Failed to send test email: " + (error as Error).message,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto my-12 p-8 bg-zinc-900 border border-zinc-800 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Test Email System</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full px-4 py-2 bg-black border border-zinc-800 rounded-lg focus:outline-none focus:border-purple-500"
          />
        </div>
        <button
          onClick={handleTest}
          disabled={loading || !email}
          className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Test Email"}
        </button>
        {result && (
          <div
            className={`p-4 rounded-lg ${
              result.success ? "bg-green-900/20 border border-green-500" : "bg-red-900/20 border border-red-500"
            }`}
          >
            <p className={result.success ? "text-green-400" : "text-red-400"}>{result.message}</p>
          </div>
        )}
      </div>
    </div>
  )
}
