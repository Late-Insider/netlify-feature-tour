import { EmailDebug } from "@/components/email-debug"

export default function EmailDebugPage() {
  return (
    <main className="min-h-screen bg-black text-white py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Email Configuration Debug</h1>
        <EmailDebug />
      </div>
    </main>
  )
}
