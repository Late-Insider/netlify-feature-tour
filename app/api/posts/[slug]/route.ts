import { type NextRequest, NextResponse } from "next/server"
import { getPostBySlug, incrementPostViews } from "@/lib/database-client"

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const post = await getPostBySlug(params.slug)

    if (!post) {
      return NextResponse.json({ success: false, error: "Post not found" }, { status: 404 })
    }

    // Increment view count
    await incrementPostViews(params.slug)

    return NextResponse.json({ success: true, data: post })
  } catch (error) {
    console.error("Error fetching post:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch post" }, { status: 500 })
  }
}
