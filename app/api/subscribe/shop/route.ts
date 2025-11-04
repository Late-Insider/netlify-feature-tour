import { type NextRequest, NextResponse } from "next/server"

import { createEmailTemplate, sendMicrosoftGraphEmail } from "@/lib/microsoft-graph"
import { buildSubscriberInsert, hasColumn } from "@/lib/supabase"
import { SITE_URL } from "@/src/lib/site"
import { getServerClient } from "@/src/lib/supabase-server"

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type SubscriberCategory = "shop"

type AdminEventKind = "subscriber"

function normalizeEmail(value: unknown): string | null {
  if (typeof value !== "string") return null
  const trimmed = value.trim().toLowerCase()
  return trimmed.length > 0 ? trimmed : null
}

function normalizeOptionalString(value: unknown): string | null {
  if (typeof value !== "string") return null
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

function respondInvalidInput(): NextResponse {
  return NextResponse.json({ ok: false, reason: "invalid_input" }, { status: 422 })
}

function triggerAdminEvent(kind: AdminEventKind, subject: string, payload: Record<string, unknown>) {
  queueMicrotask(() => {
    console.info(
      JSON.stringify({
        level: "info",
        scope: "admin-event",
        kind,
        subject,
        payload,
        at: new Date().toISOString(),
      }),
    )
  })
}

async function sendSubscriberConfirmation(email: string, category: SubscriberCategory) {
  const templates: Record<SubscriberCategory, { subject: string; content: string }> = {
    shop: {
      subject: "You're on the Late Shop waitlist",
      content: `
        <p>You're all set. We'll email you as soon as the Late shop goes live.</p>
        <p>
          Want a sneak peek? Keep an eye on <a href="${SITE_URL}/shop">${SITE_URL}/shop</a> for updates.
        </p>
        <p>Stay Late.</p>
      `,
    },
  }

  const template = templates[category]
  if (!template) {
    return
  }

  try {
    const html = await createEmailTemplate(template.subject, template.content)
    const result = await sendMicrosoftGraphEmail({
      to: email,
      subject: template.subject,
      body: html,
    })

    if (!result.success) {
      console.warn(
        JSON.stringify({
          level: "warn",
          scope: "subscriber-confirmation",
          category,
          email,
          error: result.error ?? "unknown_error",
        }),
      )
    }
  } catch (error) {
    console.warn(
      JSON.stringify({
        level: "warn",
        scope: "subscriber-confirmation",
        category,
        email,
        error: error instanceof Error ? error.message : String(error),
      }),
    )
  }
}

export async function POST(request: NextRequest) {
  const client = getServerClient()
  if (!client) {
    return NextResponse.json({ ok: false, reason: "supabase_env_missing" }, { status: 503 })
  }

  const body = await request.json().catch(() => null)
  if (!body || typeof body !== "object") {
    return respondInvalidInput()
  }

  const email = normalizeEmail((body as Record<string, unknown>).email)
  if (!email || !EMAIL_PATTERN.test(email)) {
    return respondInvalidInput()
  }

  const name = normalizeOptionalString((body as Record<string, unknown>).name)
  const source = normalizeOptionalString((body as Record<string, unknown>).source) ?? "shop_notify_me"

  const hasSourceColumn = await hasColumn("subscribers", "source")
  const insertPayload = buildSubscriberInsert({
    email,
    category: "shop",
    status: "pending",
    source,
    hasSourceColumn,
  })

  const { error } = await client
    .from("subscribers")
    .insert(insertPayload)
    .select("id")
    .single()

  if (error) {
    const supabaseError = error as { code?: string | null; message?: string | null; details?: string | null }
    if (supabaseError.code === "23505") {
      void sendSubscriberConfirmation(email, "shop")
      triggerAdminEvent("subscriber", email, {
        category: "shop",
        source,
        name,
        duplicate: true,
      })

      return NextResponse.json({ ok: true, alreadySubscribed: true })
    }

    console.error(
      JSON.stringify({
        level: "error",
        scope: "supabase",
        action: "subscribe_shop",
        code: supabaseError.code ?? null,
        details: supabaseError.details ?? supabaseError.message ?? null,
      }),
    )

    return NextResponse.json(
      {
        ok: false,
        reason: "supabase_error",
        code: supabaseError.code ?? null,
        details: supabaseError.details ?? supabaseError.message ?? null,
      },
      { status: 400 },
    )
  }

  void sendSubscriberConfirmation(email, "shop")
  triggerAdminEvent("subscriber", email, {
    category: "shop",
    source,
    name,
  })

  return NextResponse.json({ ok: true })
}
