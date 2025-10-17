import { type NextRequest, NextResponse } from "next/server"
import { addSubscriber, isSupabaseConfigured } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ error: "Database is not configured. Please contact support." }, { status: 503 })
    }

    const body = await request.json()
    const { email } = body

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 })
    }

    const result = await addSubscriber(email, "shop")

    return NextResponse.json({
      success: true,
      message: "You'll be the first to know when our shop launches!",
      data: result,
    })
  } catch (error) {
    console.error("Shop subscription error:", error)
    return NextResponse.json({ error: "Failed to subscribe. Please try again." }, { status: 500 })
  }
}
