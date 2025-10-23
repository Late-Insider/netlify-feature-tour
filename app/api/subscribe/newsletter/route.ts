import { type NextRequest, NextResponse } from "next/server"

import { addSubscriber } from "@/lib/supabase"
import { createEmailTemplate, sendMicrosoftGraphEmail } from "@/lib/microsoft-graph"

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const REQUIRED_GRAPH_KEYS = [
  "MICROSOFT_TENANT_ID",
  "MICROSOFT_CLIENT_ID",
  "MICROSOFT_CLIENT_SECRET",
  "MICROSOFT_SENDER_EMAIL",
]

function hasGraphConfig(): boolean {
  return REQUIRED_GRAPH_KEYS.every((key) => Boolean(process.env[key as keyof NodeJS.ProcessEnv]))
}

async function sendConfirmationEmail(email: string) {
  if (!hasGraphConfig()) {
    return { sent: false }
  }

  try {
    const html = await createEmailTemplate(
      "Confirm your newsletter subscription",
      `<p>Thanks for joining the Late newsletter. We'll send you stories once you confirm.</p>
       <p>If you didn't request this, you can ignore this email.</p>`,
    )

    const result = await sendMicrosoftGraphEmail({
      to: email,
      subject: "Please confirm your Late newsletter subscription",
      body: html,
    })

    if (!result.success) {
      console.warn(
        JSON.stringify({
          level: "warn",
          scope: "newsletter-confirmation",
          error: result.error,
        }),
      )
    }

    return { sent: result.success }
  } catch (error) {
    console.warn(
      JSON.stringify({
        level: "warn",
        scope: "newsletter-confirmation",
        error: error instanceof Error ? error.message : String(error),
      }),
    )
    return { sent: false }
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)

  if (!body || typeof body.email !== "string") {
    return NextResponse.json({ ok: false, reason: "Email is required" }, { status: 400 })
  }

  const email = body.email.trim().toLowerCase()
  const source = typeof body.source === "string" ? body.source.trim() : null

  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ ok: false, reason: "Please provide a valid email." }, { status: 422 })
  }

  const result = await addSubscriber({ email, category: "newsletter", source })

  if (result.disabled) {
    return NextResponse.json(
      { ok: false, reason: "Subscriptions are temporarily unavailable." },
      { status: 503 },
    )
  }

  if (result.error && !result.isNew) {
    const alreadyExists = result.error.toLowerCase().includes("already exists")
    if (alreadyExists) {
      await sendConfirmationEmail(email)
      return NextResponse.json({ ok: true, alreadySubscribed: true })
    }

    return NextResponse.json(
      { ok: false, reason: result.error ?? "Unable to save subscription." },
      { status: 400 },
    )
  }

  await sendConfirmationEmail(email)

  return NextResponse.json({ ok: true })
}
