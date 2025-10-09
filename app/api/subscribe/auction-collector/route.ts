import { type NextRequest, NextResponse } from "next/server"
import { addSubscriber, isSupabaseConfigured } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ error: "Database is not configured. Please contact support." }, { status: 503 })
    }

    const body = await request.json()
    const { email, name } = body

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 })
    }

    const result = await addSubscriber({ email, name, category: "auction-collector" })

    return NextResponse.json({
      success: true,
      message: result.isNew
        ? "You're on the collector waitlist! We'll notify you when auctions launch."
        : "You're already on our collector waitlist!",
      data: result.data,
    })
  } catch (error) {
    console.error("Auction collector subscription error:", error)
    return NextResponse.json({ error: "Failed to join waitlist. Please try again." }, { status: 500 })
  }
}
