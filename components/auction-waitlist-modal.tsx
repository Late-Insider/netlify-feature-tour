"use client"

import type React from "react"
import { useState } from "react"
import { X, Users, Palette, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { handleFormSubmission } from "@/actions/email-actions"

interface AuctionWaitlistModalProps {
  isOpen: boolean
  onClose: () => void
}

type UserType = "collector" | "creator" | null
type TimeSlot = "morning" | "afternoon" | "evening" | "weekend"

export default function AuctionWaitlistModal({ isOpen, onClose }: AuctionWaitlistModalProps) {
  const [userType, setUserType] = useState<UserType>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const [collectorForm, setCollectorForm] = useState({
    name: "",
    email: "",
    timeSlots: [] as TimeSlot[],
  })

  const [creatorForm, setCreatorForm] = useState({
    name: "",
    email: "",
    timeSlots: [] as TimeSlot[],
    artworkDescription: "",
  })

  const timeSlotOptions: { value: TimeSlot; label: string }[] = [
    { value: "morning", label: "Morning (9AM - 12PM)" },
    { value: "afternoon", label: "Afternoon (12PM - 5PM)" },
    { value: "evening", label: "Evening (5PM - 8PM)" },
    { value: "weekend", label: "Weekends" },
  ]

  const handleTimeSlotChange = (slot: TimeSlot, type: "collector" | "creator") => {
    if (type === "collector") {
      setCollectorForm((prev) => ({
        ...prev,
        timeSlots: prev.timeSlots.includes(slot) ? prev.timeSlots.filter((s) => s !== slot) : [...prev.timeSlots, slot],
      }))
    } else {
      setCreatorForm((prev) => ({
        ...prev,
        timeSlots: prev.timeSlots.includes(slot) ? prev.timeSlots.filter((s) => s !== slot) : [...prev.timeSlots, slot],
      }))
    }
  }

 const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()
  setError("")
  setSuccess(false)
  setIsLoading(true)

  const fd = new FormData(e.currentTarget)
  const preferredContactTimes = fd.getAll("preferredContactTimes").map(String)

  try {
    const res = await fetch("/api/subscribe/auction-creator", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: fd.get("name"),
        email: fd.get("email"),
        preferredContactTimes, // ✅ ARRAY from checkboxes
        message: fd.get("message"),
        source: "auction_creator_modal",
      }),
    })

    const result = await res.json()
    if (!res.ok) throw new Error(result.error || "Submission failed")

    setSuccess(true)
    e.currentTarget.reset()
  } catch (err) {
    setError(err instanceof Error ? err.message : "Something went wrong")
  } finally {
    setIsLoading(false)
  }
}

  const resetModal = () => {
    setUserType(null)
    setIsSubmitted(false)
    setEmailSent(false)
    setCollectorForm({ name: "", email: "", timeSlots: [] })
    setCreatorForm({ name: "", email: "", timeSlots: [], artworkDescription: "" })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-zinc-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {!userType ? "Join the Auction" : userType === "collector" ? "Collector Waitlist" : "Creator Application"}
          </h2>
          <button
            onClick={resetModal}
            className="text-gray-500 hover:text-gray-700 dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {!userType && !isSubmitted && (
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-zinc-400 mb-6">
                How would you like to participate in our exclusive auction?
              </p>

              <button
                onClick={() => setUserType("collector")}
                className="w-full p-4 border-2 border-gray-200 dark:border-zinc-600 rounded-lg hover:border-purple-500 dark:hover:border-purple-400 transition-colors group"
              >
                <div className="flex items-center">
                  <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full mr-4 group-hover:bg-purple-200 dark:group-hover:bg-purple-800/50 transition-colors">
                    <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-gray-900 dark:text-white">As a Collector</h3>
                    <p className="text-sm text-gray-600 dark:text-zinc-400">
                      Get early access to limited-edition items
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setUserType("creator")}
                className="w-full p-4 border-2 border-gray-200 dark:border-zinc-600 rounded-lg hover:border-purple-500 dark:hover:border-purple-400 transition-colors group"
              >
                <div className="flex items-center">
                  <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full mr-4 group-hover:bg-purple-200 dark:group-hover:bg-purple-800/50 transition-colors">
                    <Palette className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-gray-900 dark:text-white">As a Creator</h3>
                    <p className="text-sm text-gray-600 dark:text-zinc-400">Submit your work for consideration</p>
                  </div>
                </div>
              </button>
            </div>
          )}

          {userType && !isSubmitted && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Full Name</label>
                <Input
                  type="text"
                  required
                  value={userType === "collector" ? collectorForm.name : creatorForm.name}
                  onChange={(e) => {
                    if (userType === "collector") {
                      setCollectorForm((prev) => ({ ...prev, name: e.target.value }))
                    } else {
                      setCreatorForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                  }}
                  className="bg-zinc-700 border-zinc-600 text-white placeholder:text-zinc-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Email Address</label>
                <Input
                  type="email"
                  required
                  value={userType === "collector" ? collectorForm.email : creatorForm.email}
                  onChange={(e) => {
                    if (userType === "collector") {
                      setCollectorForm((prev) => ({ ...prev, email: e.target.value }))
                    } else {
                      setCreatorForm((prev) => ({ ...prev, email: e.target.value }))
                    }
                  }}
                  className="bg-zinc-700 border-zinc-600 text-white placeholder:text-zinc-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
                  Preferred Contact Times (select all that apply)
                </label>
                <div className="space-y-2">
                  {timeSlotOptions.map((option) => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={
                          userType === "collector"
                            ? collectorForm.timeSlots.includes(option.value)
                            : creatorForm.timeSlots.includes(option.value)
                        }
                        onChange={() => handleTimeSlotChange(option.value, userType)}
                        className="mr-2 rounded border-zinc-600 bg-zinc-700 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-zinc-300">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {userType === "creator" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
                    Brief Description of Your Artwork
                  </label>
                  <Textarea
                    required
                    rows={4}
                    placeholder="Tell us about your artistic style, medium, themes, and what makes your work unique..."
                    value={creatorForm.artworkDescription}
                    onChange={(e) => setCreatorForm((prev) => ({ ...prev, artworkDescription: e.target.value }))}
                    className="bg-zinc-700 border-zinc-600 text-white placeholder:text-zinc-400"
                  />
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setUserType(null)} className="flex-1">
                  Back
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : userType === "collector" ? "Join Waitlist" : "Submit Application"}
                </Button>
              </div>
            </form>
          )}

          {isSubmitted && (
            <div className="text-center py-8 animate-fade-in">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-purple-600 rounded-full p-2">
                  <Check className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                {userType === "collector" ? "Welcome to the Waitlist!" : "Application Submitted!"}
              </h3>
              <p className="text-gray-700 dark:text-zinc-300 mb-4">
                {userType === "collector"
                  ? "You'll be notified when our next auction goes live and get exclusive early access."
                  : "Thank you for your interest! We'll review your application and get back to you soon."}
              </p>
              {emailSent && (
                <p className="text-gray-500 dark:text-zinc-400 text-sm">
                  A confirmation email has been sent to your inbox.
                </p>
              )}
              <Button onClick={resetModal} className="mt-4 bg-purple-600 hover:bg-purple-700 text-white">
                Close
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
