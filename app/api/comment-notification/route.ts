import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { commenterEmail, commenterName, comment, articleTitle } = await request.json()

    // Validate inputs
    if (!commenterEmail || !comment) {
      return NextResponse.json({ success: false, message: "Email and comment are required" }, { status: 400 })
    }

    // Here you would typically send an email notification to the admin
    // For now, we'll just log it and return success
    console.log("Comment notification:", {
      commenterEmail,
      commenterName,
      comment: comment.substring(0, 50) + "...",
      articleTitle,
    })

    // In a real implementation, you would:
    // 1. Send email to admin about new comment
    // 2. Send thank you email to commenter
    // 3. Store comment in database
    // 4. Add commenter to newsletter if they opt in

    return NextResponse.json({
      success: true,
      message: "Comment notifications sent successfully",
    })
  } catch (error) {
    console.error("Comment notification error:", error)
    return NextResponse.json({ error: "Failed to send notifications" }, { status: 500 })
  }
}
