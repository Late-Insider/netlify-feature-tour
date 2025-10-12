import { createClient } from "@supabase/supabase-js"
import { validateEnvironment } from "./env-validation"
import type {
  Subscriber,
  Post,
  NewsletterArticle,
  Product,
  Comment,
  Reaction,
  EmailQueue,
  PageView,
  Event,
  ContactSubmission,
  CreatorApplication,
  CreateSubscriberRequest,
  CreateCommentRequest,
  CreateReactionRequest,
  TrackEventRequest,
  DashboardStats,
  AnalyticsStats,
} from "@/types/database"

// Validate environment and create Supabase client
const env = validateEnvironment()
export const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

// =====================================================
// SUBSCRIBERS
// =====================================================

export async function createSubscriber(data: CreateSubscriberRequest): Promise<Subscriber> {
  const { data: subscriber, error } = await supabase
    .from("subscribers")
    .insert({
      email: data.email,
      name: data.name,
      source: data.source,
      category: data.category,
      is_active: true,
      subscribed_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) throw error
  return subscriber
}

export async function getSubscribers(filters?: {
  isActive?: boolean
  source?: string
}): Promise<Subscriber[]> {
  let query = supabase.from("subscribers").select("*")

  if (filters?.isActive !== undefined) {
    query = query.eq("is_active", filters.isActive)
  }

  if (filters?.source) {
    query = query.eq("source", filters.source)
  }

  const { data, error } = await query.order("subscribed_at", { ascending: false })

  if (error) throw error
  return data || []
}

export async function getSubscriberByEmail(email: string): Promise<Subscriber | null> {
  const { data, error } = await supabase.from("subscribers").select("*").eq("email", email).single()

  if (error && error.code !== "PGRST116") throw error
  return data
}

export async function updateSubscriber(id: string, updates: Partial<Subscriber>): Promise<Subscriber> {
  const { data, error } = await supabase.from("subscribers").update(updates).eq("id", id).select().single()

  if (error) throw error
  return data
}

export async function unsubscribe(email: string): Promise<void> {
  const { error } = await supabase
    .from("subscribers")
    .update({
      is_active: false,
      unsubscribed_at: new Date().toISOString(),
    })
    .eq("email", email)

  if (error) throw error
}

// =====================================================
// POSTS
// =====================================================

export async function getPosts(filters?: {
  isPublished?: boolean
  category?: string
  limit?: number
}): Promise<Post[]> {
  let query = supabase.from("posts").select("*")

  if (filters?.isPublished !== undefined) {
    query = query.eq("is_published", filters.isPublished)
  }

  if (filters?.category) {
    query = query.eq("category", filters.category)
  }

  if (filters?.limit) {
    query = query.limit(filters.limit)
  }

  const { data, error } = await query.order("published_at", { ascending: false })

  if (error) throw error
  return data || []
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const { data, error } = await supabase.from("posts").select("*").eq("slug", slug).single()

  if (error && error.code !== "PGRST116") throw error
  return data
}

export async function incrementPostViews(slug: string): Promise<void> {
  const { error } = await supabase.rpc("increment_view_count", {
    p_slug: slug,
    p_type: "post",
  })

  if (error) console.error("Error incrementing views:", error)
}

// =====================================================
// NEWSLETTER ARTICLES
// =====================================================

export async function getNewsletterArticles(filters?: {
  isPublished?: boolean
  limit?: number
}): Promise<NewsletterArticle[]> {
  let query = supabase.from("newsletter_articles").select("*")

  if (filters?.isPublished !== undefined) {
    query = query.eq("is_published", filters.isPublished)
  }

  if (filters?.limit) {
    query = query.limit(filters.limit)
  }

  const { data, error } = await query.order("published_at", { ascending: false })

  if (error) throw error
  return data || []
}

export async function getNewsletterBySlug(slug: string): Promise<NewsletterArticle | null> {
  const { data, error } = await supabase.from("newsletter_articles").select("*").eq("slug", slug).single()

  if (error && error.code !== "PGRST116") throw error
  return data
}

export async function incrementNewsletterViews(slug: string): Promise<void> {
  const { error } = await supabase.rpc("increment_view_count", {
    p_slug: slug,
    p_type: "newsletter",
  })

  if (error) console.error("Error incrementing views:", error)
}

// =====================================================
// PRODUCTS
// =====================================================

export async function getProducts(filters?: {
  isAvailable?: boolean
  category?: string
}): Promise<Product[]> {
  let query = supabase.from("products").select("*")

  if (filters?.isAvailable !== undefined) {
    query = query.eq("is_available", filters.isAvailable)
  }

  if (filters?.category) {
    query = query.eq("category", filters.category)
  }

  const { data, error } = await query.order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase.from("products").select("*").eq("slug", slug).single()

  if (error && error.code !== "PGRST116") throw error
  return data
}

// =====================================================
// COMMENTS
// =====================================================

export async function createComment(data: CreateCommentRequest): Promise<Comment> {
  const { data: comment, error } = await supabase
    .from("comments")
    .insert({
      email: data.email,
      name: data.name,
      comment: data.comment,
      article_slug: data.article_slug,
      article_type: data.article_type,
      parent_id: data.parent_id,
      is_approved: false,
      created_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) throw error
  return comment
}

export async function getComments(articleSlug: string, articleType: string): Promise<Comment[]> {
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("article_slug", articleSlug)
    .eq("article_type", articleType)
    .eq("is_approved", true)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

// =====================================================
// REACTIONS
// =====================================================

export async function createReaction(data: CreateReactionRequest): Promise<Reaction> {
  const { data: reaction, error } = await supabase
    .from("reactions")
    .insert({
      email: data.email,
      article_slug: data.article_slug,
      article_type: data.article_type,
      reaction_type: data.reaction_type,
      created_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) throw error
  return reaction
}

export async function getReactionCounts(articleSlug: string, articleType: string): Promise<Record<string, number>> {
  const { data, error } = await supabase
    .from("reactions")
    .select("reaction_type")
    .eq("article_slug", articleSlug)
    .eq("article_type", articleType)

  if (error) throw error

  const counts: Record<string, number> = {}
  data?.forEach((reaction) => {
    counts[reaction.reaction_type] = (counts[reaction.reaction_type] || 0) + 1
  })

  return counts
}

export async function getUserReaction(email: string, articleSlug: string, articleType: string): Promise<string | null> {
  const { data, error } = await supabase
    .from("reactions")
    .select("reaction_type")
    .eq("email", email)
    .eq("article_slug", articleSlug)
    .eq("article_type", articleType)
    .single()

  if (error && error.code !== "PGRST116") throw error
  return data?.reaction_type || null
}

// =====================================================
// EMAIL QUEUE
// =====================================================

export async function addToEmailQueue(data: {
  recipient_email: string
  recipient_name?: string
  subject: string
  html_content: string
  email_type: string
  scheduled_for?: string
}): Promise<EmailQueue> {
  const { data: email, error } = await supabase
    .from("email_queue")
    .insert({
      ...data,
      status: "pending",
      created_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) throw error
  return email
}

export async function getPendingEmails(limit = 50): Promise<EmailQueue[]> {
  const { data, error } = await supabase
    .from("email_queue")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: true })
    .limit(limit)

  if (error) throw error
  return data || []
}

export async function updateEmailStatus(id: string, status: string, errorMessage?: string): Promise<void> {
  const updates: any = { status }

  if (status === "sent") {
    updates.sent_at = new Date().toISOString()
  }

  if (errorMessage) {
    updates.error_message = errorMessage
  }

  const { error } = await supabase.from("email_queue").update(updates).eq("id", id)

  if (error) throw error
}

// =====================================================
// ANALYTICS
// =====================================================

export async function trackPageView(data: {
  page_path: string
  page_title?: string
  referrer?: string
  user_agent?: string
  ip_address?: string
  device_type?: string
}): Promise<PageView> {
  const { data: pageView, error } = await supabase
    .from("page_views")
    .insert({
      ...data,
      created_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) throw error
  return pageView
}

export async function trackEvent(data: TrackEventRequest): Promise<Event> {
  const { data: event, error } = await supabase
    .from("events")
    .insert({
      ...data,
      created_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) throw error
  return event
}

export async function getAnalyticsStats(): Promise<AnalyticsStats> {
  const { data: pageViews, error: pvError } = await supabase.from("page_views").select("*")

  if (pvError) throw pvError

  const totalPageViews = pageViews?.length || 0
  const uniqueVisitors = new Set(pageViews?.map((pv) => pv.ip_address)).size

  // Top pages
  const pageCounts: Record<string, number> = {}
  pageViews?.forEach((pv) => {
    pageCounts[pv.page_path] = (pageCounts[pv.page_path] || 0) + 1
  })
  const topPages = Object.entries(pageCounts)
    .map(([page_path, views]) => ({ page_path, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 10)

  // Top referrers
  const referrerCounts: Record<string, number> = {}
  pageViews?.forEach((pv) => {
    if (pv.referrer) {
      referrerCounts[pv.referrer] = (referrerCounts[pv.referrer] || 0) + 1
    }
  })
  const topReferrers = Object.entries(referrerCounts)
    .map(([referrer, count]) => ({ referrer, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  // Device breakdown
  const deviceCounts: Record<string, number> = {}
  pageViews?.forEach((pv) => {
    if (pv.device_type) {
      deviceCounts[pv.device_type] = (deviceCounts[pv.device_type] || 0) + 1
    }
  })
  const deviceBreakdown = Object.entries(deviceCounts).map(([device_type, count]) => ({
    device_type,
    count,
  }))

  return {
    totalPageViews,
    uniqueVisitors,
    topPages,
    topReferrers,
    deviceBreakdown,
  }
}

// =====================================================
// DASHBOARD STATS
// =====================================================

export async function getDashboardStats(): Promise<DashboardStats> {
  const [
    subscribersResult,
    postsResult,
    newslettersResult,
    commentsResult,
    pageViewsResult,
    productsResult,
    activeSubscribersResult,
    pendingEmailsResult,
  ] = await Promise.all([
    supabase.from("subscribers").select("count", { count: "exact", head: true }),
    supabase.from("posts").select("count", { count: "exact", head: true }),
    supabase.from("newsletter_articles").select("count", { count: "exact", head: true }),
    supabase.from("comments").select("count", { count: "exact", head: true }),
    supabase.from("page_views").select("count", { count: "exact", head: true }),
    supabase.from("products").select("count", { count: "exact", head: true }),
    supabase.from("subscribers").select("count", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("email_queue").select("count", { count: "exact", head: true }).eq("status", "pending"),
  ])

  return {
    totalSubscribers: subscribersResult.count || 0,
    totalPosts: postsResult.count || 0,
    totalNewsletters: newslettersResult.count || 0,
    totalComments: commentsResult.count || 0,
    totalPageViews: pageViewsResult.count || 0,
    totalProducts: productsResult.count || 0,
    activeSubscribers: activeSubscribersResult.count || 0,
    pendingEmails: pendingEmailsResult.count || 0,
  }
}

// =====================================================
// CONTACT & APPLICATIONS
// =====================================================

export async function createContactSubmission(data: {
  name: string
  email: string
  message: string
}): Promise<ContactSubmission> {
  const { data: submission, error } = await supabase
    .from("contact_submissions")
    .insert({
      ...data,
      status: "new",
      submitted_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) throw error
  return submission
}

export async function createCreatorApplication(data: {
  name: string
  email: string
  portfolio_url?: string
  message?: string
}): Promise<CreatorApplication> {
  const { data: application, error } = await supabase
    .from("creator_applications")
    .insert({
      ...data,
      status: "pending",
      submitted_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) throw error
  return application
}
