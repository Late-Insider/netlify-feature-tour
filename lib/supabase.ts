import { createClient as createSupabaseClient, type SupabaseClient } from "@supabase/supabase-js"

// Lazy initialization to ensure environment variables are available at runtime
let supabaseInstance: SupabaseClient | null = null

function getSupabaseClient(): SupabaseClient | null {
  if (supabaseInstance) {
    return supabaseInstance
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase environment variables not configured")
    return null
  }

  supabaseInstance = createSupabaseClient(supabaseUrl, supabaseAnonKey)
  return supabaseInstance
}

// Export a proxy that lazily creates the client
export const supabase = new Proxy({} as SupabaseClient, {
  get: (target, prop) => {
    const client = getSupabaseClient()
    if (!client) return undefined
    const value = client[prop as keyof SupabaseClient]
    return typeof value === "function" ? value.bind(client) : value
  },
})

// Export createClient function for compatibility
export function createClient() {
  return getSupabaseClient()
}

// Helper to check if Supabase is configured
export function isSupabaseConfigured(): boolean {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

export async function testSupabaseConnection() {
  const client = getSupabaseClient()
  if (!client) {
    return { success: false, error: "Supabase not configured" }
  }

  try {
    const { data, error } = await client.from("subscribers").select("count").limit(1)
    if (error) throw error
    return { success: true, message: "Supabase connection successful" }
  } catch (error) {
    console.error("Supabase connection error:", error)
    return { success: false, error: String(error) }
  }
}

export async function addSubscriber(email: string, source: string) {
  const client = getSupabaseClient()
  if (!client) {
    throw new Error("Supabase not configured")
  }

  const { data, error } = await client
    .from("subscribers")
    .insert({
      email,
      source,
      is_active: true,
      subscribed_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.error("Error adding subscriber:", error)
    throw error
  }

  return data
}

export async function getSubscriberByEmail(email: string) {
  const client = getSupabaseClient()
  if (!client) {
    throw new Error("Supabase not configured")
  }

  const { data, error } = await client.from("subscribers").select("*").eq("email", email).single()

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching subscriber:", error)
    throw error
  }

  return data
}

export async function getAllActiveSubscribers() {
  const client = getSupabaseClient()
  if (!client) {
    return []
  }

  const { data, error } = await client.from("subscribers").select("email, name").eq("is_active", true)

  if (error) {
    console.error("Error fetching active subscribers:", error)
    throw error
  }

  return data || []
}

export async function addComment(email: string, comment: string, articleSlug: string, articleType: string) {
  const client = getSupabaseClient()
  if (!client) {
    throw new Error("Supabase not configured")
  }

  const { data, error } = await client
    .from("comments")
    .insert({
      email,
      comment,
      article_slug: articleSlug,
      article_type: articleType,
      created_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.error("Error adding comment:", error)
    throw error
  }

  return data
}

export async function getCommentsByArticle(articleSlug: string) {
  const client = getSupabaseClient()
  if (!client) {
    return []
  }

  const { data, error } = await client
    .from("comments")
    .select("*")
    .eq("article_slug", articleSlug)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching comments:", error)
    throw error
  }

  return data || []
}

export async function addEmailToQueue(recipientEmail: string, subject: string, htmlContent: string, emailType: string) {
  const client = getSupabaseClient()
  if (!client) {
    throw new Error("Supabase not configured")
  }

  const { data, error } = await client
    .from("email_queue")
    .insert({
      recipient_email: recipientEmail,
      subject,
      html_content: htmlContent,
      email_type: emailType,
      status: "pending",
      created_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.error("Error adding email to queue:", error)
    throw error
  }

  return data
}

export async function getPendingEmails() {
  const client = getSupabaseClient()
  if (!client) {
    return []
  }

  const { data, error } = await client.from("email_queue").select("*").eq("status", "pending").limit(50)

  if (error) {
    console.error("Error fetching pending emails:", error)
    throw error
  }

  return data || []
}

export async function updateEmailStatus(emailId: string, status: string, errorMessage?: string) {
  const client = getSupabaseClient()
  if (!client) {
    throw new Error("Supabase not configured")
  }

  const updateData: any = {
    status,
    updated_at: new Date().toISOString(),
  }

  if (status === "sent") {
    updateData.sent_at = new Date().toISOString()
  }

  if (errorMessage) {
    updateData.error_message = errorMessage
  }

  const { data, error } = await client.from("email_queue").update(updateData).eq("id", emailId).select().single()

  if (error) {
    console.error("Error updating email status:", error)
    throw error
  }

  return data
}

export async function getDashboardStats() {
  const client = getSupabaseClient()
  if (!client) {
    return {
      totalSubscribers: 0,
      totalComments: 0,
      totalEmails: 0,
    }
  }

  try {
    const [subscribersResult, commentsResult, emailsResult] = await Promise.all([
      client.from("subscribers").select("count", { count: "exact", head: true }),
      client.from("comments").select("count", { count: "exact", head: true }),
      client.from("email_queue").select("count", { count: "exact", head: true }),
    ])

    return {
      totalSubscribers: subscribersResult.count || 0,
      totalComments: commentsResult.count || 0,
      totalEmails: emailsResult.count || 0,
    }
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return {
      totalSubscribers: 0,
      totalComments: 0,
      totalEmails: 0,
    }
  }
}

export async function addCreatorApplication(name: string, email: string, portfolioUrl: string, message: string) {
  const client = getSupabaseClient()
  if (!client) {
    throw new Error("Supabase not configured")
  }

  const { data, error } = await client
    .from("creator_applications")
    .insert({
      name,
      email,
      portfolio_url: portfolioUrl,
      message,
      status: "pending",
      submitted_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.error("Error adding creator application:", error)
    throw error
  }

  return data
}

export async function addContactSubmission(name: string, email: string, message: string) {
  const client = getSupabaseClient()
  if (!client) {
    throw new Error("Supabase not configured")
  }

  const { data, error } = await client
    .from("contact_submissions")
    .insert({
      name,
      email,
      message,
      submitted_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.error("Error adding contact submission:", error)
    throw error
  }

  return data
}

export async function getSubscriberCountByCategory(category: string): Promise<number> {
  const client = getSupabaseClient()
  if (!client) {
    return 0
  }

  const { count, error } = await client
    .from("subscribers")
    .select("*", { count: "exact", head: true })
    .eq("category", category)
    .eq("is_active", true)

  if (error) {
    console.error("Error getting subscriber count:", error)
    return 0
  }

  return count || 0
}
