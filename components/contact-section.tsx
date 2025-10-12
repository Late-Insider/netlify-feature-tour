"use client"

import type React from "react"
import { useState } from "react"
import { Mail, Instagram, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { handleContactForm } from "@/actions/email-actions"

// Custom X (Twitter) icon component
const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

export function ContactSection() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSending(true)
    setError("")

    try {
      const formDataObj = new FormData()
      formDataObj.set("name", formData.name)
      formDataObj.set("email", formData.email)
      formDataObj.set("message", formData.message)
      formDataObj.set("form-name", "contact-form")

      const result = await handleContactForm(formDataObj)

      if (result.success) {
        setIsSubmitted(true)
        setEmailSent(result.emailSent || false)
        setFormData({ name: "", email: "", message: "" })
      } else {
        setError(result.message || "Failed to send message. Please try again.")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsSending(false)
    }
  }

  return (
    <section id="contact" className="py-24 bg-white dark:bg-black">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">Get In Touch</h2>
              <p className="text-lg text-gray-700 dark:text-zinc-300 mb-8">
                Have questions about the LATE movement or want to collaborate? We'd love to hear from you.
              </p>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <Mail className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Email</h3>
                    <p className="text-gray-600 dark:text-zinc-400">
                      <a
                        href="mailto:team@late.ltd"
                        className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                      >
                        team@late.ltd
                      </a>
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Follow Us</h3>
                  <div className="flex space-x-4">
                    <a
                      href="https://www.instagram.com/late.limited/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-100 dark:bg-zinc-800 p-3 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/20 transition-colors"
                      aria-label="Instagram"
                    >
                      <Instagram className="w-5 h-5 text-gray-700 dark:text-zinc-300" />
                    </a>
                    <a
                      href="https://x.com/TheLateTeam"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-100 dark:bg-zinc-800 p-3 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/20 transition-colors"
                      aria-label="X (Twitter)"
                    >
                      <XIcon className="w-5 h-5 text-gray-700 dark:text-zinc-300" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div>
              {!isSubmitted ? (
                <div className="bg-gray-50 dark:bg-zinc-800 p-8 rounded-lg">
                  <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Send Us a Message</h3>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="hidden" name="form-name" value="contact-form" />

                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
                        Name
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="bg-white dark:bg-zinc-700 border-gray-300 dark:border-zinc-600 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1"
                      >
                        Email
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="bg-white dark:bg-zinc-700 border-gray-300 dark:border-zinc-600 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1"
                      >
                        Message
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        required
                        className="bg-white dark:bg-zinc-700 border-gray-300 dark:border-zinc-600 text-gray-900 dark:text-white"
                      />
                    </div>

                    {error && (
                      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                        {error}
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                      disabled={isSending}
                    >
                      {isSending ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </div>
              ) : (
                <div className="bg-gray-50 dark:bg-zinc-800 p-8 rounded-lg h-full flex flex-col items-center justify-center text-center animate-fade-in">
                  <div className="bg-purple-600 rounded-full p-3 mb-4">
                    <Check className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Message Sent!</h3>
                  <p className="text-gray-700 dark:text-zinc-300 mb-4">
                    Thank you for reaching out. We'll get back to you as soon as possible.
                  </p>
                  {emailSent && (
                    <p className="text-gray-500 dark:text-zinc-400 text-sm mb-4">
                      A confirmation email has been sent to your inbox.
                    </p>
                  )}
                  <Button
                    onClick={() => setIsSubmitted(false)}
                    variant="outline"
                    className="border-purple-300 dark:border-purple-700 text-purple-600 dark:text-purple-400"
                  >
                    Send Another Message
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-20 pt-8 border-t border-gray-200 dark:border-zinc-800 text-center">
            <p className="text-gray-600 dark:text-zinc-400">
              &copy; {new Date().getFullYear()} LATE. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactSection
