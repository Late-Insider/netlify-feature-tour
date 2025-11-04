import { type NextRequest, NextResponse } from "next/server"
import { createEmailTemplate, sendMicrosoftGraphEmail } from "@/lib/microsoft-graph"

export async function POST(request: NextRequest) {
  try {
    const { testEmail, type, data } = await request.json()

    if (!testEmail) {
      return NextResponse.json({ success: false, error: "Test email address is required" }, { status: 400 })
    }

    let subject: string
    let content: string

    if (type === "newsletter") {
      subject = `[TEST] Weekly Insights: ${data.title} | LATE`
      content = `
        <h2>${data.title}</h2>
        <p><em>Published: ${data.date}</em></p>
        
        <div style="margin: 20px 0;">
          ${data.content || "<p>This is a test newsletter content. The actual content would appear here.</p>"}
        </div>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 6px; text-align: center; margin: 30px 0;">
          <p><strong>Engage with this article</strong></p>
          <p>Share your thoughts, reactions, and join the conversation:</p>
          <a href="https://late.ltd/newsletter/${data.slug}" style="display: inline-block; background: #8b5cf6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 10px 0;">
            React & Comment →
          </a>
        </div>
      `
    } else {
      subject = `[TEST] New Perspective: ${data.title} | LATE`
      content = `
        <h2>${data.title}</h2>
        <p><em>Published: ${data.date}</em></p>
        
        <div style="font-size: 16px; line-height: 1.7; margin: 20px 0; padding: 20px; background: #f8f9fa; border-left: 4px solid #8b5cf6; border-radius: 0 6px 6px 0;">
          "${data.preview}..."
        </div>
        
        <p style="color: #666; font-style: italic; margin: 15px 0;">
          This exploration dives deep into perspectives that might change how you think about success, productivity, and intentional living.
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://late.ltd/blog/${data.slug}" style="display: inline-block; background: #8b5cf6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; margin: 10px 0;">
            Continue Reading on LATE.ltd →
          </a>
        </div>
      `
    }

    const htmlContent = await createEmailTemplate(subject, content)

    console.log("Attempting to send test email...")
    console.log("Environment variables check:")
    console.log("MICROSOFT_CLIENT_ID:", process.env.MICROSOFT_CLIENT_ID ? "Set" : "Missing")
    console.log("MICROSOFT_CLIENT_SECRET:", process.env.MICROSOFT_CLIENT_SECRET ? "Set" : "Missing")
    console.log("MICROSOFT_TENANT_ID:", process.env.MICROSOFT_TENANT_ID ? "Set" : "Missing")
    console.log("MICROSOFT_SENDER_EMAIL:", process.env.MICROSOFT_SENDER_EMAIL ? "Set" : "Missing")

    const result = await sendMicrosoftGraphEmail({
      to: testEmail,
      subject,
      body: htmlContent,
    })

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Test email sent successfully!",
      })
    } else {
      console.error("Email send failed:", result.error)
      return NextResponse.json({
        success: false,
        error: result.error || "Failed to send email",
      })
    }
  } catch (error) {
    console.error("Test email API error:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    })
  }
}
