import { EmailTest } from "@/components/email-test"
import { EmailConfirmationExplanation } from "@/email-confirmation-explanation"

export default function EmailTestPage() {
  return (
    <main className="min-h-screen bg-black text-white py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Email System Testing</h1>
        <EmailTest />
        <EmailConfirmationExplanation />
      </div>
    </main>
  )
}
