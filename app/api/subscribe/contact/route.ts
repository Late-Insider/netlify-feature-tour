import { type NextRequest, NextResponse } from "next/server"

import { createEmailTemplate, sendMicrosoftGraphEmail } from "@/lib/microsoft-graph"
import { SITE_URL } from "@/src/lib/site"
import { getServerClient } from "@/src/lib/supabase-server"

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const ADMIN_EMAIL = "team@late.ltd"

type AdminEventKind = "contact"

type ContactPayload = {
  name: string
  email: string
  message: string
}

function normalizeRequiredString(value: unknown): string | null {
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

async function sendContactAcknowledgement({ name, email, message }: ContactPayload) {
  try {
    const subject = "We've received your message"
    const html = await createEmailTemplate(
      subject,
      `
        <p>Hi${name ? ` ${name}` : ""},</p>
        <p>Thanks for reaching out to the Late team. We've received your message and will reply soon.</p>
        <blockquote>${message}</blockquote>
        <p>
          In the meantime you can revisit <a href="${SITE_URL}/contact">${SITE_URL}/contact</a> for more ways to connect.
        </p>
        <p>Stay Late.</p>
      `,
    )

    const result = await sendMicrosoftGraphEmail({
      to: email,
      subject,
      body: html,
    })

    if (!result.success) {
      console.warn(
        JSON.stringify({
          level: "warn",
          scope: "contact-acknowledgement",
          email,
          error: result.error ?? "unknown_error",
        }),
      )
    }
  } catch (error) {
    console.warn(
      JSON.stringify({
        level: "warn",
        scope: "contact-acknowledgement",
        email,
        error: error instanceof Error ? error.message : String(error),
      }),
    )
  }
}

async function notifyAdmin(payload: ContactPayload) {
  try {
    const subject = "New contact form submission"
    const html = await createEmailTemplate(
      subject,
      `
        <p>You have a new message from the Late website.</p>
        <p><strong>Name:</strong> ${payload.name}</p>
        <p><strong>Email:</strong> <a href="mailto:${payload.email}">${payload.email}</a></p>
        <p><strong>Message:</strong></p>
        <blockquote>${payload.message}</blockquote>
      `,
    )

    const result = await sendMicrosoftGraphEmail({
      to: ADMIN_EMAIL,
      subject,
      body: html,
    })

    if (!result.success) {
      console.warn(
        JSON.stringify({
          level: "warn",
          scope: "contact-admin-notification",
          error: result.error ?? "unknown_error",
        }),
      )
    }
  } catch (error) {
    console.warn(
      JSON.stringify({
        level: "warn",
        scope: "contact-admin-notification",
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
  const name = normalizeRequiredString(raw.name)
  const email = normalizeRequiredString(raw.email)
  const message = normalizeRequiredString(raw.message)

  if (!name || !email || !message || !EMAIL_PATTERN.test(email)) {
    return respondInvalidInput()
  }

  const insertPayload = {
    name,
    email,
    message,
  }

  const { error } = await client
    .from("contact_messages")
    .insert(insertPayload)
    .select("id")
    .single()

  if (error) {
    const supabaseError = error as { code?: string | null; message?: string | null; details?: string | null }

    console.error(
      JSON.stringify({
        level: "error",
        scope: "supabase",
        action: "contact_submit",
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

  const payload: ContactPayload = { name, email, message }
  void sendContactAcknowledgement(payload)
  void notifyAdmin(payload)
  triggerAdminEvent("contact", email, payload)

  return NextResponse.json({ ok: true })
}
