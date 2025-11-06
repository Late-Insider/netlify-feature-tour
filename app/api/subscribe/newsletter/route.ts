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
  const html = await createEmailTemplate(
    "New Newsletter Subscription",
    `<p>${email} just subscribed to the LATE newsletter.</p>`
  )
  await sendMicrosoftGraphEmail({ to, subject: "Newsletter subscription", body: html })
}

async function sendConfirm(email: string, unsubscribeToken?: string) {
  if (!hasGraph()) return

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://late.ltd"
  const unsubscribeUrl = `${baseUrl}/unsubscribe?token=${encodeURIComponent(unsubscribeToken || "")}`

  const html = await createEmailTemplate(
    "Welcome to the Inner Circle",
    `
      <p>Thank you for subscribing to the <strong>LATE newsletter</strong>.</p>
      <p>You're now signed up to receive thought-provoking, soul-soothing essays weekly, directly in your inbox.</p>
      <p>If you ever change your mind, you can
        <a href="${unsubscribeUrl}" target="_blank" style="color:#7C3AED;text-decoration:underline;">unsubscribe here</a>.
      </p>
      <br/>
      <p>Stay Late.<br/>The best things are always worth the wait 😉</p>
      <p>– The LATE Team</p>
    `
  )

  await sendMicrosoftGraphEmail({
    to: email,
    subject: "Welcome to the Inner Circle",
    body: html,
  })
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

  // Save (or detect existing) subscriber
  const result = await addSubscriber({
    email,
    category: "newsletter",
    status: "pending",
    source,
  })

  if (result.disabled) {
    return NextResponse.json(
      { success: false, error: "Subscriptions are temporarily unavailable." },
      { status: 503 }
    )
  }

  // Pull unsubscribe token if present so the email link works
  const token =
    (result?.data as { unsubscribe_token?: string } | null)?.unsubscribe_token ?? undefined

  if (result.error && !result.isNew) {
    // Already exists → still send welcome + notify admin, but don’t error
    await Promise.all([sendConfirm(email, token), notifyAdmin(email)]).catch(() => null)
    return NextResponse.json({ success: true, already: true })
  }

  // New subscriber → send email + notify admin
  await Promise.all([sendConfirm(email, token), notifyAdmin(email)]).catch(() => null)
  return NextResponse.json({ success: true })
}
