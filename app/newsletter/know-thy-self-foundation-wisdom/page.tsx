import type { Metadata } from "next"
import NewsletterClientPage from "../[slug]/client-page"

export const metadata: Metadata = {
  title: "Know Thy Self: The Foundation of All Wisdom | LATE Weekly Insights",
  description:
    "The ancient Greek maxim 'Know Thyself' remains the most important journey you'll ever undertake—and the key to unlocking your authentic potential.",
}

export default function NewsletterPage() {
  return <NewsletterClientPage params={{ slug: "know-thy-self-foundation-wisdom" }} />
}
