import { type NextRequest, NextResponse } from "next/server"
import { getDashboardStats } from "@/lib/database-client"

export async function GET(request: NextRequest) {
  try {
    const stats = await getDashboardStats()
    return NextResponse.json({ success: true, data: stats })
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch dashboard stats" }, { status: 500 })
  }
}
