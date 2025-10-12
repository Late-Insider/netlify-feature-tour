import { type NextRequest, NextResponse } from "next/server"
import { getNewsletterBySlug, incrementNewsletterViews } from "@/lib/database-client"

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const newsletter = await getNewsletterBySlug(params.slug)

    if (!newsletter) {
      return NextResponse.json({ success: false, error: "Newsletter not found" }, { status: 404 })
    }

    // Increment view count
    await incrementNewsletterViews(params.slug)

    return NextResponse.json({ success: true, data: newsletter })
  } catch (error) {
    console.error("Error fetching newsletter:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch newsletter" }, { status: 500 })
  }
}
