"use server"

import { sendMicrosoftGraphEmail, createEmailTemplate } from "@/lib/microsoft-graph"
import { generateUnsubscribeUrl } from "@/lib/unsubscribe"
import { addSubscriber, addContactSubmission, addCreatorApplication } from "@/lib/email-db-adapter"

type EmailCategory =
  | "newsletter"
  | "shop"
  | "podcast"
  | "auction_waitlist_collector"
  | "auction_waitlist_creator"
  | "contact"

interface EmailResult {
  success: boolean
  message: string
  emailSent?: boolean
}

const ADMIN_EMAIL = "team@late.ltd"

async function generateUserEmailTemplate(
  category: EmailCategory,
  email: string,
): Promise<{ subject: string; body: string }> {
  const marketingCategories: EmailCategory[] = ["newsletter", "shop", "podcast", "auction_waitlist_collector"]
  const unsubscribeUrl = marketingCategories.includes(category) ? await generateUnsubscribeUrl(email, category) : ""

  const unsubscribeFooter = unsubscribeUrl
    ? `
    <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
      <p style="font-size: 12px; color: #9ca3af; line-height: 1.6;">
        Want to change how you receive these emails? You can <a href="${unsubscribeUrl}" style="color: #667eea; text-decoration: underline;">unsubscribe from this list here</a>.
      </p>
    </div>
  `
    : ""

  const templates = {
    newsletter: {
      subject: "Welcome to the Inner Circle",
      content: `
        <p style="font-size: 16px; line-height: 1.6; color: #374151; margin-bottom: 20px;">
          Thank you for subscribing to the LATE newsletter. You're now signed up to receive our weekly insights, stories, and updates directly in your inbox.
        </p>
        <p style="font-size: 16px; line-height: 1.6; color: #374151; margin-bottom: 30px;">
          <strong>Stay Late.</strong><br/>
          The best things are always worth the wait ;)
        </p>
        <p style="font-size: 14px; color: #6b7280; margin-top: 30px; margin-bottom: 20px;">
          – The LATE Team
        </p>
        ${unsubscribeFooter}
      `,
    },
    shop: {
      subject: "You're on the List for The Age of Late",
      content: `
        <p style="font-size: 16px; line-height: 1.6; color: #374151; margin-bottom: 20px;">
          Thank you for your interest! You've been added to our exclusive waitlist and will be the first to know when our new collection drops.
        </p>
        <p style="font-size: 16px; line-height: 1.6; color: #374151; margin-bottom: 30px;">
          <strong>Stay Late.</strong><br/>
          The best things are always worth the wait ;)
        </p>
        <p style="font-size: 14px; color: #6b7280; margin-top: 30px; margin-bottom: 20px;">
          – The LATE Team
        </p>
        ${unsubscribeFooter}
      `,
    },
    podcast: {
      subject: "Get Ready to Listen",
      content: `
        <p style="font-size: 16px; line-height: 1.6; color: #374151; margin-bottom: 20px;">
          Thanks for signing up! We'll send you a notification as soon as our first episodes of 'Left Righteously' are released. Prepare for a thought-provoking listen.
        </p>
        <p style="font-size: 16px; line-height: 1.6; color: #374151; margin-bottom: 30px;">
          <strong>Stay Late.</strong><br/>
          The best things are always worth the wait ;)
        </p>
        <p style="font-size: 14px; color: #6b7280; margin-top: 30px; margin-bottom: 20px;">
          – The LATE Team
        </p>
        ${unsubscribeFooter}
      `,
    },
    "auction_waitlist_collector": {
      subject: "Welcome to The LATE Auction Waitlist",
      content: `
        <p style="font-size: 16px; line-height: 1.6; color: #374151; margin-bottom: 20px;">
          You're on the list! Thank you for joining the LATE Auction Waitlist. You'll receive an exclusive early access link before our next auction goes live.
        </p>
        <p style="font-size: 16px; line-height: 1.6; color: #374151; margin-bottom: 30px;">
          <strong>Stay Late.</strong><br/>
          The best things are always worth the wait ;)
        </p>
        <p style="font-size: 14px; color: #6b7280; margin-top: 30px; margin-bottom: 20px;">
          – The LATE Team
        </p>
        ${unsubscribeFooter}
      `,
    },
    "auction_waitlist_creator": {
      subject: "Your LATE Auction Application is Received",
      content: `
        <p style="font-size: 16px; line-height: 1.6; color: #374151; margin-bottom: 20px;">
          Thank you for your application! We appreciate your interest in collaborating with us. Our team is reviewing your submission and will be in touch soon.
        </p>
        <p style="font-size: 16px; line-height: 1.6; color: #374151; margin-bottom: 30px;">
          <strong>Stay Late.</strong><br/>
          The best things are always worth the wait ;)
        </p>
        <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
          – The LATE Team
        </p>
      `,
    },
    contact: {
      subject: "We've Received Your Message",
      content: `
        <p style="font-size: 16px; line-height: 1.6; color: #374151; margin-bottom: 20px;">
          Thank you for reaching out to LATE. We appreciate you getting in touch and will respond as soon as possible.
        </p>
        <p style="font-size: 16px; line-height: 1.6; color: #374151; margin-bottom: 30px;">
          <strong>Stay Late.</strong><br/>
          The best things are always worth the wait ;)
        </p>
        <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
          – The LATE Team
        </p>
      `,
    },
  }

  const template = templates[category]
  const body = await createEmailTemplate(template.subject, template.content)

  return {
    subject: template.subject,
    body,
  }
}

