import { createClient as createSupabaseClient, type SupabaseClient } from "@supabase/supabase-js"

import {
  env,
  type EnvKey,
  getSupabaseServiceRoleKey,
  hasSupabaseBrowserConfig,
  hasSupabaseServiceConfig,
  warnMissingFor,
} from "@/src/lib/env"

const BROWSER_KEYS: EnvKey[] = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"]
const SERVICE_KEYS: EnvKey[] = ["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"]

let browserClient: SupabaseClient | null = null
let serviceClient: SupabaseClient | null = null

function createNoopSupabaseClient(): SupabaseClient {
  const noopResponse = Promise.resolve({ data: null, error: new Error("Supabase disabled") })

  const builder: any = new Proxy(
    {},
    {
      get: (_target, prop) => {
        const method = String(prop)
        if (method === "select" || method === "insert" || method === "update" || method === "delete") {
          return () => noopResponse
        }

        if (method === "single" || method === "maybeSingle") {
          return () => noopResponse
        }

        if (method === "then") {
          return undefined
        }

        return () => builder
      },
    },
  )

  return new Proxy(
    {},
    {
      get: (_target, prop) => {
        if (prop === "from") {
          return () => builder
        }

        return () => builder
      },
    },
  ) as SupabaseClient
}

function getBrowserClient(): SupabaseClient | null {
  if (!hasSupabaseBrowserConfig()) {
    warnMissingFor("supabase-browser", BROWSER_KEYS)
    return null
  }

  if (!browserClient) {
    browserClient = createSupabaseClient(env.supabaseUrl, env.supabaseAnonKey)
  }

  return browserClient
}

function getServiceClient(): SupabaseClient | null {
  if (typeof window !== "undefined") {
    return null
  }

  if (!hasSupabaseServiceConfig()) {
    warnMissingFor("supabase-service", SERVICE_KEYS)
    return null
  }

  if (!serviceClient) {
    const serviceKey = getSupabaseServiceRoleKey()
    if (!serviceKey) {
      warnMissingFor("supabase-service", ["SUPABASE_SERVICE_ROLE_KEY"])
      return null
    }

    serviceClient = createSupabaseClient(env.supabaseUrl, serviceKey, {
      auth: { persistSession: false },
    })
  }

  return serviceClient
}

export function createBrowserClient(): SupabaseClient | null {
  return getBrowserClient()
}

export function createServiceRoleClient(): SupabaseClient | null {
  return getServiceClient()
}

export function createClient(): SupabaseClient | null {
  return getServiceClient() ?? getBrowserClient() ?? createNoopSupabaseClient()
}

export function isSupabaseConfigured(): boolean {
  return hasSupabaseBrowserConfig()
}

export function isSupabaseServiceConfigured(): boolean {
  return hasSupabaseServiceConfig()
}

export async function testSupabaseConnection() {
  const client = getServiceClient()
  if (!client) {
    return { success: false, error: "Supabase not configured" }
  }

  try {
    const { error } = await client.from("subscribers").select("id").limit(1)
    if (error) throw error
    return { success: true, message: "Supabase connection successful" }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unknown Supabase error" }
  }
}

type SubscriberInput = {
  email: string
  category?: string
  source?: string | null
  status?: "pending" | "confirmed" | "unsubscribed" | "bounced"
}

interface SubscriberSchemaState {
  hasSource: boolean
}

let subscriberSchemaState: SubscriberSchemaState | null = null
let subscriberSchemaPromise: Promise<SubscriberSchemaState> | null = null
let subscriberSchemaWarned = false

async function ensureSubscriberSchema(client: SupabaseClient): Promise<SubscriberSchemaState> {
  if (subscriberSchemaState) {
    return subscriberSchemaState
  }

  if (!subscriberSchemaPromise) {
    subscriberSchemaPromise = (async () => {
      let hasSource = true

      const { error } = await client.from("subscribers").select("source").limit(0)
      if (error) {
        const supabaseError = error as { code?: string; message?: string }
        const code = supabaseError.code ?? ""
        const message = supabaseError.message ?? ""
        if (code === "42703" || /column\s+"?source"?/i.test(message)) {
          hasSource = false
          if (!subscriberSchemaWarned) {
            console.warn(
              JSON.stringify({
                level: "warn",
                scope: "subscribers-schema",
                message: "column 'source' missing",
              }),
            )
            subscriberSchemaWarned = true
          }
        } else {
          throw error
        }
      }

      subscriberSchemaState = { hasSource }
      return subscriberSchemaState
    })()
  }

  return subscriberSchemaPromise
}

export interface AddSubscriberResult {
  data: Record<string, unknown> | null
  isNew: boolean
  disabled?: boolean
  error?: string
}

export interface BuildSubscriberInsertInput {
  email: string
  category: string
  status: "pending" | "confirmed" | "unsubscribed" | "bounced"
  source?: string | null
  hasSourceColumn: boolean
}

export function buildSubscriberInsertPayload(input: BuildSubscriberInsertInput): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    email: input.email,
    category: input.category,
    status: input.status,
  }

  if (input.hasSourceColumn) {
    payload.source = input.source ?? null
  }

  return payload
}

