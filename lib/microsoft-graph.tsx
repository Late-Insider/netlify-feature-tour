"use server"

interface EmailParams {
  to: string
  subject: string
  body: string
}

interface EmailResult {
  success: boolean
  error?: string
}

export async function sendMicrosoftGraphEmail(params: EmailParams): Promise<EmailResult> {
  try {
    const { to, subject, body } = params

    const clientId = process.env.MICROSOFT_CLIENT_ID
    const clientSecret = process.env.MICROSOFT_CLIENT_SECRET
    const tenantId = process.env.MICROSOFT_TENANT_ID
    const senderEmail = process.env.MICROSOFT_SENDER_EMAIL

    if (!clientId || !clientSecret || !tenantId || !senderEmail) {
      console.error("Missing Microsoft Graph configuration")
      return { success: false, error: "Email configuration not set up" }
    }

    // Get access token
    const tokenResponse = await fetch(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        scope: "https://graph.microsoft.com/.default",
        grant_type: "client_credentials",
      }),
    })

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      console.error("Failed to get access token:", errorText)
      return { success: false, error: "Authentication failed" }
    }

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token

    // Send email
    const emailResponse = await fetch(`https://graph.microsoft.com/v1.0/users/${senderEmail}/sendMail`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
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
        saveToSentItems: true,
      }),
    })

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text()
      console.error("Failed to send email:", errorText)
      return { success: false, error: "Failed to send email" }
    }

    return { success: true }
  } catch (error) {
    console.error("Error sending email:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function createEmailTemplate(title: string, content: string): Promise<string> {
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
              <h2 style="margin: 0 0 20px; color: #111827; font-size: 24px; font-weight: bold;">${title}</h2>
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

// Backward compatibility alias
export const sendMicrosoftEmail = sendMicrosoftGraphEmail
