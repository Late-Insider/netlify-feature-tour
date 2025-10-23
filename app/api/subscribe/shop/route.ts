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

    const result = await addSubscriber({ email, name, category: "shop" })

    if (result.disabled) {
      return NextResponse.json(
        { error: "Shop waitlist is currently offline. Please try later." },
        { status: 503 },
      )
    }

    if (result.error && !result.isNew) {
      const alreadyExists = result.error.toLowerCase().includes("already exists")
      return NextResponse.json(
        {
          success: alreadyExists,
          message: alreadyExists
            ? "You're already on our shop waitlist!"
            : "We couldn't add you right now. Please try again soon.",
          data: result.data,
        },
        { status: alreadyExists ? 200 : 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: result.isNew
        ? "You're on the waitlist! We'll notify you when the shop launches."
        : "You're already on our shop waitlist!",
      data: result.data,
    })
  } catch (error) {
    console.error("Shop subscription error:", error)
    return NextResponse.json({ error: "Failed to join waitlist. Please try again." }, { status: 500 })
  }
}