export async function addSubscriber(input: SubscriberInput): Promise<AddSubscriberResult> {
  const client = getServiceClient()
  if (!client) {
    return { data: null, isNew: false, disabled: true, error: "Supabase not configured" }
  }

  let schema: SubscriberSchemaState
  try {
    schema = await ensureSubscriberSchema(client)
  } catch (error) {
    console.warn(
      JSON.stringify({
        level: "warn",
        scope: "subscribers-schema",
        message: "failed to inspect schema",
        error: error instanceof Error ? error.message : String(error),
      }),
    )
    schema = { hasSource: true }
  }

  const category = input.category ?? input.source ?? "newsletter"
  const insertPayload = buildSubscriberInsertPayload({
    email: input.email,
    category,
    status: input.status ?? "pending",
    source: input.source ?? null,
    hasSourceColumn: schema.hasSource,
  })

  const { data, error } = await client.from("subscribers").insert(insertPayload).select().single()

  if (error) {
    const supabaseError = error as { code?: string; message?: string }
    if (supabaseError.code === "23505") {
      return { data: null, isNew: false, error: "Subscriber already exists" }
    }
    return { data: null, isNew: false, error: supabaseError.message ?? "Failed to add subscriber" }
  }

  return { data: data as Record<string, unknown>, isNew: true }
}

export async function getSubscriberByEmail(email: string) {
  const client = getServiceClient()
  if (!client) {
    return null
  }

  try {
    const { data, error } = await client.from("subscribers").select("*").eq("email", email).single()
    if (error && (error as { code?: string }).code !== "PGRST116") {
      return null
    }
    return data
  } catch (error) {
    console.error("Error fetching subscriber by email:", error)
    return null
  }
}

export async function getAllActiveSubscribers() {
  const client = getServiceClient()
  if (!client) {
    return []
  }

  try {
    const { data, error } = await client.from("subscribers").select("email, name").eq("is_active", true)
    if (error) {
      console.error("Error fetching active subscribers:", error)
      return []
    }
    return data ?? []
  } catch (error) {
    console.error("Error fetching active subscribers:", error)
    return []
  }
}

export async function addComment(email: string, comment: string, articleSlug: string, articleType: string) {
  const client = getServiceClient()
  if (!client) {
    return null
  }

  try {
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
      return null
    }

    return data
  } catch (error) {
    console.error("Error adding comment:", error)
    return null
  }
}

export async function addEmailToQueue(
  recipientEmail: string,
  subject: string,
  htmlContent: string,
  emailType: string,
) {
  const client = getServiceClient()
  if (!client) {
    return null
  }

  try {
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
      return null
    }

    return data
  } catch (error) {
    console.error("Error adding email to queue:", error)
    return null
  }
}

export async function getPendingEmails() {
  const client = getServiceClient()
  if (!client) {
    return []
  }

  try {
    const { data, error } = await client.from("email_queue").select("*").eq("status", "pending").limit(50)
    if (error) {
      console.error("Error fetching pending emails:", error)
      return []
    }
    return data ?? []
  } catch (error) {
    console.error("Error fetching pending emails:", error)
    return []
  }
}

export async function updateEmailStatus(emailId: string, status: string, errorMessage?: string) {
  const client = getServiceClient()
  if (!client) {
    return null
  }

  const updateData: Record<string, unknown> = {
    status,
    updated_at: new Date().toISOString(),
  }

  if (status === "sent") {
    updateData.sent_at = new Date().toISOString()
  }

  if (errorMessage) {
    updateData.error_message = errorMessage
  }

  try {
    const { data, error } = await client.from("email_queue").update(updateData).eq("id", emailId).select().single()
    if (error) {
      console.error("Error updating email status:", error)
      return null
    }
    return data
  } catch (error) {
    console.error("Error updating email status:", error)
    return null
  }
}

export async function getDashboardStats() {
  const client = getServiceClient()
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
      totalSubscribers: subscribersResult.count ?? 0,
      totalComments: commentsResult.count ?? 0,
      totalEmails: emailsResult.count ?? 0,
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

type CreatorAppInput = {
  name: string
  email: string
  preferredContactTimes: string[]            // ← multi-select from the form
  artworkDescription: string | null          // ← your free-text message
  source?: string
}

/**
 * Insert a creator application + (optionally) auto-subscribe to the creator waitlist.
 * Expects DB columns:
 *   - creator_applications.preferred_contact_times (text[])
 *   - creator_applications.artwork_description (text)
 *   - creator_applications.source (text, optional)
 * And table: subscribers(email, category, status, source)
 */
export async function addCreatorApplication(input: CreatorAppInput) {
  const client = getServiceClient()
  if (!client) return null

  try {
    // 1) Insert full application
    const { data: appData, error: appErr } = await client
      .from("creator_applications")
      .insert({
        name: input.name,
        email: input.email,
        preferred_contact_times: input.preferredContactTimes, // ← ARRAY column
        artwork_description: input.artworkDescription,
        source: input.source ?? "auction_creator_modal",
      })
      .select("id")
      .single()

    if (appErr) {
      console.error("Error adding creator application:", appErr)
      return null
    }

    // 2) (optional) also subscribe them to creator waitlist (single opt-in)
    // ignore duplicate errors (23505)
    await client.from("subscribers").insert({
  email: input.email,
  category: "auction_waitlist_creator",
  status: "confirmed",
  source: input.source ?? "auction_creator_modal",
})
      .select("id")
      .single()
      .catch(() => null)

    return appData
  } catch (error) {
    console.error("addCreatorApplication error:", error)
    return null
  }
}

export async function addContactSubmission(name: string, email: string, message: string) {
  const client = getServiceClient()
  if (!client) {
    return null
  }

  try {
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
      return null
    }

    return data
  } catch (error) {
    console.error("Error adding contact submission:", error)
    return null
  }
}

export async function getSubscriberCountByCategory(category: string): Promise<number> {
  const client = getServiceClient()
  if (!client) {
    return 0
  }

  try {
    const { count, error } = await client
      .from("subscribers")
      .select("*", { count: "exact", head: true })
      .eq("category", category)
      .eq("is_active", true)

    if (error) {
      console.error("Error getting subscriber count:", error)
      return 0
    }

    return count ?? 0
  } catch (error) {
    console.error("Error getting subscriber count:", error)
    return 0
  }
}
