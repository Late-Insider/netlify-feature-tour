import { NextResponse } from "next/server"
import { getDashboardStats, isSupabaseConfigured } from "@/lib/supabase"

export async function GET() {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ error: "Database is not configured." }, { status: 503 })
    }

    const stats = await getDashboardStats()

    return NextResponse.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    console.error("Dashboard stats error:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard stats." }, { status: 500 })
  }
}
