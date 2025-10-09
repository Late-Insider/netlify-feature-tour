"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

interface FaqItem {
  question: string
  answer: string
}

const faqItems: FaqItem[] = [
  {
    question: "What is the LATE philosophy?",
    answer:
      "The LATE philosophy is about redefining success on your own terms. We believe that true achievement comes not from racing against the clock, but from making a meaningful impact when the moment is right. It's about embracing your own pace and focusing on quality over speed.",
  },
  {
    question: "When will the LATE Collection be available?",
    answer:
      "Our exclusive merchandise collection is coming soon. Sign up for notifications on our website to be the first to know when items become available.",
  },
  {
    question: "How can I listen to the Left Righteously podcast?",
    answer:
      "The Left Righteously podcast is currently in production. You can sign up on our website to be notified when our first episodes are released.",
  },
  {
    question: "How can I support the LATE movement?",
    answer:
      "You can support the LATE movement by signing up for our podcast and shop notifications, and joining our auction waitlist. You can also follow us on social media and share our philosophy with others.",
  },
  {
    question: "Will there be international shipping for merchandise?",
    answer:
      "Yes, we plan to offer international shipping for merchandise. Shipping costs and details will be provided at checkout.",
  },
]

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="py-24 bg-white dark:bg-black">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-900 dark:text-white">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div key={index} className="border border-gray-200 dark:border-zinc-800 rounded-lg overflow-hidden">
                <button
                  className="flex justify-between items-center w-full p-4 text-left bg-gray-50 dark:bg-zinc-900 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                  onClick={() => toggleFaq(index)}
                  aria-expanded={openIndex === index}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span className="font-medium text-gray-900 dark:text-white">{item.question}</span>
                  {openIndex === index ? (
                    <ChevronUp className="h-5 w-5 text-gray-500 dark:text-zinc-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500 dark:text-zinc-400" />
                  )}
                </button>

                <div
                  id={`faq-answer-${index}`}
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="p-4 bg-white dark:bg-zinc-800 text-gray-700 dark:text-zinc-300">{item.answer}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
