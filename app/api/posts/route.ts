import { type NextRequest, NextResponse } from "next/server"
import { getPosts } from "@/lib/database-client"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const isPublished = searchParams.get("isPublished")
    const category = searchParams.get("category")
    const limit = searchParams.get("limit")

    const filters: any = {}
    if (isPublished !== null) {
      filters.isPublished = isPublished === "true"
    }
    if (category) {
      filters.category = category
    }
    if (limit) {
      filters.limit = Number.parseInt(limit, 10)
    }

    const posts = await getPosts(filters)

    return NextResponse.json({ success: true, data: posts })
  } catch (error) {
    console.error("Error fetching posts:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch posts" }, { status: 500 })
  }
}
