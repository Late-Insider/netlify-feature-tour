"use server"

import { Client } from "@microsoft/microsoft-graph-client"
import type { AuthenticationProvider } from "@microsoft/microsoft-graph-client"

// Custom authentication provider for Microsoft Graph
class CustomAuthProvider implements AuthenticationProvider {
  async getAccessToken(): Promise<string> {
    const tokenEndpoint = `https://login.microsoftonline.com/${process.env.MICROSOFT_TENANT_ID}/oauth2/v2.0/token`

    const params = new URLSearchParams()
    params.append("client_id", process.env.MICROSOFT_CLIENT_ID!)
    params.append("client_secret", process.env.MICROSOFT_CLIENT_SECRET!)
    params.append("scope", "https://graph.microsoft.com/.default")
    params.append("grant_type", "client_credentials")

    const response = await fetch(tokenEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    })

    if (!response.ok) {
      throw new Error(`Failed to get access token: ${response.statusText}`)
    }

    const data = await response.json()
    return data.access_token
  }
}

// Initialize Microsoft Graph client
const authProvider = new CustomAuthProvider()
const graphClient = Client.initWithMiddleware({ authProvider })

// Create email template with LATE branding
export async function createEmailTemplate(
  subject: string,
  content: string,
  type: "newsletter" | "notification" | "test" = "newsletter",
): Promise<string> {
  const brandColor = "#000000"
  const accentColor = "#6366f1"

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          margin: 0; 
          padding: 0; 
          background-color: #f8f9fa;
        }
        .container { 
          max-width: 600px; 
          margin: 0 auto; 
          background: white; 
          border-radius: 8px; 
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header { 
          background: ${brandColor}; 
          color: white; 
          padding: 40px 30px; 
          text-align: center; 
        }
        .header h1 { 
          margin: 0; 
          font-size: 32px; 
          font-weight: bold; 
          letter-spacing: 2px;
        }
        .header p { 
          margin: 10px 0 0 0; 
          opacity: 0.9; 
          font-size: 16px;
        }
        .content { 
          padding: 40px 30px; 
        }
        .content h2 { 
          color: ${brandColor}; 
          margin-top: 30px; 
          margin-bottom: 15px;
          font-size: 24px;
        }
        .content h3 { 
          color: ${brandColor}; 
          margin-top: 25px; 
          margin-bottom: 12px;
          font-size: 20px;
        }
        .content p { 
          margin-bottom: 16px; 
          font-size: 16px;
          line-height: 1.7;
        }
        .cta-button { 
          display: inline-block; 
          background: ${accentColor}; 
          color: white; 
          padding: 15px 30px; 
          text-decoration: none; 
          border-radius: 6px; 
          font-weight: bold; 
          margin: 20px 0;
          font-size: 16px;
        }
        .footer { 
          background: #f8f9fa; 
          padding: 30px; 
          text-align: center; 
          border-top: 1px solid #e9ecef;
        }
        .footer p { 
          margin: 5px 0; 
          color: #6c757d; 
          font-size: 14px;
        }
        .footer a { 
          color: ${accentColor}; 
          text-decoration: none; 
        }
        .social-links { 
          margin: 20px 0; 
        }
        .social-links a { 
          display: inline-block; 
          margin: 0 10px; 
          color: ${accentColor}; 
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>LATE</h1>
          <p>Own Your Time</p>
        </div>
        <div class="content">
          ${content}
        </div>
        <div class="footer">
          <div class="social-links">
            <a href="https://late.ltd">Visit Website</a>
            <a href="https://late.ltd/newsletter">Newsletter</a>
            <a href="https://late.ltd/blog">Blog</a>
          </div>
          <p>&copy; 2025 LATE. All rights reserved.</p>
          <p>
            <a href="https://late.ltd/unsubscribe">Unsubscribe</a> | 
            <a href="https://late.ltd/privacy">Privacy Policy</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `
}

// Send email using Microsoft Graph API
export async function sendEmail(
  to: string,
  subject: string,
  htmlContent: string,
  from: string = process.env.MICROSOFT_SENDER_EMAIL || "noreply@late.ltd",
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const message = {
      subject: subject,
      body: {
        contentType: "HTML" as const,
        content: htmlContent,
      },
      toRecipients: [
        {
          emailAddress: {
            address: to,
          },
        },
      ],
      from: {
        emailAddress: {
          address: from,
        },
      },
    }

    // Send email via Microsoft Graph
    const response = await graphClient.api(`/users/${from}/sendMail`).post({
      message,
    })

    console.log("Email sent successfully via Microsoft Graph:", {
      to,
      subject,
      from,
    })

    return {
      success: true,
      messageId: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    }
  } catch (error) {
    console.error("Error sending email via Microsoft Graph:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

// Send newsletter email
export async function sendNewsletterEmail(data: {
  email: string
  subject: string
  content: string
  articleTitle?: string
  articleUrl?: string
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const { email, subject, content, articleTitle, articleUrl } = data

    let emailContent = `
      <h2>Weekly Insight: ${articleTitle || subject}</h2>
      <div style="margin: 20px 0;">
        ${content}
      </div>
    `

    if (articleUrl) {
      emailContent += `
        <div style="margin: 30px 0; text-align: center;">
          <a href="${articleUrl}" class="cta-button">Read Full Article</a>
        </div>
      `
    }

    emailContent += `
      <div style="margin: 30px 0; padding: 20px; background: #f8f9fa; border-radius: 6px;">
        <h3>What's Next?</h3>
        <p>Continue your journey of intentional living with more insights from LATE.</p>
        <p><a href="https://late.ltd/newsletter" style="color: #6366f1;">Browse All Newsletter Articles</a></p>
      </div>
    `

    const htmlTemplate = await createEmailTemplate(subject, emailContent, "newsletter")
    return await sendEmail(email, subject, htmlTemplate)
  } catch (error) {
    console.error("Error sending newsletter email:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send newsletter email",
    }
  }
}

// Send blog notification
export async function sendBlogNotification(data: {
  email: string
  blogTitle: string
  blogUrl: string
  excerpt?: string
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const { email, blogTitle, blogUrl, excerpt } = data
    const subject = `New Blog Post: ${blogTitle}`

    let emailContent = `
      <h2>New Blog Post Published</h2>
      <h3>${blogTitle}</h3>
    `

    if (excerpt) {
      emailContent += `
        <p style="font-style: italic; color: #6c757d; margin: 20px 0;">
          ${excerpt}
        </p>
      `
    }

    emailContent += `
      <div style="margin: 30px 0; text-align: center;">
        <a href="${blogUrl}" class="cta-button">Read Full Post</a>
      </div>
      
      <div style="margin: 30px 0; padding: 20px; background: #f8f9fa; border-radius: 6px;">
        <h3>Stay Connected</h3>
        <p>Don't miss our latest insights on productivity and time management.</p>
        <p><a href="https://late.ltd/blog" style="color: #6366f1;">Browse All Blog Posts</a></p>
      </div>
    `

    const htmlTemplate = await createEmailTemplate(subject, emailContent, "notification")
    return await sendEmail(email, subject, htmlTemplate)
  } catch (error) {
    console.error("Error sending blog notification:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send blog notification",
    }
  }
}

// Send test email
export async function sendTestEmail(data: {
  email: string
  testType?: string
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const { email, testType = "general" } = data
    const subject = "LATE Email System Test"

    const emailContent = `
      <h2>Email System Test</h2>
      <p>This is a test email to verify that the LATE email automation system is working correctly.</p>
      
      <div style="margin: 20px 0; padding: 15px; background: #e8f5e8; border-radius: 6px; border-left: 4px solid #28a745;">
        <strong>Test Type:</strong> ${testType}<br>
        <strong>Sent At:</strong> ${new Date().toISOString()}<br>
        <strong>System Status:</strong> ✅ Operational
      </div>
      
      <p>If you received this email, the system is functioning properly.</p>
      
      <div style="margin: 30px 0; text-align: center;">
        <a href="https://late.ltd" class="cta-button">Visit LATE Website</a>
      </div>
    `

    const htmlTemplate = await createEmailTemplate(subject, emailContent, "test")
    return await sendEmail(email, subject, htmlTemplate)
  } catch (error) {
    console.error("Error sending test email:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send test email",
    }
  }
}

// Get subscriber statistics
export async function getSubscriberStats(): Promise<{
  success: boolean
  stats?: {
    totalSubscribers: number
    activeSubscribers: number
    recentSignups: number
    engagementRate: number
  }
  error?: string
}> {
  try {
    // In a real implementation, you would query your database
    // For now, we'll return mock data
    const stats = {
      totalSubscribers: 1247,
      activeSubscribers: 1156,
      recentSignups: 23,
      engagementRate: 0.68,
    }

    return {
      success: true,
      stats,
    }
  } catch (error) {
    console.error("Error getting subscriber stats:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get subscriber stats",
    }
  }
}

// Utility function to validate email addresses
export async function isValidEmail(email: string): Promise<boolean> {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Utility function to sanitize HTML content
export async function sanitizeHtml(html: string): Promise<string> {
  // Basic HTML sanitization - in production, use a proper library like DOMPurify
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/on\w+="[^"]*"/gi, "")
}
