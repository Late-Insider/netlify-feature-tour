import { type NextRequest, NextResponse } from "next/server"
import { addSubscriber, createServiceRoleClient } from "@/lib/supabase"
import { createEmailTemplate, sendMicrosoftGraphEmail } from "@/lib/microsoft-graph"

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://late.ltd"

function graphReady() {
  return ["MICROSOFT_TENANT_ID","MICROSOFT_CLIENT_ID","MICROSOFT_CLIENT_SECRET","MICROSOFT_SENDER_EMAIL"]
    .every(k => !!process.env[k as keyof NodeJS.ProcessEnv])
}

async function sendAdmin(email: string) {
  if (!graphReady()) return
  const to = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.MICROSOFT_SENDER_EMAIL
  if (!to) return
  const html = await createEmailTemplate("New Newsletter Subscription", `<p>${email} just subscribed.</p>`)
  await sendMicrosoftGraphEmail({ to, subject: "Newsletter subscription", body: html }).catch(() => null)
}

async function sendWelcome(email: string, token: string) {
  if (!graphReady()) return
  const unsubscribeUrl = `${SITE_URL}/unsubscribe?token=${encodeURIComponent(token)}`
  const html = await createEmailTemplate(
    "Welcome to the Inner Circle",
    `
      <p>Thank you for subscribing to the LATE newsletter.</p>
      <p>You're now signed up to receive thought-provoking, soul-soothing essays weekly, directly in your inbox.</p>
      <p style="margin-top:16px">
        If you ever wish to unsubscribe, you can do so
        <a href="${unsubscribeUrl}">here</a>.
      </p>
      <p style="margin-top:24px">Stay Late.<br/>The best things are always worth the wait 😉</p>
      <p>– The LATE Team</p>
    `
  )
  await sendMicrosoftGraphEmail({ to: email, subject: "You’re in — LATE Letters", body: html }).catch(() => null)
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body?.email || typeof body.email !== "string") {
    return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 })
  }

  const email = body.email.trim().toLowerCase()
  if (!EMAIL.test(email)) {
    return NextResponse.json({ success: false, error: "Please provide a valid email." }, { status: 422 })
  }

  const source = typeof body.source === "string" ? body.source.trim() : "newsletter_form"

  // ensure a token on the row
  const client = createServiceRoleClient()
  const unsubscribe_token = crypto.randomUUID()

  // Insert (or detect duplicate) using your helper
  const res = await addSubscriber({
    email,
    category: "newsletter",
    status: "pending",
    source,
  })

  // If we just created it (or even if duplicate), make sure the token exists
  if (client) {
    await client
      .from("subscribers")
      .update({ unsubscribe_token })
      .eq("email", email)
      .eq("category", "newsletter")
  }

  // Send emails (welcome + admin). Even for duplicates we succeed.
  await Promise.all([sendWelcome(email, unsubscribe_token), sendAdmin(email)])

  return NextResponse.json({
  success: true,
  message: "Thanks for subscribing! We just sent you a confirmation email."
})
}