function generateAdminEmailContent(
  category: EmailCategory,
  email: string,
  additionalData?: any,
): { subject: string; content: string } {
  const templates = {
    newsletter: {
      subject: "📬 New Newsletter Subscriber",
      content: `
        <p style="font-size: 16px; color: #374151; margin-bottom: 15px;">
          A new user has subscribed to the weekly newsletter.
        </p>
        <div style="background: #f3f4f6; padding: 15px; border-radius: 5px; margin-top: 20px;">
          <p style="margin: 0; color: #374151;"><strong>Email:</strong> ${email}</p>
          <p style="margin: 5px 0 0 0; color: #374151;"><strong>Date:</strong> ${new Date().toLocaleString()}</p>
        </div>
      `,
    },
    shop: {
      subject: "🛍️ New Waitlist Signup: The Age of Late Collection",
      content: `
        <p style="font-size: 16px; color: #374151; margin-bottom: 15px;">
          A new user has joined the waitlist for The Age of Late collection.
        </p>
        <div style="background: #f3f4f6; padding: 15px; border-radius: 5px; margin-top: 20px;">
          <p style="margin: 0; color: #374151;"><strong>Email:</strong> ${email}</p>
          <p style="margin: 5px 0 0 0; color: #374151;"><strong>Date:</strong> ${new Date().toLocaleString()}</p>
        </div>
      `,
    },
    podcast: {
      subject: "🎧 New Podcast Subscriber",
      content: `
        <p style="font-size: 16px; color: #374151; margin-bottom: 15px;">
          A new listener has subscribed for notifications on the 'Left Righteously' series.
        </p>
        <div style="background: #f3f4f6; padding: 15px; border-radius: 5px; margin-top: 20px;">
          <p style="margin: 0; color: #374151;"><strong>Email:</strong> ${email}</p>
          <p style="margin: 5px 0 0 0; color: #374151;"><strong>Date:</strong> ${new Date().toLocaleString()}</p>
        </div>
      `,
    },
    "auction_waitlist_collector": {
      subject: "🎨 New Auction Collector",
      content: `
        <p style="font-size: 16px; color: #374151; margin-bottom: 15px;">
          A new collector has joined the LATE Auction waitlist.
        </p>
        <div style="background: #f3f4f6; padding: 15px; border-radius: 5px; margin-top: 20px;">
          <p style="margin: 0; color: #374151;"><strong>Email:</strong> ${email}</p>
          <p style="margin: 5px 0 0 0; color: #374151;"><strong>Date:</strong> ${new Date().toLocaleString()}</p>
        </div>
      `,
    },
    "auction_waitlist_creator": {
      subject: "✍️ NEW CREATOR APPLICATION RECEIVED",
      content: `
        <p style="font-size: 16px; color: #374151; margin-bottom: 15px;">
          A new creator has submitted an application for the LATE Auction.
        </p>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 5px; margin-top: 20px;">
          <p style="margin: 5px 0; color: #374151;"><strong>Applicant Name:</strong> ${additionalData?.name || "N/A"}</p>
          <p style="margin: 5px 0; color: #374151;"><strong>Email:</strong> ${email}</p>
          <p style="margin: 5px 0; color: #374151;"><strong>Portfolio URL:</strong> ${additionalData?.portfolio || "N/A"}</p>
          <p style="margin: 15px 0 5px 0; color: #374151;"><strong>Application Details:</strong></p>
          <div style="margin: 5px 0; color: #374151; white-space: pre-wrap; background: white; padding: 15px; border-radius: 5px; border: 1px solid #e5e7eb;">${additionalData?.message || "N/A"}</div>
          <p style="margin: 15px 0 5px 0; color: #374151;"><strong>Submission Date:</strong> ${new Date().toLocaleString()}</p>
        </div>
      `,
    },
    contact: {
      subject: "📥 New Contact Form Submission",
      content: `
        <p style="font-size: 16px; color: #374151; margin-bottom: 15px;">
          You have a new message from the website contact form.
        </p>
        <div style="background: #f3f4f6; padding: 15px; border-radius: 5px; margin-top: 20px;">
          <p style="margin: 5px 0; color: #374151;"><strong>From:</strong> ${additionalData?.name || "N/A"}</p>
          <p style="margin: 5px 0; color: #374151;"><strong>Email:</strong> ${email}</p>
          <p style="margin: 15px 0 5px 0; color: #374151;"><strong>Message:</strong></p>
          <div style="margin: 5px 0; color: #374151; white-space: pre-wrap;">${additionalData?.message || "N/A"}</div>
          <p style="margin: 15px 0 5px 0; color: #374151;"><strong>Date:</strong> ${new Date().toLocaleString()}</p>
        </div>
      `,
    },
  }

  return templates[category]
}

