"use client"

import type React from "react"
import { useState } from "react"
import { Check } from "lucide-react"
import { handleFormSubmission } from "@/actions/email-actions"
import { AuctionWaitlistModal } from "@/components/auction-waitlist-modal"

export function ShopTeaser() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [email, setEmail] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)

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
    <>
      <section id="shop" className="py-20 px-6 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            EXCLUSIVE <span className="text-purple-400">AUCTION</span>
          </h2>
          <p className="text-xl text-zinc-400 mb-8 max-w-2xl mx-auto">
            Limited-edition items curated for those who value time and craft. Be the first to know when our next auction
            drops.
          </p>
          {!isSubmitted ? (
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105"
            >
              Join the Auction
            </button>
          ) : (
            <div className="text-center animate-fade-in">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-purple-600 rounded-full p-2 shadow-lg shadow-purple-500/50">
                  <Check className="w-6 h-6 text-white" />
                </div>
              </div>
              <h4 className="text-xl font-bold mb-2 text-white">Thanks for signing up!</h4>
              <p className="text-zinc-300">We'll notify you as soon as our collection is available.</p>
              {emailSent && (
                <p className="text-zinc-400 text-sm mt-2">A confirmation email has been sent to your inbox.</p>
              )}
            </div>
          )}
        </div>
      </section>

      <AuctionWaitlistModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}

export default ShopTeaser
