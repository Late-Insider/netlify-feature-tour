"use client"

import type React from "react"

import { useState } from "react"
import { ShoppingBag, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { handleFormSubmission } from "@/actions/email-actions"

export default function ShopTeaser() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [email, setEmail] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSending(true)

    try {
      const formData = new FormData()
      formData.set("email", email)
      formData.set("form-name", "shop-notification")
      formData.set("_subject", "LATE Shop Notification Request")

      const result = await handleFormSubmission(formData)

      if (result.success) {
        setIsSubmitted(true)
        setEmailSent(result.emailSent || false)
      } else {
        console.error("Form submission failed:", result.message)
      }
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSending(false)
    }
  }

  return (
    <section id="shop" className="py-24 bg-gray-100 dark:bg-zinc-900">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 mb-6 shadow-lg shadow-purple-500/20">
            <ShoppingBag className="h-8 w-8 text-purple-600 dark:text-purple-400" />
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">THE AGE OF LATE</h2>
          <p className="text-xl text-gray-700 dark:text-zinc-300 mb-8">
            Our exclusive merchandise collection is coming soon. Sign up to be notified when items become available.
          </p>

          <div className="bg-white dark:bg-zinc-800 p-8 rounded-lg shadow-md dark:shadow-none max-w-md mx-auto">
            {!isSubmitted ? (
              <>
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Get Notified</h3>
                <p className="text-gray-600 dark:text-zinc-400 mb-6">Be the first to know when our collection drops.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <input type="hidden" name="form-name" value="shop-notification" />
                  <input type="hidden" name="_subject" value="LATE Shop Notification Request" />

                  <div>
                    <Input
                      type="email"
                      name="email"
                      placeholder="Your email address"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-zinc-700 border-zinc-600 text-white placeholder:text-zinc-400"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300"
                    disabled={isSending}
                  >
                    {isSending ? "Submitting..." : "Notify Me"}
                  </Button>
                </form>
              </>
            ) : (
              <div className="text-center animate-fade-in">
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-purple-600 rounded-full p-2 shadow-lg shadow-purple-500/50">
                    <Check className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h4 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Thanks for signing up!</h4>
                <p className="text-gray-700 dark:text-zinc-300">
                  We'll notify you as soon as our collection is available.
                </p>
                {emailSent && (
                  <p className="text-gray-500 dark:text-zinc-400 text-sm mt-2">
                    A confirmation email has been sent to your inbox.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
