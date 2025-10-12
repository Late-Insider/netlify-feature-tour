import EmailDebug from "@/components/email-debug"

export default function EmailDebugPage() {
  return (
    <main className="pt-24 pb-16 bg-black text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center">Admin Notification Debug</h1>
          <p className="text-zinc-300 mb-8 text-center">
            This page helps diagnose issues with admin notifications for form submissions.
          </p>

          <EmailDebug />
        </div>
      </div>
    </main>
  )
}
