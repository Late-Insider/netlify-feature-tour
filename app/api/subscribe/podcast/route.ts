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

    const result = await addSubscriber({ email, name, category: "podcast" })

    if (result.disabled) {
      return NextResponse.json(
        { error: "Podcast alerts are currently offline. Please try later." },
        { status: 503 },
      )
    }

    if (result.error && !result.isNew) {
      const alreadyExists = result.error.toLowerCase().includes("already exists")
      return NextResponse.json(
        {
          success: alreadyExists,
          message: alreadyExists
            ? "You're already subscribed to our podcast!"
            : "We couldn't add you right now. Please try again soon.",
          data: result.data,
        },
        { status: alreadyExists ? 200 : 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: result.isNew
        ? "You're subscribed! We'll notify you about new podcast episodes."
        : "You're already subscribed to our podcast!",
      data: result.data,
    })
  } catch (error) {
    console.error("Podcast subscription error:", error)
    return NextResponse.json({ error: "Failed to subscribe. Please try again." }, { status: 500 })
  }
}
