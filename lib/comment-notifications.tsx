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
    // Send thank you email to commenter
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

    // Send notification to admin
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

export async function sendCommentNotification(
  adminEmail: string,
  commenterName: string,
  commenterEmail: string,
  postTitle: string,
  commentContent: string,
  postUrl: string,
  postType: "blog" | "newsletter",
): Promise<{ success: boolean; error?: string }> {
  try {
    const subject = `New ${postType === "blog" ? "Blog" : "Newsletter"} Comment: ${postTitle}`

    const content = `
      <h2>New Comment Received</h2>
      <p>Someone left a comment on your ${postType === "blog" ? "blog post" : "newsletter article"}: <strong>${postTitle}</strong></p>
      
      <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0 0 10px 0;"><strong>From:</strong> ${commenterName} (${commenterEmail})</p>
        <p style="margin: 10px 0 0 0;"><strong>Comment:</strong></p>
        <div style="background: white; padding: 15px; border-radius: 4px; margin-top: 10px; white-space: pre-wrap;">
          ${commentContent}
        </div>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${postUrl}" style="display: inline-block; padding: 14px 32px; background-color: #7c3aed; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
          View Comment
        </a>
      </div>
    `

    const htmlBody = await createEmailTemplate(subject, content)

    const result = await sendMicrosoftGraphEmail({
      to: adminEmail,
      subject,
      body: htmlBody,
    })

    return result
  } catch (error) {
    console.error("Error sending comment notification:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send notification",
    }
  }
}

export async function sendCommentConfirmation(
  commenterEmail: string,
  commenterName: string,
  postTitle: string,
  postUrl: string,
  postType: "blog" | "newsletter",
): Promise<{ success: boolean; error?: string }> {
  try {
    const subject = "Thanks for your comment!"

    const content = `
      <h2>Comment Submitted Successfully</h2>
      <p>Hi ${commenterName},</p>
      <p>Thank you for leaving a comment on "${postTitle}". We appreciate you taking the time to engage with our content!</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${postUrl}" style="display: inline-block; padding: 14px 32px; background-color: #7c3aed; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
          View Your Comment
        </a>
      </div>
      
      <p>Want more insights? Subscribe to our newsletter to never miss an article.</p>
    `

    const htmlBody = await createEmailTemplate(subject, content)

    const result = await sendMicrosoftGraphEmail({
      to: commenterEmail,
      subject,
      body: htmlBody,
    })

    return result
  } catch (error) {
    console.error("Error sending comment confirmation:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send confirmation",
    }
  }
}
