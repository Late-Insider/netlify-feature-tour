"use client"

import { Twitter, Linkedin, Facebook, Link2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SocialShareProps {
  title: string
  url: string
  twitterHandle?: string
  description?: string
}

export function SocialShare({ title, url, twitterHandle }: SocialShareProps) {
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}${
      twitterHandle ? `&via=${twitterHandle}` : ""
    }`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url)
    alert("Link copied to clipboard!")
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-zinc-400 text-sm font-medium">Share:</span>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => window.open(shareLinks.twitter, "_blank")}
          className="border-zinc-700 hover:bg-zinc-800 hover:text-purple-400"
        >
          <Twitter className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => window.open(shareLinks.linkedin, "_blank")}
          className="border-zinc-700 hover:bg-zinc-800 hover:text-purple-400"
        >
          <Linkedin className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => window.open(shareLinks.facebook, "_blank")}
          className="border-zinc-700 hover:bg-zinc-800 hover:text-purple-400"
        >
          <Facebook className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={copyToClipboard}
          className="border-zinc-700 hover:bg-zinc-800 hover:text-purple-400 bg-transparent"
        >
          <Link2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}

export { SocialShare as default }
