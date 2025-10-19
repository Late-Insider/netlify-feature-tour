import type { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Beyond Ourselves: Living in an Interconnected World | LATE",
  description: "Explore how every choice we make ripples outward and why we now tell that story through the newsletter archive.",
}

export default function BeyondOurselvesRedirect() {
  redirect("/newsletter/beyond-ourselves-interconnected-world")
}
