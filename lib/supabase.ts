import { createClient as createSupabaseClient } from "@supabase/supabase-js"

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Lazy initialization
let supabaseClient: ReturnType<typeof createSupabaseClient> | null = null

function getSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase environment variables not configured")
    return null
  }

  if (!supabaseClient) {
    supabaseClient = createSupabaseClient(supabaseUrl, supabaseAnonKey)
  }

  return supabaseClient
}

// Check if Supabase is configured
export function isSupabaseConfigured(): boolean {
  return !!(supabaseUrl && supabaseAnonKey)
}

// Database operations
export async function addSubscriber(
  email: string,
  category: string,
  metadata?: Record<string, any>,
): Promise<{ success: boolean; error?: string }> {
  const client = getSupabaseClient()
  if (!client) {
    return { success: false, error: "Supabase not configured" }
  }

  try {
    const { error } = await client.from("subscribers").insert({
      email,
      category,
      metadata,
      subscribed_at: new Date().toISOString(),
    })

    if (error) {
      // If duplicate, consider it a success
      if (error.code === "23505") {
        return { success: true }
      }
      console.error("Supabase insert error:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error adding subscriber:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function addContactSubmission(
  name: string,
  email: string,
  message: string,
): Promise<{ success: boolean; error?: string }> {
  const client = getSupabaseClient()
  if (!client) {
    return { success: false, error: "Supabase not configured" }
  }

  try {
    const { error } = await client.from("contact_submissions").insert({
      name,
      email,
      message,
      submitted_at: new Date().toISOString(),
    })

    if (error) {
      console.error("Supabase insert error:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error adding contact submission:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function addComment(
  articleSlug: string,
  name: string,
  email: string,
  comment: string,
): Promise<{ success: boolean; error?: string }> {
  const client = getSupabaseClient()
  if (!client) {
    return { success: false, error: "Supabase not configured" }
  }

  try {
    const { error } = await client.from("comments").insert({
      article_slug: articleSlug,
      commenter_name: name,
      commenter_email: email,
      comment_text: comment,
      created_at: new Date().toISOString(),
    })

    if (error) {
      console.error("Supabase insert error:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error adding comment:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function getComments(articleSlug: string) {
  const client = getSupabaseClient()
  if (!client) {
    return []
  }

  try {
    const { data, error } = await client
      .from("comments")
      .select("*")
      .eq("article_slug", articleSlug)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching comments:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error getting comments:", error)
    return []
  }
}

export async function getDashboardStats() {
  const client = getSupabaseClient()
  if (!client) {
    return {
      newsletter: 0,
      shop: 0,
      podcast: 0,
      "auction-collector": 0,
      "auction-creator": 0,
      contact: 0,
    }
  }

  try {
    const categories = ["newsletter", "shop", "podcast", "auction-collector", "auction-creator"]

    const counts: Record<string, number> = {}

    for (const category of categories) {
      const { count } = await client
        .from("subscribers")
        .select("*", { count: "exact", head: true })
        .eq("category", category)

      counts[category] = count || 0
    }

    const { count: contactCount } = await client.from("contact_submissions").select("*", { count: "exact", head: true })

    counts.contact = contactCount || 0

    return counts
  } catch (error) {
    console.error("Error getting dashboard stats:", error)
    return {
      newsletter: 0,
      shop: 0,
      podcast: 0,
      "auction-collector": 0,
      "auction-creator": 0,
      contact: 0,
    }
  }
}

// Export the client for direct access if needed
export function createClient() {
  return getSupabaseClient()
}
