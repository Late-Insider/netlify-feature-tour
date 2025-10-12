import { type NextRequest, NextResponse } from "next/server"
import { getAnalyticsStats } from "@/lib/database-client"

export async function GET(request: NextRequest) {
  try {
    const stats = await getAnalyticsStats()
    return NextResponse.json({ success: true, data: stats })
  } catch (error) {
    console.error("Error fetching analytics stats:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch analytics stats" }, { status: 500 })
  }
}
