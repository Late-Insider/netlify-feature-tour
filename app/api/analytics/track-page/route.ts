import { type NextRequest, NextResponse } from "next/server"
import { trackPageView } from "@/lib/database-client"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.page_path) {
      return NextResponse.json({ success: false, error: "page_path is required" }, { status: 400 })
    }

    const pageView = await trackPageView({
      page_path: body.page_path,
      page_title: body.page_title,
      referrer: body.referrer,
      user_agent: request.headers.get("user-agent") || undefined,
      ip_address: request.ip || request.headers.get("x-forwarded-for") || undefined,
      device_type: body.device_type,
    })

    return NextResponse.json({ success: true, data: pageView }, { status: 201 })
  } catch (error) {
    console.error("Error tracking page view:", error)
    return NextResponse.json({ success: false, error: "Failed to track page view" }, { status: 500 })
  }
}
