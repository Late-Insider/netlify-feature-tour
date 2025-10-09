"use server"

import { createClient } from "@/lib/supabase"

export type EventType = "view" | "reaction" | "comment" | "share" | "read_time"
export type ArticleType = "blog" | "newsletter"
export type ReactionType = "like" | "love" | "insightful" | "inspiring"

export interface AnalyticsEvent {
  eventType: EventType
  articleSlug: string
  articleType: ArticleType
  visitorId: string
  reactionType?: ReactionType
  readTimeSeconds?: number
  metadata?: Record<string, any>
}

export async function generateVisitorId(): Promise<string> {
  // Generate a simple random ID without crypto
  return `visitor_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
}

export async function trackEvent(event: AnalyticsEvent): Promise<boolean> {
  try {
    const supabase = createClient()

    const { error } = await supabase.from("analytics_events").insert({
      event_type: event.eventType,
      article_slug: event.articleSlug,
      article_type: event.articleType,
      visitor_id: event.visitorId,
      reaction_type: event.reactionType,
      read_time_seconds: event.readTimeSeconds,
      metadata: event.metadata,
      created_at: new Date().toISOString(),
    })

    if (error) {
      console.error("Track event error:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Failed to track event:", error)
    return false
  }
}

export async function trackView(articleSlug: string, articleType: ArticleType, visitorId: string): Promise<boolean> {
  return trackEvent({
    eventType: "view",
    articleSlug,
    articleType,
    visitorId,
  })
}

export async function trackReaction(
  articleSlug: string,
  articleType: ArticleType,
  visitorId: string,
  reactionType: ReactionType,
): Promise<boolean> {
  return trackEvent({
    eventType: "reaction",
    articleSlug,
    articleType,
    visitorId,
    reactionType,
  })
}

export async function trackComment(articleSlug: string, articleType: ArticleType, visitorId: string): Promise<boolean> {
  return trackEvent({
    eventType: "comment",
    articleSlug,
    articleType,
    visitorId,
  })
}

export async function trackShare(
  articleSlug: string,
  articleType: ArticleType,
  visitorId: string,
  platform: string,
): Promise<boolean> {
  return trackEvent({
    eventType: "share",
    articleSlug,
    articleType,
    visitorId,
    metadata: { platform },
  })
}

export async function trackReadTime(
  articleSlug: string,
  articleType: ArticleType,
  visitorId: string,
  readTimeSeconds: number,
): Promise<boolean> {
  return trackEvent({
    eventType: "read_time",
    articleSlug,
    articleType,
    visitorId,
    readTimeSeconds,
  })
}

export async function getArticleAnalytics(articleSlug: string): Promise<any> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from("article_analytics")
      .select("*")
      .eq("article_slug", articleSlug)
      .single()

    if (error) {
      console.error("Get article analytics error:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Failed to get article analytics:", error)
    return null
  }
}

export async function getAllAnalytics(): Promise<any> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase.from("article_analytics").select("*").order("views", { ascending: false })

    if (error) {
      console.error("Get all analytics error:", error)
      return []
    }

    return data
  } catch (error) {
    console.error("Failed to get all analytics:", error)
    return []
  }
}

export async function getTopArticles(limit = 10): Promise<any> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from("article_analytics")
      .select("*")
      .order("engagement_rate", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("Get top articles error:", error)
      return []
    }

    return data
  } catch (error) {
    console.error("Failed to get top articles:", error)
    return []
  }
}

export async function getRecentActivity(limit = 50): Promise<any> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from("analytics_events")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("Get recent activity error:", error)
      return []
    }

    return data
  } catch (error) {
    console.error("Failed to get recent activity:", error)
    return []
  }
}

export async function getEngagementMetrics(
  articleSlug?: string,
  articleType?: ArticleType,
  startDate?: Date,
  endDate?: Date,
): Promise<any> {
  try {
    const supabase = createClient()

    let query = supabase.from("analytics_events").select("*")

    if (articleSlug) {
      query = query.eq("article_slug", articleSlug)
    }

    if (articleType) {
      query = query.eq("article_type", articleType)
    }

    if (startDate) {
      query = query.gte("created_at", startDate.toISOString())
    }

    if (endDate) {
      query = query.lte("created_at", endDate.toISOString())
    }

    const { data, error } = await query

    if (error) {
      console.error("Get engagement metrics error:", error)
      return null
    }

    const metrics = {
      totalEvents: data.length,
      views: data.filter((e) => e.event_type === "view").length,
      reactions: data.filter((e) => e.event_type === "reaction").length,
      comments: data.filter((e) => e.event_type === "comment").length,
      shares: data.filter((e) => e.event_type === "share").length,
      uniqueVisitors: new Set(data.map((e) => e.visitor_id)).size,
      avgReadTime:
        data.filter((e) => e.event_type === "read_time").reduce((sum, e) => sum + (e.read_time_seconds || 0), 0) /
          data.filter((e) => e.event_type === "read_time").length || 0,
      engagementRate:
        data.filter((e) => e.event_type === "view").length > 0
          ? (data.filter((e) => ["reaction", "comment", "share"].includes(e.event_type)).length /
              data.filter((e) => e.event_type === "view").length) *
            100
          : 0,
    }

    return metrics
  } catch (error) {
    console.error("Failed to get engagement metrics:", error)
    return null
  }
}
