import { type NextRequest, NextResponse } from "next/server"
import { addCreatorApplication, isSupabaseConfigured } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ error: "Database is not configured. Please contact support." }, { status: 503 })
    }

    const body = await request.json()
    const { email, name, portfolio_url, message } = body

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 })
    }

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    const result = await addCreatorApplication({ email, name, portfolio_url, message })

    return NextResponse.json({
      success: true,
      message: "Application submitted! We will review and get back to you soon.",
      data: result,
    })
  } catch (error) {
    console.error("Creator application error:", error)
    return NextResponse.json({ error: "Failed to submit application. Please try again." }, { status: 500 })
  }
}
