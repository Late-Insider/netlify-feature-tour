import { type NextRequest, NextResponse } from "next/server"
import { sendPendingEmails } from "@/lib/email-automation"

export async function POST(request: NextRequest) {
  try {
    const result = await sendPendingEmails()

    return NextResponse.json({
      success: true,
      sent: result.sent,
      failed: result.failed,
    })
  } catch (error) {
    console.error("Send pending emails error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  return POST(request)
}
