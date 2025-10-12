"use client"

import { useState } from "react"
import { ThumbsUp, Heart, Lightbulb, Flame } from "lucide-react"

const reactions = [
  { icon: ThumbsUp, label: "Helpful", color: "text-blue-400" },
  { icon: Heart, label: "Loved it", color: "text-red-400" },
  { icon: Lightbulb, label: "Insightful", color: "text-yellow-400" },
  { icon: Flame, label: "Fire", color: "text-orange-400" },
]

export function BlogReactions() {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div className="flex items-center gap-2 my-8">
      <span className="text-sm text-zinc-400 mr-2">How was this post?</span>
      {reactions.map(({ icon: Icon, label, color }) => (
        <button
          key={label}
          onClick={() => setSelected(label)}
          className={`p-2 rounded-lg border transition-all ${
            selected === label ? `${color} border-current bg-current/10` : "border-zinc-800 hover:border-zinc-700"
          }`}
          title={label}
        >
          <Icon className="w-5 h-5" />
        </button>
      ))}
    </div>
  )
}
