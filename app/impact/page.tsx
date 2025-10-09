import type { Metadata } from "next"
import ImpactPageClient from "./ImpactPageClient"

export const metadata: Metadata = {
  title: "Impact - LATE",
  description: "Join our movement to make a meaningful impact on your own timeline.",
}

export default function ImpactPage() {
  return <ImpactPageClient />
}
