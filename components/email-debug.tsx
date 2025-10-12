"use client"

import { useEffect, useState } from "react"

interface DebugInfo {
  hasResendKey: boolean
  hasMicrosoftKeys: boolean
  resendKeyPrefix?: string
  microsoftClientIdPrefix?: string
  recommendedProvider: string
  emailsToTest: string[]
}

export function EmailDebug() {
  const [debug, setDebug] = useState<DebugInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/test-email?debug=true")
      .then((res) => res.json())
      .then(setDebug)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="text-center">Loading debug info...</div>
  }

  if (!debug) {
    return <div className="text-center text-red-400">Failed to load debug info</div>
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-lg">
        <h3 className="text-xl font-bold mb-4">Email Provider Configuration</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span>Resend API Key:</span>
            <span className={debug.hasResendKey ? "text-green-400" : "text-red-400"}>
              {debug.hasResendKey ? "✓ Configured" : "✗ Missing"}
            </span>
          </div>
          {debug.resendKeyPrefix && <div className="text-sm text-zinc-400">Key prefix: {debug.resendKeyPrefix}...</div>}
          <div className="flex items-center justify-between">
            <span>Microsoft Graph Keys:</span>
            <span className={debug.hasMicrosoftKeys ? "text-green-400" : "text-red-400"}>
              {debug.hasMicrosoftKeys ? "✓ Configured" : "✗ Missing"}
            </span>
          </div>
          {debug.microsoftClientIdPrefix && (
            <div className="text-sm text-zinc-400">Client ID prefix: {debug.microsoftClientIdPrefix}...</div>
          )}
        </div>
      </div>

      <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-lg">
        <h3 className="text-xl font-bold mb-4">Recommended Provider</h3>
        <p className="text-lg text-purple-400">{debug.recommendedProvider}</p>
      </div>

      <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-lg">
        <h3 className="text-xl font-bold mb-4">Test Email Addresses</h3>
        <ul className="space-y-2">
          {debug.emailsToTest.map((email, i) => (
            <li key={i} className="text-zinc-400">
              • {email}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
