import { type NextRequest, NextResponse } from "next/server"
import { createComment, getComments } from "@/lib/database-client"
import type { CreateCommentRequest } from "@/types/database"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const articleSlug = searchParams.get("articleSlug")
    const articleType = searchParams.get("articleType")

    if (!articleSlug || !articleType) {
      return NextResponse.json({ success: false, error: "articleSlug and articleType are required" }, { status: 400 })
    }

    const comments = await getComments(articleSlug, articleType)

    return NextResponse.json({ success: true, data: comments })
  } catch (error) {
    console.error("Error fetching comments:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch comments" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateCommentRequest = await request.json()

    if (!body.email || !body.comment || !body.article_slug || !body.article_type) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const comment = await createComment(body)

    return NextResponse.json({ success: true, data: comment }, { status: 201 })
  } catch (error) {
    console.error("Error creating comment:", error)
    return NextResponse.json({ success: false, error: "Failed to create comment" }, { status: 500 })
  }
}
