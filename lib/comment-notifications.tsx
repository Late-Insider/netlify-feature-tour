"use server"

import { sendMicrosoftGraphEmail, createEmailTemplate } from "@/lib/microsoft-graph"

interface CommentData {
  commenterEmail: string
  commenterName: string
  articleTitle: string
  articleUrl: string
  commentText: string
}

export async function processNewComment(data: CommentData): Promise<boolean> {
  const { commenterEmail, commenterName, articleTitle, articleUrl, commentText } = data
  const adminEmail = process.env.MICROSOFT_SENDER_EMAIL || "admin@late.com"
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

  try {
    const thankYouContent = `
      <p>Hi ${commenterName},</p>
      <p>Thank you for commenting on "<strong>${articleTitle}</strong>".</p>
      <p>Your comment:</p>
      <blockquote style="border-left: 3px solid #7c3aed; padding-left: 15px; margin: 20px 0; color: #6b7280;">
        ${commentText}
      </blockquote>
      <p>Want to stay updated with more content like this? <a href="${siteUrl}/#newsletter" style="color: #7c3aed;">Subscribe to our newsletter</a>.</p>
      <p style="margin-top: 30px;">Best regards,<br><strong>The Late Team</strong></p>
    `

    const thankYouHtml = await createEmailTemplate("Thank you for your comment!", thankYouContent)

    await sendMicrosoftGraphEmail({
      to: commenterEmail,
      subject: `Thank you for commenting on "${articleTitle}"`,
      body: thankYouHtml,
    })

    const adminContent = `
      <h3>New Comment on Article</h3>
      <p><strong>Article:</strong> ${articleTitle}</p>
      <p><strong>Article URL:</strong> <a href="${articleUrl}" style="color: #7c3aed;">${articleUrl}</a></p>
      <p><strong>Commenter:</strong> ${commenterName} (${commenterEmail})</p>
      <p><strong>Comment:</strong></p>
      <blockquote style="border-left: 3px solid #7c3aed; padding-left: 15px; margin: 20px 0; background-color: #f9fafb; padding: 15px; border-radius: 4px;">
        ${commentText}
      </blockquote>
      <p><a href="${articleUrl}" style="display: inline-block; padding: 12px 24px; background-color: #7c3aed; color: #ffffff; text-decoration: none; border-radius: 6px; margin-top: 20px;">View Article</a></p>
    `

    const adminHtml = await createEmailTemplate("New Comment Notification", adminContent)

    await sendMicrosoftGraphEmail({
      to: adminEmail,
      subject: `New comment on "${articleTitle}"`,
      body: adminHtml,
    })

    return true
  } catch (error) {
    console.error("Error processing comment notification:", error)
    return false
  }
}
