import { createClient, type SupabaseClient } from "@supabase/supabase-js"

import { env } from "./env"

export function getServerClient(): SupabaseClient | null {
  if (typeof window !== "undefined") {
    return null
  }

  const { url, service } = env
  if (!url || !service) return null

  return createClient(url, service, {
    auth: { persistSession: false },
  })
}
