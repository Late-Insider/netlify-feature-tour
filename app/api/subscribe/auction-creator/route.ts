// app/api/subscribe/auction-creator/route.ts
import { NextRequest, NextResponse } from "next/server"
import { randomUUID } from "crypto"
import { createServiceRoleClient } from "@/lib/supabase"
import { createEmailTemplate, sendMicrosoftGraphEmail } from "@/lib/microsoft-graph"

type TimeSlot = "morning" | "afternoon" | "evening" | "weekend"

function hasGraph() {
  const req = ["MICROSOFT_TENANT_ID", "MICROSOFT_CLIENT_ID", "MICROSOFT_CLIENT_SECRET", "MICROSOFT_SENDER_EMAIL"]
  return req.every((k) => !!process.env[k as keyof NodeJS.ProcessEnv])
}

async function notifyAdmin(name: string, email: string, slots: string[], message: string) {
  const to = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.MICROSOFT_SENDER_EMAIL
  if (!hasGraph() || !to) return

  const html = await createEmailTemplate(
    "New Creator Application",
    `
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Preferred Contact Times:</strong> ${slots.join(", ") || "—"}</p>
      <p><strong>Artwork Description:</strong></p>
      <p>${message || "—"}</p>
    `,
  )

  await sendMicrosoftGraphEmail({ to, subject: "Creator application received", body: html })
}

async function confirmApplicant(email: string) {
  if (!hasGraph()) return
  const html = await createEmailTemplate(
    "Thanks for applying — LATE Auction",
    `
      <p>Thanks for your application. Our team will review your submission and get back to you soon.</p>
      <p>We appreciate your time and interest in joining our auctions.</p>
    `,
  )
  await sendMicrosoftGraphEmail({ to: email, subject: "We received your application", body: html })
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body) {
    return NextResponse.json({ success: false, error: "Invalid payload" }, { status: 400 })
  }

  const name = String(body.name ?? "").trim()
  const email = String(body.email ?? "").trim().toLowerCase()
  const preferredContactTimes = Array.isArray(body.preferredContactTimes)
    ? (body.preferredContactTimes as TimeSlot[])
    : []
  const message = String(body.message ?? "").trim()
  const source = String(body.source ?? "auction_creator_modal")

  if (!name || !email || !email.includes("@")) {
    return NextResponse.json({ success: false, error: "Name and valid email are required" }, { status: 422 })
  }

  const client = createServiceRoleClient()
  if (!client) {
    return NextResponse.json({ success: false, error: "Database is not configured" }, { status: 503 })
  }

  // 1) Store the full application details
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
    console.error(
      JSON.stringify({
        level: "error",
        scope: "supabase",
        action: "insert_creator_application",
        code: (appErr as any)?.code ?? null,
        details: (appErr as any)?.details ?? (appErr as any)?.message ?? String(appErr),
      }),
    )
    return NextResponse.json(
      { success: false, error: "Applications are temporarily unavailable. Please try again soon." },
      { status: 503 },
    )
  }

  // 2) Ensure a subscriber row exists for unsubscribe/admin counts
  //    IMPORTANT: category must match your enum value exactly:
  //    'auction_waitlist_creator' (underscores)
  const unsubscribe_token = randomUUID()

  const { error: subErr } = await client
    .from("subscribers")
    .upsert(
      {
        email,
        category: "auction_waitlist_creator", // ← FIXED ENUM VALUE
        status: "confirmed",
        is_active: true,
        source,
        unsubscribe_token,
        created_at: new Date().toISOString(),
      },
      { onConflict: "email,category" },
    )

  if (subErr) {
    console.error(
      JSON.stringify({
        level: "error",
        scope: "supabase",
        action: "upsert_subscriber_creator",
        code: (subErr as any)?.code ?? null,
        details: (subErr as any)?.details ?? (subErr as any)?.message ?? String(subErr),
      }),
    )
    // Don't fail the whole request just because the subscriber upsert failed:
    // the application is already saved. Return success so the user sees green.
  }

  // 3) Fire-and-forget notifications
  Promise.all([notifyAdmin(name, email, preferredContactTimes, message), confirmApplicant(email)]).catch(() => null)

  // 4) Return a clean success payload for the client form
  return NextResponse.json({
    success: true,
    message: "Application submitted! We’ll review and get back to you soon.",
  })
}
