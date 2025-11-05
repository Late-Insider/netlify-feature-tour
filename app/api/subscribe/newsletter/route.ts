import { NextRequest, NextResponse } from "next/server"
import { addSubscriber, getSubscriberByEmail } from "@/lib/supabase"
import { createEmailTemplate, sendMicrosoftGraphEmail } from "@/lib/microsoft-graph"

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Site URL for links in emails (fallback to production domain)
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "") || "https://late.ltd"

const REQUIRED_GRAPH_KEYS = [
  "MICROSOFT_TENANT_ID",
  "MICROSOFT_CLIENT_ID",
  "MICROSOFT_CLIENT_SECRET",
  "MICROSOFT_SENDER_EMAIL",
]

function hasGraphConfig(): boolean {
  return REQUIRED_GRAPH_KEYS.every((k) => Boolean(process.env[k as keyof NodeJS.ProcessEnv]))
}

// Send a welcome email (single opt-in) with a working unsubscribe link.
async function sendWelcomeEmail(email: string, unsubscribeToken?: string | null) {
  if (!hasGraphConfig()) return { sent: false }

  const unsubscribeUrl = unsubscribeToken
    ? `${SITE_URL}/unsubscribe?t=${encodeURIComponent(unsubscribeToken)}`
    : `${SITE_URL}`

  const html = await createEmailTemplate(
    "Welcome to Late — Letters Worth Your Time",
    `
      <p>Scribbles inspired by Late Thoughts will reach your inbox weekly —
      thoughtful, mind-provoking and soul-soothing. Welcome to the inner circle.</p>

      <p style="margin-top:16px;">
        If this wasn’t you, you can unsubscribe any time:
        <br><a href="${unsubscribeUrl}">${unsubscribeUrl}</a>
      </p>
    `
  )

  const result = await sendMicrosoftGraphEmail({
    to: email,
    subject: "Welcome to Late",
    body: html,
  })

  if (!result.success) {
    console.warn(
      JSON.stringify({ level: "warn", scope: "newsletter-welcome", error: result.error })
    )
  }
  return { sent: result.success }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null)
    if (!body || typeof body.email !== "string") {
      return NextResponse.json({ ok: false, reason: "Email is required" }, { status: 400 })
    }

    const email = body.email.trim().toLowerCase()
    if (!EMAIL_PATTERN.test(email)) {
      return NextResponse.json({ ok: false, reason: "Please provide a valid email." }, { status: 422 })
    }

    // ✅ Single-opt-in: confirmed + active, and track origin
    const result = await addSubscriber({
      email,
      category: "newsletter",
      status: "confirmed",
      source: "newsletter_form",
    })

    if (result.disabled) {
      return NextResponse.json(
        { ok: false, reason: "Subscriptions are temporarily unavailable." },
        { status: 503 }
      )
    }

    // If Supabase errored with something other than "already exists", bubble up
    if (result.error && result.error !== "Subscriber already exists") {
      return NextResponse.json(
        { ok: false, reason: result.error ?? "Unable to save subscription." },
        { status: 400 }
      )
    }

    // Fetch the row to grab the unsubscribe token (backfilled/triggered in DB)
    const sub = await getSubscriberByEmail(email)
    const token = sub?.unsubscribe_token ?? null

    // Send welcome email (instead of confirmation)
    await sendWelcomeEmail(email, token)

    return NextResponse.json({ ok: true, alreadySubscribed: !!result.error })
  } catch (err) {
    console.error("Newsletter subscribe failed:", err)
    return NextResponse.json({ ok: false, reason: "internal_error" }, { status: 500 })
  }
}
