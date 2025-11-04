import { type NextRequest, NextResponse } from "next/server"

import { createEmailTemplate, sendMicrosoftGraphEmail } from "@/lib/microsoft-graph"
import { buildSubscriberInsert, hasColumn } from "@/lib/supabase"
import { SITE_URL } from "@/src/lib/site"
import { getServerClient } from "@/src/lib/supabase-server"

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type SubscriberCategory = "auction-creator"

type AdminEventKind = "subscriber"

function normalizeEmail(value: unknown): string | null {
  if (typeof value !== "string") return null
  const trimmed = value.trim().toLowerCase()
  return trimmed.length > 0 ? trimmed : null
}

function normalizeRequiredString(value: unknown): string | null {
  if (typeof value !== "string") return null
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

function normalizeOptionalString(value: unknown): string | null {
  if (typeof value !== "string") return null
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

function normalizeStringList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((entry) => (typeof entry === "string" ? entry.trim() : ""))
      .filter((entry) => entry.length > 0)
  }

  if (typeof value === "string") {
    return value
      .split(/[,\n]/)
      .map((entry) => entry.trim())
      .filter((entry) => entry.length > 0)
  }

  return []
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
    "auction-creator": {
      subject: "We've received your Late auction application",
      content: `
        <p>Thank you for submitting your work to the Late auction team. Our curators will review your application and follow up shortly.</p>
        <p>
          In the meantime, you can learn more about upcoming releases at
          <a href="${SITE_URL}/auction">${SITE_URL}/auction</a>.
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

  const raw = body as Record<string, unknown>
  const email = normalizeEmail(raw.email)
  if (!email || !EMAIL_PATTERN.test(email)) {
    return respondInvalidInput()
  }

  const name = normalizeRequiredString(raw.name)
  const timeSlots = normalizeStringList(raw.timeSlots)

  if (!name || timeSlots.length === 0) {
    return respondInvalidInput()
  }

  const artworkDescription = normalizeOptionalString(raw.artworkDescription)
  const source = normalizeOptionalString(raw.source) ?? "auction_creator_modal"

  const hasSourceColumn = await hasColumn("subscribers", "source")
  const insertPayload = buildSubscriberInsert({
    email,
    category: "auction-creator",
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
      void sendSubscriberConfirmation(email, "auction-creator")
      triggerAdminEvent("subscriber", email, {
        category: "auction-creator",
        name,
        timeSlots,
        artworkDescription,
        source,
        duplicate: true,
      })

      return NextResponse.json({ ok: true, alreadySubscribed: true })
    }

    console.error(
      JSON.stringify({
        level: "error",
        scope: "supabase",
        action: "subscribe_auction_creator",
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

  void sendSubscriberConfirmation(email, "auction-creator")
  triggerAdminEvent("subscriber", email, {
    category: "auction-creator",
    name,
    timeSlots,
    artworkDescription,
    source,
  })

  return NextResponse.json({ ok: true })
}
