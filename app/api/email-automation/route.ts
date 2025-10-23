import { type NextRequest, NextResponse } from "next/server"
import {
  sendNewsletterEmail,
  sendBlogNotification,
  sendTestEmail,
  getSubscriberStats,
  isValidEmail,
} from "@/lib/microsoft-email-automation"
import { isSupabaseServiceConfigured } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, ...data } = body

    // Validate email if provided
    if (data.email && !(await isValidEmail(data.email))) {
      return NextResponse.json({ success: false, error: "Invalid email address" }, { status: 400 })
    }

    switch (action) {
      case "send-newsletter": {
        const result = await sendNewsletterEmail(data)
        return NextResponse.json(result, { status: result.success ? 200 : 500 })
      }

      case "send-blog-notification": {
        const result = await sendBlogNotification(data)
        return NextResponse.json(result, { status: result.success ? 200 : 500 })
      }

      case "send-test": {
        const result = await sendTestEmail(data)
        return NextResponse.json(result, { status: result.success ? 200 : 500 })
      }

      case "get-stats": {
        if (!isSupabaseServiceConfigured()) {
          return NextResponse.json({ disabled: true })
        }
        const result = await getSubscriberStats()
        return NextResponse.json(result, { status: result.success ? 200 : 500 })
      }

      default:
        return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Email automation API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    if (!isSupabaseServiceConfigured()) {
      return NextResponse.json({ disabled: true })
    }
    const result = await getSubscriberStats()
    return NextResponse.json(result, { status: result.success ? 200 : 500 })
  } catch (error) {
    console.error("Email automation API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    )
  }
}
