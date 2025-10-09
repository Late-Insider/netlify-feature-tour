import { type NextRequest, NextResponse } from "next/server"
import { getEmailStats } from "@/lib/email-automation"

export async function GET(request: NextRequest) {
  try {
    const stats = await getEmailStats()
    return NextResponse.json(stats)
  } catch (error) {
    console.error("Email stats error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
