import { createClient as createSupabaseClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey)

export function createClient() {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}

export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey)
}

export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase.from("subscribers").select("count").limit(1)
    if (error) throw error
    return { success: true, message: "Supabase connection successful" }
  } catch (error) {
    console.error("Supabase connection error:", error)
    return { success: false, error: String(error) }
  }
}

export async function addSubscriber(email: string, category: string, name?: string) {
  const { data, error } = await supabase
    .from("subscribers")
    .insert({
      email,
      category,
      name,
      is_active: true,
      subscribed_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    if (error.code === "23505") {
      return { success: true, message: "Already subscribed" }
    }
    console.error("Error adding subscriber:", error)
    throw error
  }

  return { success: true, data }
}

export async function getSubscriberByEmail(email: string, category: string) {
  const { data, error } = await supabase
    .from("subscribers")
    .select("*")
    .eq("email", email)
    .eq("category", category)
    .single()

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching subscriber:", error)
    throw error
  }

  return data
}

export async function getAllActiveSubscribers(category?: string) {
  let query = supabase.from("subscribers").select("email, name, category").eq("is_active", true)

  if (category) {
    query = query.eq("category", category)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching active subscribers:", error)
    throw error
  }

  return data || []
}

export async function addComment(email: string, comment: string, articleSlug: string, articleType: string) {
  const { data, error } = await supabase
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
  const { data, error } = await supabase
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
  const { data, error } = await supabase
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

export async function getPendingEmails(limit = 50) {
  const { data, error } = await supabase.from("email_queue").select("*").eq("status", "pending").limit(limit)

  if (error) {
    console.error("Error fetching pending emails:", error)
    throw error
  }

  return data || []
}

export async function updateEmailStatus(emailId: string, status: string, errorMessage?: string) {
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

  const { data, error } = await supabase.from("email_queue").update(updateData).eq("id", emailId).select().single()

  if (error) {
    console.error("Error updating email status:", error)
    throw error
  }

  return data
}

export async function getDashboardStats() {
  try {
    const [subscribersResult, commentsResult, emailsResult] = await Promise.all([
      supabase.from("subscribers").select("count", { count: "exact", head: true }),
      supabase.from("comments").select("count", { count: "exact", head: true }),
      supabase.from("email_queue").select("count", { count: "exact", head: true }),
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
  const { data, error } = await supabase
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
  const { data, error } = await supabase
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
  const { count, error } = await supabase
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
