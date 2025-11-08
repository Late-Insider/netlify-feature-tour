// app/api/subscribe/auction-creator/route.ts
import { NextRequest, NextResponse } from "next/server"
import { createServiceRoleClient } from "@/lib/supabase"
import { createEmailTemplate, sendMicrosoftGraphEmail } from "@/lib/microsoft-graph"

type TimeSlot = "morning" | "afternoon" | "evening" | "weekend"

function hasGraph() {
  const req = ["MICROSOFT_TENANT_ID", "MICROSOFT_CLIENT_ID", "MICROSOFT_CLIENT_SECRET", "MICROSOFT_SENDER_EMAIL"]
  return req.every((k) => !!process.env[k as keyof NodeJS.ProcessEnv])
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ success: false, error: "Invalid payload" }, { status: 400 })

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
  if (!client) return NextResponse.json({ success: false, error: "Database is not configured" }, { status: 503 })

  // 1) Store the application details
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
        details: (appErr as any)?.details ?? (appErr as any)?.message ?? null,
      })
    )
    return NextResponse.json(
      { success: false, error: "Applications are temporarily unavailable. Please try again soon." },
      { status: 503 }
    )
  }

  // 2) Ensure subscriber row exists (so admins see totals & users can unsubscribe)
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
      },
      { onConflict: "email,category" }
    )

  // 3) Emails (confirmation to creator + admin notification)
  if (hasGraph()) {
    const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://late.ltd"
    const adminTo = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.MICROSOFT_SENDER_EMAIL

    // Creator confirmation
    const creatorHtml = await createEmailTemplate(
      "We received your creator application",
      `
      <p>Hi ${name},</p>
      <p>Thanks for applying to the LATE auction as a creator. We’ve received your application and our team will review it shortly.</p>
      <p><strong>Preferred contact times:</strong> ${preferredContactTimes.length ? preferredContactTimes.join(", ") : "—"}</p>
      <p><strong>Your note:</strong><br/>${message ? message.replace(/\n/g, "<br/>") : "—"}</p>
      <p>We’ll be in touch soon. In the meantime, you can visit our site here: <a href="${SITE_URL}">${SITE_URL}</a></p>
      <p>— The LATE Team</p>
    `
    )

    void sendMicrosoftGraphEmail({
      to: email,
      subject: "LATE — Creator Application Received",
      body: creatorHtml,
    }).catch(() => null)

    // Admin notification
    if (adminTo) {
      const adminHtml = await createEmailTemplate(
        "New Creator Application",
        `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Preferred contact times:</strong> ${preferredContactTimes.length ? preferredContactTimes.join(", ") : "—"}</p>
        <p><strong>Message:</strong><br/>${message ? message.replace(/\n/g, "<br/>") : "—"}</p>
        <p><strong>Source:</strong> ${source}</p>
      `
      )
      void sendMicrosoftGraphEmail({
        to: adminTo,
        subject: "LATE — New Creator Application",
        body: adminHtml,
      }).catch(() => null)
    }
  }

  // 4) Success for the client toast
  return NextResponse.json({
    success: true,
    message: "Thank you for applying! We’ve received your details and will be in touch soon.",
  })
}
