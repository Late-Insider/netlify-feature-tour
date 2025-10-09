import { type NextRequest, NextResponse } from "next/server"
import { trackEvent, generateVisitorId } from "@/lib/analytics"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { eventType, articleSlug, articleType, reactionType, readTimeSeconds, metadata } = body

    if (!eventType || !articleSlug || !articleType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Generate visitor ID on server side
    const visitorId = await generateVisitorId()

    const success = await trackEvent({
      eventType,
      articleSlug,
      articleType,
      visitorId,
      reactionType,
      readTimeSeconds,
      metadata,
    })

    if (!success) {
      return NextResponse.json({ error: "Failed to track event" }, { status: 500 })
    }

    return NextResponse.json({ success: true, visitorId })
  } catch (error) {
    console.error("Track analytics error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
