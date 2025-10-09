"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Testimonial {
  id: number
  quote: string
  author: string
  title: string
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    quote:
      "This book completely changed my perspective on time and success. A must-read for anyone feeling the pressure of society's timeline.",
    author: "Alex Johnson",
    title: "Entrepreneur & Mindfulness Coach",
  },
  {
    id: 2,
    quote:
      "The Ultimate Truth delivers exactly what it promises - a profound understanding of how to thrive on your own timeline. Phoenix's insights are both practical and deeply philosophical.",
    author: "Maya Williams",
    title: "Bestselling Author",
  },
  {
    id: 3,
    quote:
      "I've never read anything that so perfectly articulates the anxiety of our time-obsessed culture and offers such a refreshing alternative. This book is revolutionary.",
    author: "David Chen",
    title: "Tech Executive & Speaker",
  },
  {
    id: 4,
    quote:
      "A powerful manifesto for anyone who's ever felt behind. The concepts in this book have transformed my relationship with time and success.",
    author: "Sarah Rodriguez",
    title: "Mental Health Advocate",
  },
]

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="py-16 bg-gray-50 dark:bg-zinc-950">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-900 dark:text-white">
            What Readers Are Saying
          </h2>

          <div className="relative bg-white dark:bg-zinc-800 p-8 md:p-12 rounded-lg shadow-md dark:shadow-none">
            <div className="absolute top-8 left-8 text-purple-400 opacity-30">
              <Quote size={60} />
            </div>

            <div className="relative z-10">
              <p className="text-xl md:text-2xl text-gray-700 dark:text-zinc-300 mb-8 italic">
                "{testimonials[currentIndex].quote}"
              </p>

              <div className="flex flex-col">
                <span className="font-bold text-gray-900 dark:text-white">{testimonials[currentIndex].author}</span>
                <span className="text-gray-500 dark:text-zinc-400">{testimonials[currentIndex].title}</span>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                size="icon"
                onClick={prevTestimonial}
                className="rounded-full"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>

              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-3 h-3 rounded-full ${
                      index === currentIndex ? "bg-purple-600 dark:bg-purple-400" : "bg-gray-300 dark:bg-zinc-600"
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={nextTestimonial}
                className="rounded-full"
                aria-label="Next testimonial"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
