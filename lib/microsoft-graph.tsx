"use server"

import { Client } from "@microsoft/microsoft-graph-client"
import "isomorphic-fetch"

interface EmailParams {
  to: string
  subject: string
  body: string
}

interface EmailResult {
  success: boolean
  error?: string
  messageId?: string
}

async function getAccessToken(): Promise<string> {
  const tokenEndpoint = `https://login.microsoftonline.com/${process.env.MICROSOFT_TENANT_ID}/oauth2/v2.0/token`

  const params = new URLSearchParams({
    client_id: process.env.MICROSOFT_CLIENT_ID || "",
    client_secret: process.env.MICROSOFT_CLIENT_SECRET || "",
    scope: "https://graph.microsoft.com/.default",
    grant_type: "client_credentials",
  })

  const response = await fetch(tokenEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  })

  if (!response.ok) {
    throw new Error(`Failed to get access token: ${response.statusText}`)
  }

  const data = await response.json()
  return data.access_token
}

function getGraphClient(accessToken: string): Client {
  return Client.init({
    authProvider: (done) => {
      done(null, accessToken)
    },
  })
}

export async function sendMicrosoftGraphEmail(params: EmailParams): Promise<EmailResult> {
  try {
    const { to, subject, body } = params
    const accessToken = await getAccessToken()
    const client = getGraphClient(accessToken)

    const senderEmail = process.env.MICROSOFT_SENDER_EMAIL

    if (!senderEmail) {
      throw new Error("MICROSOFT_SENDER_EMAIL environment variable is not set")
    }

    const message = {
      message: {
        subject: subject,
        body: {
          contentType: "HTML",
          content: body,
        },
        toRecipients: [
          {
            emailAddress: {
              address: to,
            },
          },
        ],
      },
      saveToSentItems: "true",
    }

    await client.api(`/users/${senderEmail}/sendMail`).post(message)

    console.log(`Email sent successfully to ${to}`)
    return { success: true }
  } catch (error) {
    console.error("Error sending email via Microsoft Graph:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function createEmailTemplate(title: string, content: string): Promise<string> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
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
                ${title}
              </h2>
              <div style="color: #374151; font-size: 16px; line-height: 1.6;">
                ${content}
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px 40px; background-color: #f9fafb; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px; color: #6b7280; font-size: 13px; text-align: center; line-height: 1.5;">
                <strong>Late</strong> - Own Your Time<br>
                Helping you make the most of every moment
              </p>
              <p style="margin: 10px 0 0; color: #9ca3af; font-size: 12px; text-align: center;">
                <a href="${siteUrl}" style="color: #9ca3af; text-decoration: underline;">Visit Our Website</a>
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
}
