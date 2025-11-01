import { type NextRequest, NextResponse } from "next/server"
import { addComment, addSubscriber, getSubscriberByEmail } from "@/lib/supabase"
import { processNewComment } from "@/lib/comment-notifications"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, comment, articleTitle, articleSlug, articleType } = body

    if (!name || !email || !comment || !articleTitle || !articleSlug || !articleType) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ success: false, error: "Invalid email format" }, { status: 400 })
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    const articleUrl = `${siteUrl}/newsletter/${articleSlug}`

    await addComment(email, comment, articleSlug, articleType)

    const existingSubscriber = await getSubscriberByEmail(email)
    if (!existingSubscriber) {
      await addSubscriber({ email, source: `${articleType}_comment` })
    }

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
      return NextResponse.json(
        { success: false, error: "Comment saved but failed to send notifications" },
        { status: 207 },
      )
    }
  } catch (error) {
    console.error("Error processing comment:", error)
    return NextResponse.json(
      { success: false, error: "An error occurred while processing your comment" },
      { status: 500 },
    )
  }
}
