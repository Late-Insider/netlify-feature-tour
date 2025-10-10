"use server"

import { sendMicrosoftGraphEmail, createEmailTemplate } from "@/lib/microsoft-graph"
import { createClient } from "@/lib/supabase"

interface ScheduledEmail {
  id: string
  recipient_email: string
  subject: string
  html_content: string
  scheduled_for: string
  sent: boolean
  sent_at: string | null
}

export async function sendScheduledEmails(): Promise<{ success: boolean; sent: number; failed: number }> {
  try {
    const supabase = createClient()
    const now = new Date().toISOString()

    const { data: pendingEmails, error } = await supabase
      .from("scheduled_emails")
      .select("*")
      .eq("sent", false)
      .lte("scheduled_for", now)
      .limit(20)

    if (error) {
      console.error("Error fetching pending emails:", error)
      return { success: false, sent: 0, failed: 0 }
    }

    if (!pendingEmails || pendingEmails.length === 0) {
      return { success: true, sent: 0, failed: 0 }
    }

    let sentCount = 0
    let failedCount = 0

    for (const email of pendingEmails) {
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
          console.error(`Failed to send email ${email.id}:`, result.error)
        }
      } catch (error) {
        failedCount++
        console.error(`Error sending email ${email.id}:`, error)
      }

      await new Promise((resolve) => setTimeout(resolve, 500))
    }

    return { success: true, sent: sentCount, failed: failedCount }
  } catch (error) {
    console.error("Error in sendScheduledEmails:", error)
    return { success: false, sent: 0, failed: 0 }
  }
}

export async function scheduleNewsletterEmail(
  recipientEmail: string,
  subject: string,
  content: string,
  scheduledFor: Date,
): Promise<{ success: boolean; emailId?: string }> {
  try {
    const supabase = createClient()

    const htmlContent = await createEmailTemplate(subject, content)

    const { data, error } = await supabase
      .from("scheduled_emails")
      .insert({
        recipient_email: recipientEmail,
        subject,
        html_content: htmlContent,
        scheduled_for: scheduledFor.toISOString(),
        email_type: "newsletter",
        sent: false,
      })
      .select()
      .single()

    if (error) {
      console.error("Error scheduling email:", error)
      return { success: false }
    }

    return { success: true, emailId: data.id }
  } catch (error) {
    console.error("Error in scheduleNewsletterEmail:", error)
    return { success: false }
  }
}

export async function getEmailStatistics(): Promise<{
  total: number
  sent: number
  pending: number
  scheduled: number
}> {
  try {
    const supabase = createClient()

    const { data: allEmails, error } = await supabase.from("scheduled_emails").select("sent, scheduled_for")

    if (error) {
      console.error("Error fetching email statistics:", error)
      return { total: 0, sent: 0, pending: 0, scheduled: 0 }
    }

    const now = new Date()
    const total = allEmails?.length || 0
    const sent = allEmails?.filter((e) => e.sent).length || 0
    const pending = allEmails?.filter((e) => !e.sent && new Date(e.scheduled_for) <= now).length || 0
    const scheduled = allEmails?.filter((e) => !e.sent && new Date(e.scheduled_for) > now).length || 0

    return { total, sent, pending, scheduled }
  } catch (error) {
    console.error("Error in getEmailStatistics:", error)
    return { total: 0, sent: 0, pending: 0, scheduled: 0 }
  }
}
