"use client"

import type React from "react"

import { useState } from "react"
import { Headphones, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { handleFormSubmission } from "@/actions/email-actions"

export default function PodcastSection() {
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
      formData.set("form-name", "podcast-notification")
      formData.set("_subject", "Left Righteously Podcast Notification Request")

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
    <section id="podcast" className="py-24 bg-black text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-900/30 mb-6">
                <Headphones className="h-8 w-8 text-purple-400" />
              </div>

              <h2 className="text-3xl md:text-4xl font-bold mb-4">LEFT RIGHTEOUSLY</h2>
              <p className="text-xl text-zinc-300 mb-6">
                Our upcoming podcast exploring the LATE philosophy through conversations with thought leaders,
                entrepreneurs, and creatives who are redefining success on their own terms.
              </p>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-purple-900/20 p-2 rounded-full">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium">Authentic Conversations</h3>
                    <p className="text-zinc-400">
                      Unfiltered discussions about challenging conventional timelines and expectations.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-purple-900/20 p-2 rounded-full">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium">Practical Insights</h3>
                    <p className="text-zinc-400">
                      Actionable strategies for embracing your own pace and redefining success.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-purple-900/20 p-2 rounded-full">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium">Inspiring Stories</h3>
                    <p className="text-zinc-400">
                      Real-life examples of people who have thrived by following their own timelines.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-zinc-800 p-8 rounded-lg">
              {!isSubmitted ? (
                <>
                  <h3 className="text-2xl font-bold mb-4">Coming Soon</h3>
                  <p className="text-zinc-300 mb-6">
                    Sign up to be notified when our first episodes are released and get exclusive bonus content.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="hidden" name="form-name" value="podcast-notification" />
                    <input type="hidden" name="_subject" value="Left Righteously Podcast Notification Request" />

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
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                      disabled={isSending}
                    >
                      {isSending ? "Submitting..." : "Notify Me"}
                    </Button>

                    <p className="text-xs text-zinc-500 text-center">
                      We respect your privacy and will never share your information.
                    </p>
                  </form>
                </>
              ) : (
                <div className="text-center py-8 animate-fade-in">
                  <div className="flex items-center justify-center mb-4">
                    <div className="bg-purple-600 rounded-full p-2">
                      <Check className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h4 className="text-xl font-bold mb-2">Thanks for signing up!</h4>
                  <p className="text-zinc-300">We'll notify you as soon as our first episodes are released.</p>
                  {emailSent && (
                    <p className="text-zinc-500 text-sm mt-2">A confirmation email has been sent to your inbox.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
