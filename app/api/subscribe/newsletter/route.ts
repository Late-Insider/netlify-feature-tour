import { type NextRequest, NextResponse } from "next/server"

import { createEmailTemplate, sendMicrosoftGraphEmail } from "@/lib/microsoft-graph"
import { buildSubscriberInsert, hasColumn } from "@/lib/supabase"
import { SITE_URL } from "@/src/lib/site"
import { getServerClient } from "@/src/lib/supabase-server"

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type SubscriberCategory = "newsletter"

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
    newsletter: {
      subject: "Please confirm your Late newsletter subscription",
      content: `
        <p>Thanks for joining the Late newsletter. We'll send you stories once you confirm.</p>
        <p>
          If you didn't request this, you can ignore this email or let us know at
          <a href="mailto:team@late.ltd">team@late.ltd</a>.
        </p>
        <p>
          You can also explore our latest features at
          <a href="${SITE_URL}/">${SITE_URL}</a> while you wait.
        </p>
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

  const source = normalizeOptionalString((body as Record<string, unknown>).source)

  const hasSourceColumn = await hasColumn("subscribers", "source")
  const insertPayload = buildSubscriberInsert({
    email,
    category: "newsletter",
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
      void sendSubscriberConfirmation(email, "newsletter")
      triggerAdminEvent("subscriber", email, {
        category: "newsletter",
        source,
        duplicate: true,
      })

      return NextResponse.json({ ok: true, alreadySubscribed: true })
    }

    console.error(
      JSON.stringify({
        level: "error",
        scope: "supabase",
        action: "subscribe_newsletter",
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

  void sendSubscriberConfirmation(email, "newsletter")
  triggerAdminEvent("subscriber", email, {
    category: "newsletter",
    source,
  })

  return NextResponse.json({ ok: true })
}
