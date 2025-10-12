import EmailTest from "@/components/email-test"

export default function EmailTestPage() {
  return (
    <main className="pt-24 pb-16 bg-black text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center">Email Functionality Test</h1>
          <p className="text-zinc-300 mb-8 text-center">
            This page allows you to test the email functionality of the website.
          </p>

          <EmailTest />
        </div>
      </div>
    </main>
  )
}
