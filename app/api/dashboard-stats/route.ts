import { NextResponse } from "next/server"
import { getSubscriberCountByCategory } from "@/lib/supabase"
import { sql } from "@vercel/postgres"

export async function GET() {
  try {
    const [newsletter, shop, podcast, auctionCollector, contact, creatorApps] = await Promise.all([
      getSubscriberCountByCategory("newsletter"),
      getSubscriberCountByCategory("shop"),
      getSubscriberCountByCategory("podcast"),
      getSubscriberCountByCategory("auction-collector"),
      getContactCount(),
      getCreatorApplicationCount(),
    ])

    return NextResponse.json({
      success: true,
      counts: {
        newsletter,
        shop,
        podcast,
        "auction-collector": auctionCollector,
        "auction-creator": creatorApps,
        contact,
      },
    })
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch dashboard stats",
        counts: {
          newsletter: 0,
          shop: 0,
          podcast: 0,
          "auction-collector": 0,
          "auction-creator": 0,
          contact: 0,
        },
      },
      { status: 500 },
    )
  }
}

async function getContactCount(): Promise<number> {
  try {
    const result = await sql`SELECT COUNT(*) as count FROM contact_submissions`
    return Number.parseInt(result.rows[0]?.count || "0")
  } catch (error) {
    console.error("Error getting contact count:", error)
    return 0
  }
}

async function getCreatorApplicationCount(): Promise<number> {
  try {
    const result = await sql`SELECT COUNT(*) as count FROM creator_applications`
    return Number.parseInt(result.rows[0]?.count || "0")
  } catch (error) {
    console.error("Error getting creator application count:", error)
    return 0
  }
}
