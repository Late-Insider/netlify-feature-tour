import { type NextRequest, NextResponse } from "next/server"
import { getProducts } from "@/lib/database-client"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const isAvailable = searchParams.get("isAvailable")
    const category = searchParams.get("category")

    const filters: any = {}
    if (isAvailable !== null) {
      filters.isAvailable = isAvailable === "true"
    }
    if (category) {
      filters.category = category
    }

    const products = await getProducts(filters)

    return NextResponse.json({ success: true, data: products })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch products" }, { status: 500 })
  }
}
