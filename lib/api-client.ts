// Client-side API helper functions

export async function apiRequest<T>(
  url: string,
  options?: RequestInit,
): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error("API request failed:", error)
    return { success: false, error: "Request failed" }
  }
}

export const api = {
  // Subscribers
  createSubscriber: (data: { email: string; name?: string; source: string }) =>
    apiRequest("/api/subscribers", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Posts
  getPosts: (filters?: { isPublished?: boolean; category?: string; limit?: number }) => {
    const params = new URLSearchParams()
    if (filters?.isPublished !== undefined) params.set("isPublished", String(filters.isPublished))
    if (filters?.category) params.set("category", filters.category)
    if (filters?.limit) params.set("limit", String(filters.limit))
    return apiRequest(`/api/posts?${params}`)
  },

  getPost: (slug: string) => apiRequest(`/api/posts/${slug}`),

  // Newsletters
  getNewsletters: (filters?: { isPublished?: boolean; limit?: number }) => {
    const params = new URLSearchParams()
    if (filters?.isPublished !== undefined) params.set("isPublished", String(filters.isPublished))
    if (filters?.limit) params.set("limit", String(filters.limit))
    return apiRequest(`/api/newsletters?${params}`)
  },

  getNewsletter: (slug: string) => apiRequest(`/api/newsletters/${slug}`),

  // Comments
  getComments: (articleSlug: string, articleType: string) => {
    const params = new URLSearchParams({ articleSlug, articleType })
    return apiRequest(`/api/comments?${params}`)
  },

  createComment: (data: {
    email: string
    name?: string
    comment: string
    article_slug: string
    article_type: string
  }) =>
    apiRequest("/api/comments", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Reactions
  getReactions: (articleSlug: string, articleType: string, email?: string) => {
    const params = new URLSearchParams({ articleSlug, articleType })
    if (email) params.set("email", email)
    return apiRequest(`/api/reactions?${params}`)
  },

  createReaction: (data: {
    email: string
    article_slug: string
    article_type: string
    reaction_type: string
  }) =>
    apiRequest("/api/reactions", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Analytics
  trackPageView: (data: {
    page_path: string
    page_title?: string
    referrer?: string
    device_type?: string
  }) =>
    apiRequest("/api/analytics/track-page", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  trackEvent: (data: {
    event_name: string
    event_category?: string
    event_label?: string
    event_value?: number
    page_path?: string
    metadata?: Record<string, any>
  }) =>
    apiRequest("/api/analytics/track-event", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getAnalyticsStats: () => apiRequest("/api/analytics/stats"),

  // Dashboard
  getDashboardStats: () => apiRequest("/api/dashboard/stats"),

  // Contact
  submitContact: (data: { name: string; email: string; message: string }) =>
    apiRequest("/api/contact", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Creator Applications
  submitCreatorApplication: (data: {
    name: string
    email: string
    portfolio_url?: string
    message?: string
  }) =>
    apiRequest("/api/creator-applications", {
      method: "POST",
      body: JSON.stringify(data),
    }),
}
