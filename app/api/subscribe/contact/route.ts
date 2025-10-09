import { type NextRequest, NextResponse } from "next/server"
import { addContactSubmission, isSupabaseConfigured } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ error: "Database is not configured. Please contact support." }, { status: 503 })
    }

    const body = await request.json()
    const { email, name, message } = body

    // Validate email
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 })
    }

    // Add to database
    const result = await addContactSubmission({ email, name, message })

    return NextResponse.json({
      success: true,
      message: "Thank you for your message! We will get back to you soon.",
      data: result,
    })
  } catch (error) {
    console.error("Contact submission error:", error)
    return NextResponse.json({ error: "Failed to submit contact form. Please try again." }, { status: 500 })
  }
}
