// app/api/subscribe/auction-creator/route.ts
import { NextRequest, NextResponse } from "next/server"
import { createServiceRoleClient } from "@/lib/supabase"
import { createEmailTemplate, sendMicrosoftGraphEmail } from "@/lib/microsoft-graph"

type TimeSlot = "morning" | "afternoon" | "evening" | "weekend"

function hasGraph() {
  const req = ["MICROSOFT_TENANT_ID", "MICROSOFT_CLIENT_ID", "MICROSOFT_CLIENT_SECRET", "MICROSOFT_SENDER_EMAIL"]
  return req.every((k) => !!process.env[k as keyof NodeJS.ProcessEnv])
}

async function sendCreatorConfirm(to: string, name: string) {
  if (!hasGraph()) return { sent: false }
  const html = await createEmailTemplate(
    "We received your creator application",
    `<p>Hi ${name || "there"},</p>
     <p>Thanks for applying to join our auction as a creator. Our team will review your submission and reach out to schedule next steps.</p>
     <p>Stay Late,<br/>The LATE Team</p>`
  )
  const res = await sendMicrosoftGraphEmail({ to, subject: "Thanks — we got your creator application", body: html })
  return { sent: !!res.success }
}

async function notifyAdminCreator(payload: {
  name: string
  email: string
  preferredContactTimes: string[]
  message: string
  source: string
}) {
  if (!hasGraph()) return { sent: false }
  const to = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.MICROSOFT_SENDER_EMAIL
  if (!to) return { sent: false }

  const html = await createEmailTemplate(
    "New Creator Application",
    `<p><strong>Name:</strong> ${payload.name}</p>
     <p><strong>Email:</strong> ${payload.email}</p>
     <p><strong>Preferred contact times:</strong> ${payload.preferredContactTimes.join(", ") || "—"}</p>
     <p><strong>Message:</strong><br/>${payload.message || "—"}</p>
     <p><strong>Source:</strong> ${payload.source}</p>`
  )
  const res = await sendMicrosoftGraphEmail({ to, subject: "New Creator Application", body: html })
  return { sent: !!res.success }
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ success: false, error: "Invalid payload" }, { status: 400 })

  const name = String(body.name ?? "").trim()
  const email = String(body.email ?? "").trim().toLowerCase()
  const preferredContactTimes = Array.isArray(body.preferredContactTimes) ? (body.preferredContactTimes as TimeSlot[]) : []
  const message = String(body.message ?? "").trim()
  const source = String(body.source ?? "auction_creator_modal")

  if (!name || !email || !email.includes("@")) {
    return NextResponse.json({ success: false, error: "Name and valid email are required" }, { status: 422 })
  }

  const client = createServiceRoleClient()
  if (!client) return NextResponse.json({ success: false, error: "Database is not configured" }, { status: 503 })

  // 1) Store the application
  const { error: appErr } = await client.from("creator_applications").insert({
    name,
    email,
    artwork_description: message,
    preferred_contact_times: preferredContactTimes, // text[]
    source,
    status: "pending",
    submitted_at: new Date().toISOString(),
  })

  if (appErr) {
    console.error(JSON.stringify({ level: "error", scope: "supabase", action: "insert_creator_application", code: appErr.code, details: appErr.details }))
    return NextResponse.json(
      { success: false, error: "Applications are temporarily unavailable. Please try again soon." },
      { status: 503 }
    )
  }

  // 2) Ensure subscriber row exists for this list
  const unsubscribe_token = crypto.randomUUID()
  await client
    .from("subscribers")
    .upsert(
      {
        email,
        category: "auction-creator",
        status: "confirmed",
        is_active: true,
        source,
        unsubscribe_token,
        created_at: new Date().toISOString(),
      },
      { onConflict: "email,category" }
    )

  // 3) Emails (best-effort, non-blocking)
  const [confirmRes, adminRes] = await Promise.all([
    sendCreatorConfirm(email, name).catch(() => ({ sent: false })),
    notifyAdminCreator({ name, email, preferredContactTimes, message, source }).catch(() => ({ sent: false })),
  ])

  return NextResponse.json({
    success: true,
    message: "Application submitted! We’ll be in touch soon.",
    emailSent: !!confirmRes.sent,
    adminNotified: !!adminRes.sent,
  })
}
