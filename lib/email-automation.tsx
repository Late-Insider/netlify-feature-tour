"use server"

import { sendMicrosoftGraphEmail } from "@/lib/microsoft-graph"
import { createServiceRoleClient } from "@/lib/supabase"
import { generateUnsubscribeUrl } from "@/lib/unsubscribe"

interface EmailData {
  recipientEmail: string
  subject: string
  htmlContent: string
  scheduledFor: Date
  emailType: "welcome" | "newsletter" | "notification" | "custom"
  metadata?: Record<string, any>
}

export async function scheduleEmail(data: EmailData): Promise<{
  success: boolean
  emailId?: string
  message: string
}> {
  try {
    const supabase = createServiceRoleClient()
    if (!supabase) {
      return { success: false, message: "Supabase is not configured" }
    }

    const { data: emailRecord, error } = await supabase
      .from("scheduled_emails")
      .insert({
        recipient_email: data.recipientEmail,
        subject: data.subject,
        html_content: data.htmlContent,
        scheduled_for: data.scheduledFor.toISOString(),
        email_type: data.emailType,
        metadata: data.metadata || {},
        sent: false,
      })
      .select()
      .single()

    if (error) {
      console.error("Database error scheduling email:", error)
      return {
        success: false,
        message: "Failed to schedule email",
      }
    }

    return {
      success: true,
      emailId: emailRecord.id,
      message: "Email scheduled successfully",
    }
  } catch (error) {
    console.error("Error scheduling email:", error)
    return {
      success: false,
      message: "An error occurred while scheduling the email",
    }
  }
}

