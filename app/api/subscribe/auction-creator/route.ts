import { NextRequest, NextResponse } from "next/server"
import { createServiceRoleClient, addSubscriber } from "@/lib/supabase"
import { createEmailTemplate, sendMicrosoftGraphEmail } from "@/lib/microsoft-graph"

// simple guard
function isEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)
}

async function sendAdminNotice(app: {
  name: string
  email: string
  preferredContactTimes: string[]
  artworkDescription: string
}) {
  const tenant = process.env.MICROSOFT_TENANT_ID
  const id = process.env.MICROSOFT_CLIENT_ID
  const secret = process.env.MICROSOFT_CLIENT_SECRET
  const from = process.env.MICROSOFT_SENDER_EMAIL
  const adminTo = process.env.ADMIN_NOTIFICATION_EMAIL || from

  if (!tenant || !id || !secret || !from || !adminTo) return

  const html = await createEmailTemplate(
    "New Creator Application",
    `
    <p><strong>Name:</strong> ${app.name}</p>
    <p><strong>Email:</strong> ${app.email}</p>
    <p><strong>Preferred times:</strong> ${app.preferredContactTimes.join(", ") || "—"}</p>
    <p><strong>Description:</strong></p>
    <p>${app.artworkDescription || "—"}</p>
    `
  )

  await sendMicrosoftGraphEmail({
    to: adminTo,
    subject: "Creator Application — Late",
    body: html,
  })
}

async function sendApplicantThanks(email: string) {
  const tenant = process.env.MICROSOFT_TENANT_ID
  const id = process.env.MICROSOFT_CLIENT_ID
  const secret = process.env.MICROSOFT_CLIENT_SECRET
  const from = process.env.MICROSOFT_SENDER_EMAIL
  if (!tenant || !id || !secret || !from) return

  const html = await createEmailTemplate(
    "Thanks for your creator application",
    `
    <p>Thanks for your interest in joining LATE’s auction. We’ll review your application and get back to you.</p>
    `
  )

  await sendMicrosoftGraphEmail({
    to: email,
    subject: "We received your creator application",
    body: html,
  })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null)
    if (!body) return NextResponse.json({ success: false, error: "Invalid payload" }, { status: 400 })

    const name = String(body.name || "").trim()
    const email = String(body.email || "").trim().toLowerCase()
    const times = Array.isArray(body.preferredContactTimes) ? body.preferredContactTimes.map(String) : []
    const message = String(body.message || "").trim()
    const source = String(body.source || "auction_creator_modal")

    if (!name || !isEmail(email) || !message) {
      return NextResponse.json({ success: false, error: "Missing name, valid email, or description" }, { status: 422 })
    }

    const client = createServiceRoleClient()
    if (!client) {
      return NextResponse.json({ success: false, error: "Database unavailable" }, { status: 503 })
    }

    // 1) Save the full application
    const { data: appRow, error: appErr } = await client
      .from("creator_applications")
      .insert({
        name,
        email,
        preferred_contact_times: times, // TEXT[]
        artwork_description: message,
        status: "pending",
        source,
        submitted_at: new Date().toISOString(),
      })
      .select("id")
      .single()

    if (appErr) {
      console.error("Creator app insert error:", appErr)
      return NextResponse.json({ success: false, error: "Applications are temporarily unavailable." }, { status: 503 })
    }

    // 2) Also add them to subscribers (category you prefer in the dashboard)
    //    If you want a different label, adjust here.
    await addSubscriber({
      email,
      category: "auction-creator",
      status: "pending",
      source,
    })

    // 3) Emails (best-effort; API still returns success)
    await Promise.all([
      sendApplicantThanks(email),
      sendAdminNotice({ name, email, preferredContactTimes: times, artworkDescription: message }),
    ]).catch(() => null)

    return NextResponse.json({ success: true, id: appRow?.id ?? null })
  } catch (e) {
    console.error("Creator API error:", e)
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 })
  }
}
