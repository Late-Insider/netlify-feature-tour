import { NextResponse, type NextRequest } from "next/server"

import { assertAdminRequest, getEnvDiagnostics } from "@/src/lib/env"

export async function GET(request: NextRequest) {
  if (!assertAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  return NextResponse.json(getEnvDiagnostics())
}
