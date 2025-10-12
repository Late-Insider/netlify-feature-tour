"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-zinc-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-white hover:text-purple-400 transition-colors">
            LATE
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/#mission" className="text-zinc-300 hover:text-white transition-colors">
              Mission
            </Link>
            <Link href="/newsletter" className="text-zinc-300 hover:text-white transition-colors">
              Newsletter
            </Link>
            <Link href="/impact" className="text-zinc-300 hover:text-white transition-colors">
              Impact
            </Link>
            <Link href="/#shop" className="text-zinc-300 hover:text-white transition-colors">
              Shop
            </Link>
            <Link href="/#podcast" className="text-zinc-300 hover:text-white transition-colors">
              Podcast
            </Link>
            <Link href="/#contact" className="text-zinc-300 hover:text-white transition-colors">
              Contact
            </Link>
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-purple-400 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-4 border-t border-zinc-800">
            <Link
              href="/#mission"
              className="block text-zinc-300 hover:text-white transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Mission
            </Link>
            <Link
              href="/newsletter"
              className="block text-zinc-300 hover:text-white transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Newsletter
            </Link>
            <Link
              href="/impact"
              className="block text-zinc-300 hover:text-white transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Impact
            </Link>
            <Link
              href="/#shop"
              className="block text-zinc-300 hover:text-white transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Shop
            </Link>
            <Link
              href="/#podcast"
              className="block text-zinc-300 hover:text-white transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Podcast
            </Link>
            <Link
              href="/#contact"
              className="block text-zinc-300 hover:text-white transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
