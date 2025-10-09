"use server"

import { createClient } from "@/lib/supabase"

interface UnsubscribeData {
  email: string
  category: string
  timestamp: number
}

/**
 * Generate a secure unsubscribe token (server-side only)
 */
export async function generateUnsubscribeToken(email: string, category: string): Promise<string> {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  const data = `${email}:${category}:${timestamp}`
  return `${Buffer.from(data).toString("base64")}_${random}`
}

/**
 * Verify and decode an unsubscribe token (server-side only)
 */
export async function verifyUnsubscribeToken(token: string): Promise<{
  valid: boolean
  data?: UnsubscribeData
  error?: string
}> {
  try {
    const [payload, random] = token.split("_")

    if (!payload || !random) {
      return { valid: false, error: "Invalid token format" }
    }

    // Decode payload
    const dataStr = Buffer.from(payload, "base64").toString()
    const [email, category, timestampStr] = dataStr.split(":")
    const timestamp = Number.parseInt(timestampStr, 10)

    if (!email || !category || !timestamp) {
      return { valid: false, error: "Invalid token data" }
    }

    // Check if token is not too old (30 days)
    const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000
    if (Date.now() - timestamp > thirtyDaysInMs) {
      return { valid: false, error: "Token expired" }
    }

    return {
      valid: true,
      data: { email, category, timestamp },
    }
  } catch (error) {
    console.error("Error verifying token:", error)
    return { valid: false, error: "Failed to verify token" }
  }
}

/**
 * Generate an unsubscribe URL (server-side only)
 */
export async function generateUnsubscribeUrl(email: string, source: string): Promise<string> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  const token = Buffer.from(`${email}:${source}:${Date.now()}`).toString("base64")
  return `${baseUrl}/unsubscribe?token=${encodeURIComponent(token)}`
}

/**
 * Process an unsubscribe request (server-side only)
 */
export async function processUnsubscribe(token: string): Promise<{
  success: boolean
  message: string
  email?: string
  category?: string
}> {
  const verification = await verifyUnsubscribeToken(token)

  if (!verification.valid || !verification.data) {
    return {
      success: false,
      message: verification.error || "Invalid unsubscribe link",
    }
  }

  const { email, category } = verification.data

  try {
    const supabase = createClient()

    // Update the subscriber record
    const { error } = await supabase
      .from("subscribers")
      .update({
        subscribed: false,
        unsubscribed_at: new Date().toISOString(),
      })
      .eq("email", email)
      .eq("category", category)

    if (error) {
      console.error("Database error during unsubscribe:", error)
      return {
        success: false,
        message: "Failed to unsubscribe. Please try again.",
      }
    }

    return {
      success: true,
      message: "You have been successfully unsubscribed",
      email,
      category,
    }
  } catch (error) {
    console.error("Error processing unsubscribe:", error)
    return {
      success: false,
      message: "An error occurred while processing your request",
    }
  }
}

/**
 * Unsubscribe a user directly (server-side only)
 */
export async function unsubscribeUser(token: string): Promise<{ success: boolean; message: string }> {
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8")
    const [email] = decoded.split(":")

    if (!email) {
      return { success: false, message: "Invalid unsubscribe token" }
    }

    const supabase = createClient()

    const { error } = await supabase.from("subscribers").update({ is_active: false }).eq("email", email)

    if (error) {
      console.error("Error unsubscribing user:", error)
      return { success: false, message: "Failed to unsubscribe" }
    }

    return { success: true, message: "Successfully unsubscribed" }
  } catch (error) {
    console.error("Error processing unsubscribe:", error)
    return { success: false, message: "An error occurred" }
  }
}