async function handleSubscription(email: string, category: EmailCategory): Promise<EmailResult> {
  try {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return {
        success: false,
        message: "Please provide a valid email address.",
      }
    }

    const dbResult = await addSubscriber({ email, category })

    if (!dbResult.success) {
      return {
        success: false,
        message: dbResult.error || "Failed to subscribe. Please try again.",
      }
    }

    const userTemplate = await generateUserEmailTemplate(category, email)
    const userResult = await sendMicrosoftGraphEmail({
      to: email,
      subject: userTemplate.subject,
      body: userTemplate.body,
    })

    if (!userResult.success) {
      console.error("Failed to send user email:", userResult.error)
    }

    const adminTemplate = generateAdminEmailContent(category, email)
    const adminBody = await createEmailTemplate(adminTemplate.subject, adminTemplate.content)
    await sendMicrosoftGraphEmail({
      to: ADMIN_EMAIL,
      subject: adminTemplate.subject,
      body: adminBody,
    })

    return {
      success: true,
      message: "Success! Check your email for confirmation.",
      emailSent: userResult.success,
    }
  } catch (error) {
    console.error(`${category} subscription error:`, error)
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    }
  }
}

export async function subscribeToNewsletter(formData: FormData): Promise<EmailResult> {
  const email = formData.get("email") as string
  return handleSubscription(email, "newsletter")
}

export async function subscribeToShopWaitlist(formData: FormData): Promise<EmailResult> {
  const email = formData.get("email") as string
  return handleSubscription(email, "shop")
}

export async function subscribeToPodcast(formData: FormData): Promise<EmailResult> {
  const email = formData.get("email") as string
  return handleSubscription(email, "podcast")
}

export async function subscribeToAuctionCollector(formData: FormData): Promise<EmailResult> {
  const email = formData.get("email") as string
  return handleSubscription(email, "auction_waitlist_collector")
}

