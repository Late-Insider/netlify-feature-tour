// =====================================================
// ENVIRONMENT VARIABLE VALIDATION
// =====================================================

interface EnvConfig {
  NEXT_PUBLIC_SUPABASE_URL: string
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string
  POSTGRES_URL: string
  DATABASE_URL: string
  CRON_SECRET: string
  NEXT_PUBLIC_SITE_URL: string
  MICROSOFT_CLIENT_ID?: string
  MICROSOFT_CLIENT_SECRET?: string
  MICROSOFT_TENANT_ID?: string
  MICROSOFT_SENDER_EMAIL?: string
  RESEND_API_KEY?: string
}

class EnvironmentError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "EnvironmentError"
  }
}

export function validateEnvironment(): EnvConfig {
  const requiredVars = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "POSTGRES_URL",
    "DATABASE_URL",
    "CRON_SECRET",
  ]

  const missing: string[] = []
  const invalid: string[] = []

  // Check for missing variables
  for (const varName of requiredVars) {
    const value = process.env[varName]
    if (!value || value.trim() === "") {
      missing.push(varName)
    }
  }

  if (missing.length > 0) {
    throw new EnvironmentError(`Missing required environment variables: ${missing.join(", ")}`)
  }

  // Validate Supabase URL format
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  try {
    new URL(supabaseUrl)
  } catch {
    invalid.push("NEXT_PUBLIC_SUPABASE_URL (invalid URL format)")
  }

  // Validate database URL format
  const databaseUrl = process.env.DATABASE_URL!
  if (!databaseUrl.startsWith("postgres://") && !databaseUrl.startsWith("postgresql://")) {
    invalid.push("DATABASE_URL (must start with postgres:// or postgresql://)")
  }

  if (invalid.length > 0) {
    throw new EnvironmentError(`Invalid environment variables: ${invalid.join(", ")}`)
  }

  return {
    NEXT_PUBLIC_SUPABASE_URL: supabaseUrl,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    POSTGRES_URL: process.env.POSTGRES_URL!,
    DATABASE_URL: databaseUrl,
    CRON_SECRET: process.env.CRON_SECRET!,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    MICROSOFT_CLIENT_ID: process.env.MICROSOFT_CLIENT_ID,
    MICROSOFT_CLIENT_SECRET: process.env.MICROSOFT_CLIENT_SECRET,
    MICROSOFT_TENANT_ID: process.env.MICROSOFT_TENANT_ID,
    MICROSOFT_SENDER_EMAIL: process.env.MICROSOFT_SENDER_EMAIL,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
  }
}

export function getEnv(): EnvConfig {
  try {
    return validateEnvironment()
  } catch (error) {
    if (error instanceof EnvironmentError) {
      console.error("❌ Environment validation failed:", error.message)
      throw error
    }
    throw error
  }
}

export function isSupabaseConfigured(): boolean {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

export function isMicrosoftConfigured(): boolean {
  return !!(
    process.env.MICROSOFT_CLIENT_ID &&
    process.env.MICROSOFT_CLIENT_SECRET &&
    process.env.MICROSOFT_TENANT_ID &&
    process.env.MICROSOFT_SENDER_EMAIL
  )
}

export function isResendConfigured(): boolean {
  return !!process.env.RESEND_API_KEY
}

export function getEmailProvider(): "microsoft" | "resend" | "none" {
  if (isMicrosoftConfigured()) return "microsoft"
  if (isResendConfigured()) return "resend"
  return "none"
}

// Log environment status on server startup
if (typeof window === "undefined") {
  console.log("🔧 Environment Configuration:")
  console.log("  ✅ Supabase:", isSupabaseConfigured() ? "Configured" : "❌ Not configured")
  console.log("  📧 Email Provider:", getEmailProvider())
  console.log("  🌐 Site URL:", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000")
}
