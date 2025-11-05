import { type NextRequest, NextResponse } from "next/server"
import { addCreatorApplication, isSupabaseConfigured } from "@/lib/supabase"

const ALLOWED_TIMES = new Set([
  "Morning (9AM - 12PM)",
  "Afternoon (12PM - 5PM)",
  "Evening (5PM - 8PM)",
  "Weekends",
])

export async function POST(request: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: "Database is not configured. Please contact support." },
        { status: 503 },
      )
    }

    const body = await request.json().catch(() => ({} as any))
    const email: string = (body.email ?? "").trim()
    const name: string = (body.name ?? "").trim()
    const message: string | null = typeof body.message === "string" ? body.message.trim() : null
    const source: string = (body.source ?? "auction_creator_modal").trim()

    // MUST be an array of strings; keep only allowed values
    const preferredContactTimesRaw: unknown = body.preferredContactTimes
    const preferredContactTimes: string[] = Array.isArray(preferredContactTimesRaw)
      ? preferredContactTimesRaw.map(String).filter((v) => ALLOWED_TIMES.has(v))
      : []

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 })
    }
    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    const record = await addCreatorApplication({
      name,
      email,
     preferredContactTimes: string[]   // array of the labels
     message: string                   // mapped to artwork_description
      source,
    })

    if (!record) {
      return NextResponse.json(
        { error: "Applications are temporarily unavailable. Please try again soon." },
        { status: 503 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Application submitted! We will review and get back to you soon.",
      data: record,
    })
  } catch (error) {
    console.error("Creator application error:", error)
    return NextResponse.json({ error: "Failed to submit application. Please try again." }, { status: 500 })
  }
}
