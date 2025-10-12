import { type NextRequest, NextResponse } from "next/server"
import { trackEvent } from "@/lib/database-client"
import type { TrackEventRequest } from "@/types/database"

export async function POST(request: NextRequest) {
  try {
    const body: TrackEventRequest = await request.json()

    if (!body.event_name) {
      return NextResponse.json({ success: false, error: "event_name is required" }, { status: 400 })
    }

    const event = await trackEvent(body)

    return NextResponse.json({ success: true, data: event }, { status: 201 })
  } catch (error) {
    console.error("Error tracking event:", error)
    return NextResponse.json({ success: false, error: "Failed to track event" }, { status: 500 })
  }
}