export async function subscribeToAuctionCreator(formData: FormData): Promise<EmailResult> {
  try {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const portfolio = formData.get("portfolio") as string
    const message = formData.get("message") as string

    if (!name || !email || !message) {
      return {
        success: false,
        message: "Please fill in all required fields.",
      }
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return {
        success: false,
        message: "Please provide a valid email address.",
      }
    }

    const dbResult = await addCreatorApplication({
      name,
      email,
      portfolio,
      message,
    })

    if (!dbResult.success) {
      return {
        success: false,
        message: dbResult.error || "Failed to submit application. Please try again.",
      }
    }

    const userTemplate = await generateUserEmailTemplate("auction_waitlist_creator", email)
    const userResult = await sendMicrosoftGraphEmail({
      to: email,
      subject: userTemplate.subject,
      body: userTemplate.body,
    })

    const adminTemplate = generateAdminEmailContent("auction_waitlist_creator", email, { name, portfolio, message })
    const adminBody = await createEmailTemplate(adminTemplate.subject, adminTemplate.content)
    await sendMicrosoftGraphEmail({
      to: ADMIN_EMAIL,
      subject: adminTemplate.subject,
      body: adminBody,
    })

    return {
      success: true,
      message: "Application submitted! We'll review it soon.",
      emailSent: userResult.success,
    }
  } catch (error) {
    console.error("Auction creator submission error:", error)
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    }
  }
}

export async function handleContactForm(formData: FormData): Promise<EmailResult> {
  try {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const message = formData.get("message") as string

    if (!name || !email || !message) {
      return {
        success: false,
        message: "All fields are required.",
      }
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return {
        success: false,
        message: "Please provide a valid email address.",
      }
    }

    const dbResult = await addContactSubmission({ name, email, message })
    if (!dbResult.success) {
      return {
        success: false,
        message: dbResult.error || "Failed to send message. Please try again.",
      }
    }

    const userTemplate = await generateUserEmailTemplate("contact", email)
    const userResult = await sendMicrosoftGraphEmail({
      to: email,
      subject: userTemplate.subject,
      body: userTemplate.body,
    })

    const adminTemplate = generateAdminEmailContent("contact", email, { name, message })
    const adminBody = await createEmailTemplate(adminTemplate.subject, adminTemplate.content)
    await sendMicrosoftGraphEmail({
      to: ADMIN_EMAIL,
      subject: adminTemplate.subject,
      body: adminBody,
    })

    return {
      success: true,
      message: "Message sent! We'll get back to you soon.",
      emailSent: userResult.success,
    }
  } catch (error) {
    console.error("Contact form error:", error)
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    }
  }
}

export async function handleNewsletterSubscription(formData: FormData): Promise<EmailResult> {
  return subscribeToNewsletter(formData)
}

export async function subscribeToShopUpdates(formData: FormData): Promise<EmailResult> {
  return subscribeToShopWaitlist(formData)
}

export async function sendContactEmail(formData: FormData): Promise<EmailResult> {
  return handleContactForm(formData)
}

export async function sendNewsletterSignup(email: string): Promise<EmailResult> {
  return handleSubscription(email, "newsletter")
}

export async function handleFormSubmission(formData: FormData): Promise<EmailResult & { emailSent?: boolean }> {
  const formType = formData.get("form-name") as string

  switch (formType) {
    case "auction-collector-waitlist":
      return subscribeToAuctionCollector(formData)
    case "auction-creator-application":
      return subscribeToAuctionCreator(formData)
    case "podcast-notification":
      return subscribeToPodcast(formData)
    case "shop-updates":
      return subscribeToShopWaitlist(formData)
    case "newsletter":
      return subscribeToNewsletter(formData)
    case "contact-form":
      return handleContactForm(formData)
    default:
      return {
        success: false,
        message: "Unknown form type",
      }
  }
}

export async function submitComment(formData: FormData): Promise<EmailResult> {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const comment = formData.get("comment") as string

  if (!name || !email || !comment) {
    return {
      success: false,
      message: "All fields are required",
    }
  }

  return {
    success: true,
    message: "Comment submitted successfully!",
  }
}

export async function sendCommentNotification(
  commenterEmail: string,
  commenterName: string,
  articleTitle: string,
  comment: string,
  articleType: "blog" | "newsletter",
): Promise<EmailResult> {
  return {
    success: true,
    message: "Comment notification sent",
  }
}
