import { type NextRequest, NextResponse } from "next/server"
import { addComment, isSupabaseConfigured } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ error: "Database is not configured. Please contact support." }, { status: 503 })
    }

    const body = await request.json()
    const { email, comment, articleSlug, articleType } = body

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 })
    }

    if (!comment || comment.trim().length === 0) {
      return NextResponse.json({ error: "Comment cannot be empty" }, { status: 400 })
    }

    if (!articleSlug) {
      return NextResponse.json({ error: "Article slug is required" }, { status: 400 })
    }

    const result = await addComment(email, comment, articleSlug, articleType || "newsletter")

    return NextResponse.json({
      success: true,
      message: "Comment submitted successfully!",
      data: result,
    })
  } catch (error) {
    console.error("Comment submission error:", error)
    return NextResponse.json({ error: "Failed to submit comment. Please try again." }, { status: 500 })
  }
}
