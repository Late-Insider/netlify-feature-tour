import { createClient as createSupabaseClient, type SupabaseClient } from "@supabase/supabase-js"

// Lazy initialization
let supabaseClient: SupabaseClient | null = null

function getSupabaseClient(): SupabaseClient | null {
  if (supabaseClient) return supabaseClient

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase environment variables not configured")
    return null
  }

  try {
    supabaseClient = createSupabaseClient(supabaseUrl, supabaseAnonKey)
    return supabaseClient
  } catch (error) {
    console.error("Failed to initialize Supabase client:", error)
    return null
  }
}

export function isSupabaseConfigured(): boolean {
  return getSupabaseClient() !== null
}

export async function addSubscriber(
  email: string,
  category: string,
  unsubscribeToken?: string,
): Promise<{ success: boolean; error?: string }> {
  const client = getSupabaseClient()
  if (!client) {
    return { success: false, error: "Database not configured" }
  }

  try {
    const { error } = await client.from("subscribers").upsert(
      {
        email,
        category,
        unsubscribe_token: unsubscribeToken || "",
        subscribed: true,
        created_at: new Date().toISOString(),
      },
      {
        onConflict: "email,category",
      },
    )

    if (error) {
      console.error("Supabase error adding subscriber:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error adding subscriber:", error)
    return { success: false, error: "Failed to add subscriber" }
  }
}

export async function addComment(
  email: string,
  comment: string,
  articleSlug: string,
  articleType: string,
  name?: string,
): Promise<{ success: boolean; error?: string }> {
  const client = getSupabaseClient()
  if (!client) {
    return { success: false, error: "Database not configured" }
  }

  try {
    const { error } = await client.from("comments").insert({
      email,
      name: name || email.split("@")[0],
      comment,
      article_slug: articleSlug,
      article_type: articleType,
      created_at: new Date().toISOString(),
    })

    if (error) {
      console.error("Supabase error adding comment:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error adding comment:", error)
    return { success: false, error: "Failed to add comment" }
  }
}

export async function addContactSubmission(data: {
  name: string
  email: string
  message: string
}): Promise<{ success: boolean; error?: string }> {
  const client = getSupabaseClient()
  if (!client) {
    return { success: false, error: "Database not configured" }
  }

  try {
    const { error } = await client.from("contact_submissions").insert({
      name: data.name,
      email: data.email,
      message: data.message,
      created_at: new Date().toISOString(),
    })

    if (error) {
      console.error("Supabase error adding contact submission:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error adding contact submission:", error)
    return { success: false, error: "Failed to add contact submission" }
  }
}

export async function addCreatorApplication(data: {
  name: string
  email: string
  portfolio: string
  message: string
}): Promise<{ success: boolean; error?: string }> {
  const client = getSupabaseClient()
  if (!client) {
    return { success: false, error: "Database not configured" }
  }

  try {
    const { error } = await client.from("creator_applications").insert({
      name: data.name,
      email: data.email,
      portfolio: data.portfolio,
      message: data.message,
      created_at: new Date().toISOString(),
    })

    if (error) {
      console.error("Supabase error adding creator application:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error adding creator application:", error)
    return { success: false, error: "Failed to add creator application" }
  }
}

export async function getComments(articleSlug: string, articleType: string): Promise<any[]> {
  const client = getSupabaseClient()
  if (!client) return []

  try {
    const { data, error } = await client
      .from("comments")
      .select("*")
      .eq("article_slug", articleSlug)
      .eq("article_type", articleType)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching comments:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error fetching comments:", error)
    return []
  }
}

export async function getDashboardStats(): Promise<any> {
  const client = getSupabaseClient()
  if (!client) {
    return {
      totalSubscribers: 0,
      newsletterSubscribers: 0,
      shopWaitlist: 0,
      podcastSubscribers: 0,
      auctionCollectors: 0,
      recentSubscribers: [],
    }
  }

  try {
    const { data: subscribers, error: subsError } = await client.from("subscribers").select("*")

    if (subsError) {
      console.error("Error fetching subscribers:", subsError)
      return {
        totalSubscribers: 0,
        newsletterSubscribers: 0,
        shopWaitlist: 0,
        podcastSubscribers: 0,
        auctionCollectors: 0,
        recentSubscribers: [],
      }
    }

    const stats = {
      totalSubscribers: subscribers?.length || 0,
      newsletterSubscribers: subscribers?.filter((s) => s.category === "newsletter").length || 0,
      shopWaitlist: subscribers?.filter((s) => s.category === "shop").length || 0,
      podcastSubscribers: subscribers?.filter((s) => s.category === "podcast").length || 0,
      auctionCollectors: subscribers?.filter((s) => s.category === "auction-collector").length || 0,
      recentSubscribers: (subscribers || [])
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 10),
    }

    return stats
  } catch (error) {
    console.error("Error getting dashboard stats:", error)
    return {
      totalSubscribers: 0,
      newsletterSubscribers: 0,
      shopWaitlist: 0,
      podcastSubscribers: 0,
      auctionCollectors: 0,
      recentSubscribers: [],
    }
  }
}

export function createClient() {
  return getSupabaseClient()
}
