import { type NextRequest, NextResponse } from "next/server"
import { getAllAnalytics, getTopArticles, getEngagementMetrics } from "@/lib/analytics"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") || "all"

    if (type === "top") {
      const limit = Number.parseInt(searchParams.get("limit") || "10")
      const data = await getTopArticles(limit)
      return NextResponse.json(data)
    }

    if (type === "metrics") {
      const articleSlug = searchParams.get("slug") || undefined
      const articleType = (searchParams.get("articleType") as any) || undefined
      const data = await getEngagementMetrics(articleSlug, articleType)
      return NextResponse.json(data)
    }

    const data = await getAllAnalytics()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Get analytics stats error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
