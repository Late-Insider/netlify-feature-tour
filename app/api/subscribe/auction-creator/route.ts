import { NextRequest, NextResponse } from "next/server"
import { createServiceRoleClient } from "@/lib/supabase"

type TimeSlot = "morning" | "afternoon" | "evening" | "weekend"

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
    return NextResponse.json({ success: false, error: "Applications are temporarily unavailable. Please try again soon." }, { status: 503 })
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

  return NextResponse.json({ success: true })
}
