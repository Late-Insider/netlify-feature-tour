import { type NextRequest } from "next/server"

type RawEnv = {
  NEXT_PUBLIC_SUPABASE_URL?: string
  NEXT_PUBLIC_SUPABASE_ANON_KEY?: string
  SUPABASE_SERVICE_ROLE_KEY?: string
  NEXT_PUBLIC_SITE_URL?: string
  EMAIL_FROM?: string
  EMAIL_PROVIDER_API_KEY?: string
  DIAG_ADMIN_TOKEN?: string
}

const rawEnv: RawEnv = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  EMAIL_FROM: process.env.EMAIL_FROM,
  EMAIL_PROVIDER_API_KEY: process.env.EMAIL_PROVIDER_API_KEY,
  DIAG_ADMIN_TOKEN: process.env.DIAG_ADMIN_TOKEN,
}

const runtimeEnv = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  VERCEL_ENV: process.env.VERCEL_ENV,
}

export type EnvKey = keyof RawEnv
const requiredKeys: EnvKey[] = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "EMAIL_FROM",
  "EMAIL_PROVIDER_API_KEY",
]

const warnContexts = new Set<string>()

function shouldWarn(missing: EnvKey[]): boolean {
  return missing.length > 0 && (runtimeEnv.VERCEL_ENV === "preview" || runtimeEnv.NODE_ENV !== "production")
}

function warn(feature: string, missing: EnvKey[]): void {
  if (!shouldWarn(missing)) return
  if (warnContexts.has(feature)) return
  console.warn(
    JSON.stringify({
      level: "warn",
      scope: "env",
      feature,
      missing,
    }),
  )
  warnContexts.add(feature)
}

// Emit one baseline warning if anything critical is missing.
warn(
  "core",
  requiredKeys.filter((key) => !rawEnv[key]),
)

interface EnvConfig {
  url: string | undefined
  anon: string | undefined
  service: string | undefined
  site: string
}

export const env: EnvConfig = {
  url: rawEnv.NEXT_PUBLIC_SUPABASE_URL,
  anon: rawEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  service: rawEnv.SUPABASE_SERVICE_ROLE_KEY,
  site: rawEnv.NEXT_PUBLIC_SITE_URL || "https://late.ltd",
}

export const hasUrl = Boolean(env.url)
export const hasAnon = Boolean(env.anon)
export const hasService = Boolean(env.service)
export const hasSite = Boolean(env.site)

export function getSupabaseServiceRoleKey(): string | undefined {
  if (typeof window !== "undefined") {
    return undefined
  }
  return env.service
}

export function hasSupabaseBrowserConfig(): boolean {
  return Boolean(env.url && env.anon)
}

export function hasSupabaseServiceConfig(): boolean {
  return Boolean(env.url && env.service)
}

export function hasEmailConfig(): boolean {
  return Boolean(rawEnv.EMAIL_FROM && rawEnv.EMAIL_PROVIDER_API_KEY)
}

export function getEnvDiagnostics() {
  return {
    hasUrl,
    hasAnon,
    hasService,
    hasFrom: Boolean(rawEnv.EMAIL_FROM),
  }
}

export function assertAdminRequest(request: NextRequest): boolean {
  const expectedToken = rawEnv.DIAG_ADMIN_TOKEN
  if (!expectedToken) {
    warn("diag", ["DIAG_ADMIN_TOKEN"])
    return false
  }

  const authHeader = request.headers.get("authorization") ?? ""
  const token = authHeader.replace(/Bearer\s+/i, "").trim()
  return token === expectedToken
}

export function warnMissingFor(feature: string, keys: EnvKey[]) {
  warn(feature, keys)
}

export const runtime = {
  isProduction: runtimeEnv.NODE_ENV === "production",
  isPreview: runtimeEnv.VERCEL_ENV === "preview",
}
