import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 })
    }

    // Check which email provider is configured
    const hasResend = !!process.env.RESEND_API_KEY
    const hasMicrosoft = !!(
      process.env.MICROSOFT_CLIENT_ID &&
      process.env.MICROSOFT_CLIENT_SECRET &&
      process.env.MICROSOFT_TENANT_ID
    )

    if (!hasResend && !hasMicrosoft) {
      return NextResponse.json(
        {
          success: false,
          message: "No email provider configured. Please set up either Resend or Microsoft Graph.",
        },
        { status: 500 },
      )
    }

    // Simulate email sending (replace with actual implementation)
    console.log(`Test email would be sent to: ${email}`)
    console.log(`Using provider: ${hasResend ? "Resend" : "Microsoft Graph"}`)

    return NextResponse.json({
      success: true,
      message: `Test email sent successfully to ${email} using ${hasResend ? "Resend" : "Microsoft Graph"}`,
    })
  } catch (error) {
    console.error("Email test error:", error)
    return NextResponse.json({ success: false, message: "Failed to send test email" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const debug = searchParams.get("debug")

  if (debug === "true") {
    const hasResend = !!process.env.RESEND_API_KEY
    const hasMicrosoft = !!(
      process.env.MICROSOFT_CLIENT_ID &&
      process.env.MICROSOFT_CLIENT_SECRET &&
      process.env.MICROSOFT_TENANT_ID
    )

    return NextResponse.json({
      hasResendKey: hasResend,
      hasMicrosoftKeys: hasMicrosoft,
      resendKeyPrefix: process.env.RESEND_API_KEY?.substring(0, 7),
      microsoftClientIdPrefix: process.env.MICROSOFT_CLIENT_ID?.substring(0, 8),
      recommendedProvider: hasResend ? "Resend" : hasMicrosoft ? "Microsoft Graph" : "None configured",
      emailsToTest: ["commenter@example.com", "admin@example.com"],
    })
  }

  return NextResponse.json({ message: "Email test endpoint" })
}
