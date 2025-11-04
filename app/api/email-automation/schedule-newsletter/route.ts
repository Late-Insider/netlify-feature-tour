import { type NextRequest, NextResponse } from "next/server"
import { sendNewsletterToSubscribers } from "@/lib/email-automation"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { subject, htmlContent, articleSlug } = body

    if (!subject || !htmlContent || !articleSlug) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const result = await sendNewsletterToSubscribers(subject, htmlContent, articleSlug)

    return NextResponse.json({
      success: result.success,
      scheduled: result.scheduledCount,
      message: result.message,
    })
  } catch (error) {
    console.error("Schedule newsletter error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
