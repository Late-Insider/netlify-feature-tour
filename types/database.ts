// =====================================================
// DATABASE TYPES - Matching SQL Schema
// =====================================================

export interface User {
  id: string
  email: string
  name: string | null
  avatar_url: string | null
  role: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Subscriber {
  id: string
  email: string
  name: string | null
  source: string
  category: string | null
  is_active: boolean
  subscribed_at: string
  unsubscribed_at: string | null
  last_email_sent_at: string | null
  email_count: number
}

export interface Post {
  id: string
  slug: string
  title: string
  excerpt: string | null
  content: string
  author_id: string | null
  category: string | null
  tags: string[] | null
  featured_image: string | null
  is_published: boolean
  published_at: string | null
  view_count: number
  read_time: number | null
  created_at: string
  updated_at: string
}

export interface NewsletterArticle {
  id: string
  slug: string
  title: string
  excerpt: string | null
  content: string
  author_id: string | null
  issue_number: number | null
  featured_image: string | null
  is_published: boolean
  published_at: string | null
  sent_at: string | null
  view_count: number
  read_time: number | null
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  slug: string
  name: string
  description: string | null
  price: number | null
  currency: string
  category: string | null
  images: string[] | null
  is_available: boolean
  stock_quantity: number
  created_at: string
  updated_at: string
}

export interface Comment {
  id: string
  email: string
  name: string | null
  comment: string
  article_slug: string
  article_type: string
  parent_id: string | null
  is_approved: boolean
  created_at: string
  updated_at: string
}

export interface Reaction {
  id: string
  email: string
  article_slug: string
  article_type: string
  reaction_type: string
  created_at: string
}

export interface EmailQueue {
  id: string
  recipient_email: string
  recipient_name: string | null
  subject: string
  html_content: string
  email_type: string
  status: string
  error_message: string | null
  scheduled_for: string | null
  sent_at: string | null
  created_at: string
  updated_at: string
}

export interface PageView {
  id: string
  page_path: string
  page_title: string | null
  referrer: string | null
  user_agent: string | null
  ip_address: string | null
  country: string | null
  device_type: string | null
  created_at: string
}

export interface Event {
  id: string
  event_name: string
  event_category: string | null
  event_label: string | null
  event_value: number | null
  page_path: string | null
  user_id: string | null
  metadata: Record<string, any> | null
  created_at: string
}

export interface ContactSubmission {
  id: string
  name: string
  email: string
  message: string
  status: string
  replied_at: string | null
  submitted_at: string
}

export interface CreatorApplication {
  id: string
  name: string
  email: string
  portfolio_url: string | null
  message: string | null
  status: string
  reviewed_at: string | null
  submitted_at: string
}

// Request/Response Types
export interface CreateSubscriberRequest {
  email: string
  name?: string
  source: string
  category?: string
}

export interface CreateCommentRequest {
  email: string
  name?: string
  comment: string
  article_slug: string
  article_type: string
  parent_id?: string
}

export interface CreateReactionRequest {
  email: string
  article_slug: string
  article_type: string
  reaction_type: string
}

export interface TrackEventRequest {
  event_name: string
  event_category?: string
  event_label?: string
  event_value?: number
  page_path?: string
  metadata?: Record<string, any>
}

export interface DashboardStats {
  totalSubscribers: number
  totalPosts: number
  totalNewsletters: number
  totalComments: number
  totalPageViews: number
  totalProducts: number
  activeSubscribers: number
  pendingEmails: number
}

export interface AnalyticsStats {
  totalPageViews: number
  uniqueVisitors: number
  topPages: Array<{ page_path: string; views: number }>
  topReferrers: Array<{ referrer: string; count: number }>
  deviceBreakdown: Array<{ device_type: string; count: number }>
}
