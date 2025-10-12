import { type NextRequest, NextResponse } from "next/server"
import { createCreatorApplication } from "@/lib/database-client"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.name || !body.email) {
      return NextResponse.json({ success: false, error: "Name and email are required" }, { status: 400 })
    }

    const application = await createCreatorApplication(body)

    return NextResponse.json({ success: true, data: application }, { status: 201 })
  } catch (error) {
    console.error("Error creating creator application:", error)
    return NextResponse.json({ success: false, error: "Failed to create creator application" }, { status: 500 })
  }
}
