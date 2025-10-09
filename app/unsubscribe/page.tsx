import { handleUnsubscribe } from "@/actions/unsubscribe-actions"
import { CheckCircle, XCircle, Mail } from "lucide-react"
import Link from "next/link"

export default async function UnsubscribePage({ searchParams }: { searchParams: { token?: string } }) {
  const params = await searchParams
  const token = params.token

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-purple-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Link</h1>
          <p className="text-gray-600 mb-6">This unsubscribe link is invalid or incomplete.</p>
          <Link
            href="/"
            className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    )
  }

  const result = await handleUnsubscribe(token)

  if (!result.success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-purple-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Unsubscribe Failed</h1>
          <p className="text-gray-600 mb-6">{result.message}</p>
          <div className="space-y-3">
            <Link
              href="/"
              className="block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Return Home
            </Link>
            <a
              href="mailto:team@late.ltd"
              className="flex items-center justify-center gap-2 text-purple-600 hover:text-purple-700"
            >
              <Mail className="w-4 h-4" />
              Contact Support
            </a>
          </div>
        </div>
      </div>
    )
  }

  const categoryNames: Record<string, string> = {
    newsletter: "Newsletter",
    shop: "Shop Waitlist",
    podcast: "Podcast Notifications",
    "auction-collector": "Auction Waitlist",
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-purple-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Successfully Unsubscribed</h1>
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600 mb-2">
            <strong>Email:</strong> {result.email}
          </p>
          <p className="text-sm text-gray-600">
            <strong>List:</strong> {categoryNames[result.category || ""] || result.category}
          </p>
        </div>
        <p className="text-gray-600 mb-6">
          You've been removed from our {categoryNames[result.category || ""] || result.category} list. You will no
          longer receive these emails.
        </p>
        <p className="text-sm text-gray-500 mb-6">Changed your mind? You can always resubscribe from our website.</p>
        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Return Home
          </Link>
          <a
            href="mailto:team@late.ltd"
            className="flex items-center justify-center gap-2 text-purple-600 hover:text-purple-700"
          >
            <Mail className="w-4 h-4" />
            Contact Us
          </a>
        </div>
      </div>
    </div>
  )
}
