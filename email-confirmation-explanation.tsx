"use client"

export function EmailConfirmationExplanation() {
  return (
    <div className="max-w-2xl mx-auto my-12 p-8 bg-zinc-900 border border-zinc-800 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">About Email Confirmation</h2>
      <div className="space-y-4 text-zinc-400">
        <p>When you submit a comment, we send two emails:</p>
        <ol className="list-decimal list-inside space-y-2 ml-4">
          <li>
            <strong className="text-white">To You:</strong> A thank you message with your comment and an invitation to
            subscribe to our newsletter
          </li>
          <li>
            <strong className="text-white">To Admin:</strong> A notification about your new comment so we can respond
            quickly
          </li>
        </ol>
        <p className="pt-4">
          This system ensures you get immediate confirmation and we can engage with your thoughts promptly. Your email
          is never shared with third parties.
        </p>
      </div>
    </div>
  )
}
