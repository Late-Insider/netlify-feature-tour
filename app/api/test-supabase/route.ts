import { NextResponse } from "next/server"
import { testSupabaseConnection } from "@/lib/supabase"

export async function GET() {
  try {
    const result = await testSupabaseConnection()

    return NextResponse.json(result, {
      status: result.success ? 200 : 503,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: `Connection test failed: ${error}`,
        error: String(error),
      },
      { status: 500 },
    )
  }
}
