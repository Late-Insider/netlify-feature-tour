import { redirect } from "next/navigation"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Newsletter - LATE",
  description: "Every Late Thoughts story now lives inside the weekly newsletter archive.",
}

export default function BlogPage() {
  redirect("/newsletter")
}
