import { type NextRequest, NextResponse } from "next/server"
import { createSubscriber, getSubscribers } from "@/lib/database-client"
import type { CreateSubscriberRequest } from "@/types/database"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const isActive = searchParams.get("isActive")
    const source = searchParams.get("source")

    const filters: any = {}
    if (isActive !== null) {
      filters.isActive = isActive === "true"
    }
    if (source) {
      filters.source = source
    }

    const subscribers = await getSubscribers(filters)

    return NextResponse.json({ success: true, data: subscribers })
  } catch (error) {
    console.error("Error fetching subscribers:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch subscribers" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateSubscriberRequest = await request.json()

    if (!body.email || !body.source) {
      return NextResponse.json({ success: false, error: "Email and source are required" }, { status: 400 })
    }

    const subscriber = await createSubscriber(body)

    return NextResponse.json({ success: true, data: subscriber }, { status: 201 })
  } catch (error) {
    console.error("Error creating subscriber:", error)
    return NextResponse.json({ success: false, error: "Failed to create subscriber" }, { status: 500 })
  }
}
