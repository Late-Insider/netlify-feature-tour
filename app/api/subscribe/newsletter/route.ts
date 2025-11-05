import { type NextRequest, NextResponse } from "next/server"
import { addSubscriber } from "@/lib/supabase"
import { createEmailTemplate, sendMicrosoftGraphEmail } from "@/lib/microsoft-graph"

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function hasGraph() {
  const req = ["MICROSOFT_TENANT_ID", "MICROSOFT_CLIENT_ID", "MICROSOFT_CLIENT_SECRET", "MICROSOFT_SENDER_EMAIL"]
  return req.every((k) => !!process.env[k as keyof NodeJS.ProcessEnv])
}

async function notifyAdmin(email: string) {
  const to = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.MICROSOFT_SENDER_EMAIL
  if (!hasGraph() || !to) return
  const html = await createEmailTemplate("New Newsletter Subscription", `<p>${email} just subscribed.</p>`)
  await sendMicrosoftGraphEmail({ to, subject: "Newsletter subscription", body: html })
}

async function sendConfirm(email: string) {
  if (!hasGraph()) return
  const html = await createEmailTemplate(
    "Welcome to LATE Letters",
    `<p>Thanks for subscribing. Scribbles inspired by Late Thoughts will reach you weekly. Welcome to the inner circle!</p>`
  )
  await sendMicrosoftGraphEmail({ to: email, subject: "You’re in — LATE Letters", body: html })
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)
  if (!body || typeof body.email !== "string") {
    return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 })
  }

  const email = body.email.trim().toLowerCase()
  const source = typeof body.source === "string" ? body.source.trim() : "newsletter_form"
  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ success: false, error: "Please provide a valid email." }, { status: 422 })
  }

  const result = await addSubscriber({ email, category: "newsletter", status: "pending", source })

  if (result.disabled) {
    return NextResponse.json({ success: false, error: "Subscriptions are temporarily unavailable." }, { status: 503 })
  }

  if (result.error && !result.isNew) {
    // Already exists → still send emails and return success
    await Promise.all([sendConfirm(email), notifyAdmin(email)]).catch(() => null)
    return NextResponse.json({ success: true, already: true })
  }

  // New subscriber → send emails
  await Promise.all([sendConfirm(email), notifyAdmin(email)]).catch(() => null)
  return NextResponse.json({ success: true })
}
