import { type NextRequest, NextResponse } from "next/server"
import { processNewComment } from "@/lib/comment-notifications"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, comment, articleTitle, articleSlug } = body

    if (!name || !email || !comment || !articleTitle || !articleSlug) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    const articleUrl = `${siteUrl}/newsletter/${articleSlug}`

    const success = await processNewComment({
      commenterEmail: email,
      commenterName: name,
      articleTitle,
      articleUrl,
      commentText: comment,
    })

    if (success) {
      return NextResponse.json({ success: true, message: "Comment submitted and notifications sent" })
    } else {
      return NextResponse.json({ success: false, error: "Failed to send notifications" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error processing comment:", error)
    return NextResponse.json(
      { success: false, error: "An error occurred while processing your comment" },
      { status: 500 },
    )
  }
}
