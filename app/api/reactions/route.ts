import { type NextRequest, NextResponse } from "next/server"
import { createReaction, getReactionCounts, getUserReaction } from "@/lib/database-client"
import type { CreateReactionRequest } from "@/types/database"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const articleSlug = searchParams.get("articleSlug")
    const articleType = searchParams.get("articleType")
    const email = searchParams.get("email")

    if (!articleSlug || !articleType) {
      return NextResponse.json({ success: false, error: "articleSlug and articleType are required" }, { status: 400 })
    }

    const counts = await getReactionCounts(articleSlug, articleType)
    let userReaction = null

    if (email) {
      userReaction = await getUserReaction(email, articleSlug, articleType)
    }

    return NextResponse.json({ success: true, data: { counts, userReaction } })
  } catch (error) {
    console.error("Error fetching reactions:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch reactions" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateReactionRequest = await request.json()

    if (!body.email || !body.article_slug || !body.article_type || !body.reaction_type) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const reaction = await createReaction(body)

    return NextResponse.json({ success: true, data: reaction }, { status: 201 })
  } catch (error) {
    console.error("Error creating reaction:", error)
    return NextResponse.json({ success: false, error: "Failed to create reaction" }, { status: 500 })
  }
}
