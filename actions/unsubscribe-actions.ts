"use server"

import { createServiceRoleClient } from "@/lib/supabase"

/**
 * Accepts either:
 *  - a raw unsubscribe_token stored on the subscriber row, or
 *  - a base64/base64url-encoded JSON token { email, category }
 */
export async function handleUnsubscribe(token: string) {
  const client = createServiceRoleClient()
  if (!client) {
    return { success: false, message: "Service is not configured" }
  }

  // 1) Try direct match against unsubscribe_token
  {
    const { data, error } = await client
      .from("subscribers")
      .select("id,email,category")
      .eq("unsubscribe_token", token)
      .maybeSingle()

    if (!error && data) {
      const { error: updErr } = await client
        .from("subscribers")
        .update({
          is_active: false,
          status: "unsubscribed",
          unsubscribe_token: null,
        })
        .eq("id", data.id)

      if (!updErr) {
        return { success: true, email: data.email, category: data.category }
      }
    }
  }

  // 2) Try to decode legacy base64/base64url payload
  try {
    const normalized = token.replace(/-/g, "+").replace(/_/g, "/")
    const json = Buffer.from(normalized, "base64").toString("utf8")
    const maybe = JSON.parse(json) as { email?: string; category?: string }

    if (maybe?.email && maybe?.category) {
      const { data, error } = await client
        .from("subscribers")
        .select("id,email,category")
        .eq("email", maybe.email.toLowerCase())
        .eq("category", maybe.category)
        .maybeSingle()

      if (!error && data) {
        const { error: updErr } = await client
          .from("subscribers")
          .update({
            is_active: false,
            status: "unsubscribed",
            unsubscribe_token: null,
          })
          .eq("id", data.id)

        if (!updErr) {
          return { success: true, email: data.email, category: data.category }
        }
      }
    }
  } catch {
    // ignore decode errors
  }

  return { success: false, message: "Invalid token format" }
}
