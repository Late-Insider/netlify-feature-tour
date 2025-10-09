"use server"

import { sendMicrosoftGraphEmail, createEmailTemplate } from "./microsoft-graph"

interface CommentData {
  commenterEmail: string
  commenterName: string
  articleTitle: string
  articleUrl: string
  commentText: string
}

export async function processNewComment(data: CommentData): Promise<boolean> {
  const { commenterEmail, commenterName, articleTitle, articleUrl, commentText } = data

  const adminEmail = process.env.MICROSOFT_SENDER_EMAIL || "admin@example.com"
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

  // Send notification to admin
  const adminSubject = `New Comment on "${articleTitle}"`
  const adminBody = await createEmailTemplate(
    "New Comment Received",
    `
    <p><strong>${commenterName}</strong> (${commenterEmail}) commented on <a href="${articleUrl}">${articleTitle}</a>:</p>
    <div style="background-color: #f9fafb; padding: 15px; border-left: 4px solid #7c3aed; margin: 20px 0;">
      <p style="margin: 0; color: #374151;">${commentText}</p>
    </div>
    <p><a href="${articleUrl}" style="color: #7c3aed; text-decoration: underline;">View the article and comment</a></p>
  `,
  )

  const adminResult = await sendMicrosoftGraphEmail({
    to: adminEmail,
    subject: adminSubject,
    body: adminBody,
  })

  // Send thank you email to commenter
  const commenterSubject = `Thank you for your comment on "${articleTitle}"`
  const commenterBody = await createEmailTemplate(
    `Thank you, ${commenterName}!`,
    `
    <p>Thank you for taking the time to share your thoughts on <a href="${articleUrl}">${articleTitle}</a>.</p>
    <p>We appreciate your engagement and hope you continue to enjoy our content.</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${siteUrl}/#newsletter" style="display: inline-block; padding: 14px 32px; background-color: #7c3aed; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">Subscribe to Our Newsletter</a>
    </div>
    <p style="margin-top: 20px; color: #6b7280;">Don't want to miss our weekly insights? Subscribe to get our latest articles delivered straight to your inbox.</p>
  `,
  )

  const commenterResult = await sendMicrosoftGraphEmail({
    to: commenterEmail,
    subject: commenterSubject,
    body: commenterBody,
  })

  return adminResult.success && commenterResult.success
}
