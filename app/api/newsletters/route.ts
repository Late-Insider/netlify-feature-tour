import { type NextRequest, NextResponse } from "next/server"
import { getNewsletterArticles } from "@/lib/database-client"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const isPublished = searchParams.get("isPublished")
    const limit = searchParams.get("limit")

    const filters: any = {}
    if (isPublished !== null) {
      filters.isPublished = isPublished === "true"
    }
    if (limit) {
      filters.limit = Number.parseInt(limit, 10)
    }

    const newsletters = await getNewsletterArticles(filters)

    return NextResponse.json({ success: true, data: newsletters })
  } catch (error) {
    console.error("Error fetching newsletters:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch newsletters" }, { status: 500 })
  }
}
