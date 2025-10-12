import { type NextRequest, NextResponse } from "next/server"
import { createContactSubmission } from "@/lib/database-client"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.name || !body.email || !body.message) {
      return NextResponse.json({ success: false, error: "Name, email, and message are required" }, { status: 400 })
    }

    const submission = await createContactSubmission(body)

    return NextResponse.json({ success: true, data: submission }, { status: 201 })
  } catch (error) {
    console.error("Error creating contact submission:", error)
    return NextResponse.json({ success: false, error: "Failed to create contact submission" }, { status: 500 })
  }
}
