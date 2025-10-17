"use server"

import { addSubscriber, addComment, addContactSubmission, isSupabaseConfigured } from "@/lib/supabase"
import { sendMicrosoftGraphEmail } from "@/lib/microsoft-graph"

export interface EmailResult {
  success: boolean
  message: string
  error?: string
}

const ADMIN_EMAIL = "team@late.ltd"

// Newsletter subscription
export async function subscribeToNewsletter(formData: FormData): Promise<EmailResult> {
  try {
    const email = formData.get("email") as string

    if (!email || !email.includes("@")) {
      return { success: false, message: "Please provide a valid email address" }
    }

    if (!isSupabaseConfigured()) {
      console.warn("Supabase not configured - subscription not saved")
      return {
        success: false,
        message: "Database not configured. Please contact support.",
        error: "SUPABASE_NOT_CONFIGURED",
      }
    }

    // Add to database
    const dbResult = await addSubscriber(email, "newsletter")
    if (!dbResult.success) {
      return { success: false, message: dbResult.error || "Failed to subscribe" }
    }

    // Send confirmation email
    try {
      await sendMicrosoftGraphEmail({
        to: email,
        subject: "Welcome to the Inner Circle",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Thank you for subscribing to the LATE newsletter.</h2>
            <p>You're now signed up to receive our weekly insights, stories, and updates directly in your inbox.</p>
            <p><strong>Stay Late.</strong><br>The best things are always worth the wait ;)</p>
            <p>– The LATE Team</p>
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
            <p style="font-size: 12px; color: #666;">
              Want to change how you receive these emails? 
              <a href="${process.env.NEXT_PUBLIC_BASE_URL || "https://lateisgreat.com"}/unsubscribe?email=${encodeURIComponent(email)}">Unsubscribe from this list</a>
            </p>
          </div>
        `,
      })
    } catch (emailError) {
      console.error("Email sending failed:", emailError)
      // Don't fail the subscription if email fails
    }

    // Send admin notification
    try {
      const adminEmail = process.env.MICROSOFT_SENDER_EMAIL || "insidelate@gmail.com"
      await sendMicrosoftGraphEmail({
        to: adminEmail,
        subject: "New Newsletter Subscriber",
        html: `
          <div style="font-family: Arial, sans-serif;">
            <h3>New Newsletter Subscription</h3>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          </div>
        `,
      })
    } catch (adminEmailError) {
      console.error("Admin notification failed:", adminEmailError)
    }

    return { success: true, message: "Successfully subscribed to newsletter!" }
  } catch (error) {
    console.error("Newsletter subscription error:", error)
    return {
      success: false,
      message: "An error occurred. Please try again.",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

// Shop waitlist subscription
export async function subscribeToShopWaitlist(formData: FormData): Promise<EmailResult> {
  try {
    const email = formData.get("email") as string

    if (!email || !email.includes("@")) {
      return { success: false, message: "Please provide a valid email address" }
    }

    if (!isSupabaseConfigured()) {
      console.warn("Supabase not configured - subscription not saved")
      return {
        success: false,
        message: "Database not configured. Please contact support.",
        error: "SUPABASE_NOT_CONFIGURED",
      }
    }

    const dbResult = await addSubscriber(email, "shop")
    if (!dbResult.success) {
      return { success: false, message: dbResult.error || "Failed to join waitlist" }
    }

    try {
      await sendMicrosoftGraphEmail({
        to: email,
        subject: "You're on the List for The Age of Late",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Thank you for your interest!</h2>
            <p>You've been added to our exclusive waitlist and will be the first to know when our new collection drops.</p>
            <p><strong>Stay Late.</strong><br>The best things are always worth the wait ;)</p>
            <p>– The LATE Team</p>
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
            <p style="font-size: 12px; color: #666;">
              <a href="${process.env.NEXT_PUBLIC_BASE_URL || "https://lateisgreat.com"}/unsubscribe?email=${encodeURIComponent(email)}">Unsubscribe from this list</a>
            </p>
          </div>
        `,
      })
    } catch (emailError) {
      console.error("Email sending failed:", emailError)
    }

    try {
      const adminEmail = process.env.MICROSOFT_SENDER_EMAIL || "insidelate@gmail.com"
      await sendMicrosoftGraphEmail({
        to: adminEmail,
        subject: "New Shop Waitlist Signup",
        html: `
          <div style="font-family: Arial, sans-serif;">
            <h3>New Shop Waitlist Signup</h3>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          </div>
        `,
      })
    } catch (adminEmailError) {
      console.error("Admin notification failed:", adminEmailError)
    }

    return { success: true, message: "Successfully joined the waitlist!" }
  } catch (error) {
    console.error("Shop waitlist error:", error)
    return {
      success: false,
      message: "An error occurred. Please try again.",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

// Podcast subscription
export async function subscribeToPodcast(formData: FormData): Promise<EmailResult> {
  try {
    const email = formData.get("email") as string

    if (!email || !email.includes("@")) {
      return { success: false, message: "Please provide a valid email address" }
    }

    if (!isSupabaseConfigured()) {
      console.warn("Supabase not configured - subscription not saved")
      return {
        success: false,
        message: "Database not configured. Please contact support.",
        error: "SUPABASE_NOT_CONFIGURED",
      }
    }

    const dbResult = await addSubscriber(email, "podcast")
    if (!dbResult.success) {
      return { success: false, message: dbResult.error || "Failed to subscribe" }
    }

    try {
      await sendMicrosoftGraphEmail({
        to: email,
        subject: "Get Ready to Listen",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Thanks for signing up!</h2>
            <p>We'll send you a notification as soon as our first episodes of 'Left Righteously' are released. Prepare for a thought-provoking listen.</p>
            <p><strong>Stay Late.</strong><br>The best things are always worth the wait ;)</p>
            <p>– The LATE Team</p>
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
            <p style="font-size: 12px; color: #666;">
              <a href="${process.env.NEXT_PUBLIC_BASE_URL || "https://lateisgreat.com"}/unsubscribe?email=${encodeURIComponent(email)}">Unsubscribe from this list</a>
            </p>
          </div>
        `,
      })
    } catch (emailError) {
      console.error("Email sending failed:", emailError)
    }

    try {
      const adminEmail = process.env.MICROSOFT_SENDER_EMAIL || "insidelate@gmail.com"
      await sendMicrosoftGraphEmail({
        to: adminEmail,
        subject: "New Podcast Subscriber",
        html: `
          <div style="font-family: Arial, sans-serif;">
            <h3>New Podcast Subscription</h3>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          </div>
        `,
      })
    } catch (adminEmailError) {
      console.error("Admin notification failed:", adminEmailError)
    }

    return { success: true, message: "Successfully subscribed to podcast updates!" }
  } catch (error) {
    console.error("Podcast subscription error:", error)
    return {
      success: false,
      message: "An error occurred. Please try again.",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

// Auction collector subscription
export async function subscribeToAuctionCollector(formData: FormData): Promise<EmailResult> {
  try {
    const email = formData.get("email") as string

    if (!email || !email.includes("@")) {
      return { success: false, message: "Please provide a valid email address" }
    }

    if (!isSupabaseConfigured()) {
      console.warn("Supabase not configured - subscription not saved")
      return {
        success: false,
        message: "Database not configured. Please contact support.",
        error: "SUPABASE_NOT_CONFIGURED",
      }
    }

    const dbResult = await addSubscriber(email, "auction-collector")
    if (!dbResult.success) {
      return { success: false, message: dbResult.error || "Failed to join waitlist" }
    }

    try {
      await sendMicrosoftGraphEmail({
        to: email,
        subject: "Welcome to The LATE Auction Waitlist",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>You're on the list!</h2>
            <p>Thank you for joining the LATE Auction Waitlist. You'll receive an exclusive early access link before our next auction goes live.</p>
            <p><strong>Stay Late.</strong><br>The best things are always worth the wait ;)</p>
            <p>– The LATE Team</p>
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
            <p style="font-size: 12px; color: #666;">
              <a href="${process.env.NEXT_PUBLIC_BASE_URL || "https://lateisgreat.com"}/unsubscribe?email=${encodeURIComponent(email)}">Unsubscribe from this list</a>
            </p>
          </div>
        `,
      })
    } catch (emailError) {
      console.error("Email sending failed:", emailError)
    }

    try {
      const adminEmail = process.env.MICROSOFT_SENDER_EMAIL || "insidelate@gmail.com"
      await sendMicrosoftGraphEmail({
        to: adminEmail,
        subject: "New Auction Collector Signup",
        html: `
          <div style="font-family: Arial, sans-serif;">
            <h3>New Auction Collector Signup</h3>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          </div>
        `,
      })
    } catch (adminEmailError) {
      console.error("Admin notification failed:", adminEmailError)
    }

    return { success: true, message: "Successfully joined the auction waitlist!" }
  } catch (error) {
    console.error("Auction collector error:", error)
    return {
      success: false,
      message: "An error occurred. Please try again.",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

// Auction creator subscription
export async function subscribeToAuctionCreator(formData: FormData): Promise<EmailResult> {
  try {
    const email = formData.get("email") as string
    const name = formData.get("name") as string
    const instagram = formData.get("instagram") as string
    const portfolio = formData.get("portfolio") as string

    if (!email || !email.includes("@")) {
      return { success: false, message: "Please provide a valid email address" }
    }

    if (!isSupabaseConfigured()) {
      console.warn("Supabase not configured - application not saved")
      return {
        success: false,
        message: "Database not configured. Please contact support.",
        error: "SUPABASE_NOT_CONFIGURED",
      }
    }

    const dbResult = await addSubscriber(email, "auction-creator", { name, instagram, portfolio })
    if (!dbResult.success) {
      return { success: false, message: dbResult.error || "Failed to submit application" }
    }

    try {
      await sendMicrosoftGraphEmail({
        to: email,
        subject: "Your LATE Auction Application is Received",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Thank you for your application!</h2>
            <p>We appreciate your interest in collaborating with us. Our team is reviewing your submission and will be in touch soon.</p>
            <p><strong>Stay Late.</strong><br>The best things are always worth the wait ;)</p>
            <p>– The LATE Team</p>
          </div>
        `,
      })
    } catch (emailError) {
      console.error("Email sending failed:", emailError)
    }

    try {
      const adminEmail = process.env.MICROSOFT_SENDER_EMAIL || "insidelate@gmail.com"
      await sendMicrosoftGraphEmail({
        to: adminEmail,
        subject: "New Auction Creator Application",
        html: `
          <div style="font-family: Arial, sans-serif;">
            <h3>New Auction Creator Application</h3>
            <p><strong>Name:</strong> ${name || "Not provided"}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Instagram:</strong> ${instagram || "Not provided"}</p>
            <p><strong>Portfolio:</strong> ${portfolio || "Not provided"}</p>
            <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          </div>
        `,
      })
    } catch (adminEmailError) {
      console.error("Admin notification failed:", adminEmailError)
    }

    return { success: true, message: "Application submitted successfully!" }
  } catch (error) {
    console.error("Auction creator error:", error)
    return {
      success: false,
      message: "An error occurred. Please try again.",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

// Contact form submission
export async function handleContactForm(formData: FormData): Promise<EmailResult> {
  try {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const message = formData.get("message") as string

    if (!email || !email.includes("@")) {
      return { success: false, message: "Please provide a valid email address" }
    }

    if (!name || !message) {
      return { success: false, message: "Please fill in all fields" }
    }

    if (!isSupabaseConfigured()) {
      console.warn("Supabase not configured - contact form not saved")
      return {
        success: false,
        message: "Database not configured. Please contact support.",
        error: "SUPABASE_NOT_CONFIGURED",
      }
    }

    const dbResult = await addContactSubmission(name, email, message)
    if (!dbResult.success) {
      return { success: false, message: dbResult.error || "Failed to submit message" }
    }

    try {
      await sendMicrosoftGraphEmail({
        to: email,
        subject: "We've Received Your Message",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Thank you for reaching out to LATE.</h2>
            <p>We appreciate you getting in touch and will respond as soon as possible.</p>
            <p><strong>Stay Late.</strong><br>The best things are always worth the wait ;)</p>
            <p>– The LATE Team</p>
          </div>
        `,
      })
    } catch (emailError) {
      console.error("Email sending failed:", emailError)
    }

    try {
      const adminEmail = process.env.MICROSOFT_SENDER_EMAIL || "insidelate@gmail.com"
      await sendMicrosoftGraphEmail({
        to: adminEmail,
        subject: "New Contact Form Submission",
        html: `
          <div style="font-family: Arial, sans-serif;">
            <h3>New Contact Form Submission</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
            <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          </div>
        `,
      })
    } catch (adminEmailError) {
      console.error("Admin notification failed:", adminEmailError)
    }

    return { success: true, message: "Message sent successfully!" }
  } catch (error) {
    console.error("Contact form error:", error)
    return {
      success: false,
      message: "An error occurred. Please try again.",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

// Comment submission
export async function submitComment(
  articleSlug: string,
  commenterName: string,
  commenterEmail: string,
  commentText: string,
): Promise<EmailResult> {
  try {
    if (!commenterEmail || !commenterEmail.includes("@")) {
      return { success: false, message: "Please provide a valid email address" }
    }

    if (!commenterName || !commentText) {
      return { success: false, message: "Please fill in all fields" }
    }

    if (!isSupabaseConfigured()) {
      console.warn("Supabase not configured - comment not saved")
      return {
        success: false,
        message: "Database not configured. Please contact support.",
        error: "SUPABASE_NOT_CONFIGURED",
      }
    }

    const dbResult = await addComment(articleSlug, commenterName, commenterEmail, commentText)
    if (!dbResult.success) {
      return { success: false, message: dbResult.error || "Failed to post comment" }
    }

    try {
      await sendMicrosoftGraphEmail({
        to: commenterEmail,
        subject: "Thank You for Your Comment",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Thank you for your comment, ${commenterName}!</h2>
            <p>We appreciate you taking the time to share your thoughts with us.</p>
            <p>If you'd like to stay updated with our latest insights, consider subscribing to our newsletter.</p>
            <p><strong>Stay Late.</strong><br>The best things are always worth the wait ;)</p>
            <p>– The LATE Team</p>
          </div>
        `,
      })
    } catch (emailError) {
      console.error("Email sending failed:", emailError)
    }

    try {
      const adminEmail = process.env.MICROSOFT_SENDER_EMAIL || "insidelate@gmail.com"
      await sendMicrosoftGraphEmail({
        to: adminEmail,
        subject: "New Comment Posted",
        html: `
          <div style="font-family: Arial, sans-serif;">
            <h3>New Comment on ${articleSlug}</h3>
            <p><strong>Name:</strong> ${commenterName}</p>
            <p><strong>Email:</strong> ${commenterEmail}</p>
            <p><strong>Comment:</strong></p>
            <p>${commentText}</p>
            <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          </div>
        `,
      })
    } catch (adminEmailError) {
      console.error("Admin notification failed:", adminEmailError)
    }

    return { success: true, message: "Comment posted successfully!" }
  } catch (error) {
    console.error("Comment submission error:", error)
    return {
      success: false,
      message: "An error occurred. Please try again.",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

// Aliases for backward compatibility
export const handleNewsletterSubscription = subscribeToNewsletter
export const subscribeToShopUpdates = subscribeToShopWaitlist
export const sendContactEmail = handleContactForm
export const sendNewsletterSignup = subscribeToNewsletter
export const handleFormSubmission = subscribeToNewsletter
export const sendCommentNotification = submitComment
