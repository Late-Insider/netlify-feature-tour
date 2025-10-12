import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, email, testType } = body

    if (action === "send-test") {
      console.log(`Sending test email to ${email} for category: ${testType}`)

      return NextResponse.json({
        success: true,
        message: `Test email sent to ${email}`,
      })
    }

    return NextResponse.json({
      success: false,
      error: "Invalid action",
    })
  } catch (error) {
    console.error("Error in email automation:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process email automation request",
      },
      { status: 500 },
    )
  }
}
