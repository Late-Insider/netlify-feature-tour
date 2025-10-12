"use client"

import { useState } from "react"
import { Play, Pause } from "lucide-react"

const episodes = [
  {
    title: "The Art of Doing Nothing",
    duration: "45:32",
    description: "Exploring the power of rest and intentional downtime",
  },
  {
    title: "Breaking Free from Productivity Porn",
    duration: "38:15",
    description: "Why constant optimization might be holding you back",
  },
  {
    title: "Time Scarcity in the Digital Age",
    duration: "52:08",
    description: "Understanding our relationship with time in modern life",
  },
]

export function PodcastSection() {
  const [playing, setPlaying] = useState<number | null>(null)

  return (
    <section className="py-20 px-6 bg-zinc-900/50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-4">Late Talks Podcast</h2>
        <p className="text-center text-zinc-400 mb-12">
          Coming Soon - Deep conversations about time, productivity, and intentional living
        </p>
        <div className="space-y-4">
          {episodes.map((episode, index) => (
            <div
              key={index}
              className="bg-black border border-zinc-800 rounded-lg p-6 hover:border-purple-500 transition-all"
            >
              <div className="flex items-start gap-4">
                <button
                  onClick={() => setPlaying(playing === index ? null : index)}
                  className="w-12 h-12 flex-shrink-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center hover:opacity-90 transition-opacity"
                >
                  {playing === index ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                </button>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{episode.title}</h3>
                  <p className="text-sm text-zinc-400 mb-2">{episode.description}</p>
                  <span className="text-xs text-zinc-500">{episode.duration}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <form className="mt-12 max-w-md mx-auto">
          <label htmlFor="podcast-email" className="block text-center mb-4 text-zinc-400">
            Get notified when the podcast launches
          </label>
          <div className="flex gap-2">
            <input
              type="email"
              id="podcast-email"
              placeholder="your@email.com"
              className="flex-1 px-4 py-3 bg-black border border-zinc-800 rounded-lg focus:outline-none focus:border-purple-500"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              Notify Me
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}

export default PodcastSection