export async function sendPendingEmails(): Promise<{
  success: boolean
  sentCount: number
  failedCount: number
}> {
  try {
    const supabase = createServiceRoleClient()
    if (!supabase) {
      return { success: false, sentCount: 0, failedCount: 0 }
    }

    const { data: pendingEmails, error: fetchError } = await supabase
      .from("scheduled_emails")
      .select("*")
      .eq("sent", false)
      .lte("scheduled_for", new Date().toISOString())
      .limit(50)

    if (fetchError) {
      console.error("Error fetching pending emails:", fetchError)
      return { success: false, sentCount: 0, failedCount: 0 }
    }

    if (!pendingEmails || pendingEmails.length === 0) {
      return { success: true, sentCount: 0, failedCount: 0 }
    }

    let sentCount = 0
    let failedCount = 0

    const batchSize = 5
    for (let i = 0; i < pendingEmails.length; i += batchSize) {
      const batch = pendingEmails.slice(i, i + batchSize)

      await Promise.all(
        batch.map(async (email) => {
          try {
            const result = await sendMicrosoftGraphEmail({
              to: email.recipient_email,
              subject: email.subject,
              body: email.html_content,
            })

            if (result.success) {
              await supabase
                .from("scheduled_emails")
                .update({
                  sent: true,
                  sent_at: new Date().toISOString(),
                })
                .eq("id", email.id)

              sentCount++
            } else {
              failedCount++
            }
          } catch (error) {
            console.error(`Failed to send email ${email.id}:`, error)
            failedCount++
          }
        }),
      )

      if (i + batchSize < pendingEmails.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }

    return {
      success: true,
      sentCount,
      failedCount,
    }
  } catch (error) {
    console.error("Error sending pending emails:", error)
    return {
      success: false,
      sentCount: 0,
      failedCount: 0,
    }
  }
}

export async function sendWelcomeEmail(email: string, name?: string): Promise<boolean> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  const unsubscribeUrl = await generateUnsubscribeUrl(email, "newsletter")

  const subject = `Welcome to Late - Own Your Time`

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Late</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <tr>
            <td style="padding: 40px 40px 30px; text-align: center; background: linear-gradient(135deg, #7c3aed 0%, #000000 100%); border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold; letter-spacing: 2px;">LATE</h1>
              <p style="margin: 10px 0 0; color: #e9d5ff; font-size: 16px; letter-spacing: 1px;">OWN YOUR TIME</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; color: #111827; font-size: 24px; font-weight: bold;">
                Welcome${name ? `, ${name}` : ""}!
              </h2>
              <p style="margin: 0 0 20px; color: #374151; font-size: 16px; line-height: 1.6;">
                Thank you for subscribing to our newsletter. We're excited to have you join our community of people who value their time and strive for meaningful productivity.
              </p>
              <div style="background-color: #f9fafb; border-left: 4px solid #7c3aed; padding: 20px; margin: 25px 0; border-radius: 4px;">
                <h3 style="margin: 0 0 10px; color: #111827; font-size: 18px; font-weight: 600;">
                  What to Expect
                </h3>
                <ul style="margin: 10px 0 0; padding-left: 20px; color: #374151; font-size: 15px; line-height: 1.8;">
                  <li>Weekly insights on productivity and time management</li>
                  <li>Practical strategies for personal growth</li>
                  <li>Exclusive content and early access to new features</li>
                  <li>Tips on owning your time and living intentionally</li>
                </ul>
              </div>
              <p style="margin: 25px 0 20px; color: #374151; font-size: 16px; line-height: 1.6;">
                In the meantime, explore our latest articles and discover insights that can help you take control of your time.
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${siteUrl}/#newsletter" style="display: inline-block; padding: 14px 32px; background-color: #7c3aed; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
                  Read Latest Articles
                </a>
              </div>
              <p style="margin: 30px 0 0; color: #6b7280; font-size: 15px; line-height: 1.6;">
                We're glad you're here.<br>
                <strong style="color: #7c3aed;">The Late Team</strong>
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px 40px; background-color: #f9fafb; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px; color: #6b7280; font-size: 13px; text-align: center; line-height: 1.5;">
                <strong>Late</strong> - Own Your Time<br>
                Helping you make the most of every moment
              </p>
              <p style="margin: 10px 0 0; color: #9ca3af; font-size: 12px; text-align: center;">
                <a href="${unsubscribeUrl}" style="color: #9ca3af; text-decoration: underline;">Unsubscribe</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `

  try {
    const result = await scheduleEmail({
      recipientEmail: email,
      subject,
      htmlContent,
      scheduledFor: new Date(),
      emailType: "welcome",
      metadata: { name: name || "" },
    })

    return result.success
  } catch (error) {
    console.error("Failed to schedule welcome email:", error)
    return false
  }
}

export async function sendNewsletterToSubscribers(
  subject: string,
  htmlContent: string,
  scheduledFor?: Date,
): Promise<{
  success: boolean
  scheduledCount: number
  message: string
}> {
  try {
    const supabase = createServiceRoleClient()
    if (!supabase) {
      return {
        success: false,
        scheduledCount: 0,
        message: "Supabase is not configured",
      }
    }

    const { data: subscribers, error } = await supabase
      .from("subscribers")
      .select("email, name")
      .eq("source", "newsletter")
      .eq("is_active", true)

    if (error) {
      console.error("Error fetching subscribers:", error)
      return {
        success: false,
        scheduledCount: 0,
        message: "Failed to fetch subscribers",
      }
    }

    if (!subscribers || subscribers.length === 0) {
      return {
        success: true,
        scheduledCount: 0,
        message: "No active subscribers found",
      }
    }

    const sendTime = scheduledFor || new Date()
    let scheduledCount = 0

    for (const subscriber of subscribers) {
      const unsubscribeUrl = await generateUnsubscribeUrl(subscriber.email, "newsletter")

      const personalizedHtml = htmlContent.replace(
        "</body>",
        `<p style="text-align: center; margin-top: 20px;"><a href="${unsubscribeUrl}" style="color: #9ca3af; text-decoration: underline;">Unsubscribe</a></p></body>`,
      )

      const result = await scheduleEmail({
        recipientEmail: subscriber.email,
        subject,
        htmlContent: personalizedHtml,
        scheduledFor: sendTime,
        emailType: "newsletter",
        metadata: { subscriberName: subscriber.name || "" },
      })

      if (result.success) {
        scheduledCount++
      }
    }

    return {
      success: true,
      scheduledCount,
      message: `Newsletter scheduled for ${scheduledCount} subscribers`,
    }
  } catch (error) {
    console.error("Error sending newsletter:", error)
    return {
      success: false,
      scheduledCount: 0,
      message: "An error occurred while scheduling the newsletter",
    }
  }
}

export async function getEmailStats(): Promise<{
  total: number
  sent: number
  pending: number
  failed: number
  byType: Record<string, { total: number; sent: number; pending: number }>
}> {
  try {
    const supabase = createServiceRoleClient()
    if (!supabase) {
      return {
        total: 0,
        sent: 0,
        pending: 0,
        failed: 0,
        byType: {},
      }
    }

    const { data: stats, error } = await supabase.from("scheduled_emails").select("*")

    if (error) {
      console.error("Error fetching email stats:", error)
      return {
        total: 0,
        sent: 0,
        pending: 0,
        failed: 0,
        byType: {},
      }
    }

    const total = stats.length
    const sent = stats.filter((e) => e.sent).length
    const pending = stats.filter((e) => !e.sent).length

    const byType: Record<string, { total: number; sent: number; pending: number }> = {}
    for (const email of stats) {
      if (!byType[email.email_type]) {
        byType[email.email_type] = { total: 0, sent: 0, pending: 0 }
      }
      byType[email.email_type].total++
      if (email.sent) {
        byType[email.email_type].sent++
      } else {
        byType[email.email_type].pending++
      }
    }

    return {
      total,
      sent,
      pending,
      failed: 0,
      byType,
    }
  } catch (error) {
    console.error("Error calculating email stats:", error)
    return {
      total: 0,
      sent: 0,
      pending: 0,
      failed: 0,
      byType: {},
    }
  }
}
