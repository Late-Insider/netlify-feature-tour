"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, MessageSquare, Palette, UserCheck, Radio, Send, CheckCircle, AlertCircle, RefreshCw } from "lucide-react"

interface EmailStats {
  category: string
  count: number
  icon: React.ReactNode
  color: string
}

export default function EmailAutomationPage() {
  const [selectedCategory, setSelectedCategory] = useState("newsletter")
  const [testEmail, setTestEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)
  const [stats, setStats] = useState<EmailStats[]>([
    { category: "Newsletter Subscribers", count: 0, icon: <Mail className="w-4 h-4" />, color: "bg-blue-500" },
    { category: "Shop Waitlist", count: 0, icon: <Radio className="w-4 h-4" />, color: "bg-green-500" },
    { category: "Podcast Notifications", count: 0, icon: <Radio className="w-4 h-4" />, color: "bg-red-500" },
    { category: "Auction Collectors", count: 0, icon: <UserCheck className="w-4 h-4" />, color: "bg-purple-500" },
    { category: "Auction Creators", count: 0, icon: <Palette className="w-4 h-4" />, color: "bg-pink-500" },
    {
      category: "Contact Form Submissions",
      count: 0,
      icon: <MessageSquare className="w-4 h-4" />,
      color: "bg-orange-500",
    },
  ])

  const fetchStats = async () => {
    setIsRefreshing(true)
    try {
      const response = await fetch("/api/dashboard-stats")
      const data = await response.json()
      if (data.success) {
        setStats([
          {
            category: "Newsletter Subscribers",
            count: data.counts.newsletter || 0,
            icon: <Mail className="w-4 h-4" />,
            color: "bg-blue-500",
          },
          {
            category: "Shop Waitlist",
            count: data.counts.shop || 0,
            icon: <Radio className="w-4 h-4" />,
            color: "bg-green-500",
          },
          {
            category: "Podcast Notifications",
            count: data.counts.podcast || 0,
            icon: <Radio className="w-4 h-4" />,
            color: "bg-red-500",
          },
          {
            category: "Auction Collectors",
            count: data.counts["auction-collector"] || 0,
            icon: <UserCheck className="w-4 h-4" />,
            color: "bg-purple-500",
          },
          {
            category: "Auction Creators",
            count: data.counts["auction_creator"] || 0,
            icon: <Palette className="w-4 h-4" />,
            color: "bg-pink-500",
          },
          {
            category: "Contact Form Submissions",
            count: data.counts.contact || 0,
            icon: <MessageSquare className="w-4 h-4" />,
            color: "bg-orange-500",
          },
        ])
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchStats()
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleSendTestEmail = async () => {
    if (!testEmail) {
      setResult({ success: false, message: "Please enter a test email address" })
      return
    }

    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/email-automation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "send-test",
          email: testEmail,
          testType: selectedCategory,
        }),
      })

      const data = await response.json()
      setResult({
        success: data.success,
        message: data.success ? "Test email sent successfully!" : data.error || "Failed to send test email",
      })
    } catch (error) {
      setResult({ success: false, message: "Failed to send test email" })
    } finally {
      setIsLoading(false)
    }
  }

  const getEmailTemplate = (category: string) => {
    const templates: Record<string, { subject: string; content: string }> = {
      newsletter: {
        subject: "Welcome to the Inner Circle",
        content: `Thank you for subscribing to the LATE newsletter. You're now signed up to receive our weekly insights, stories, and updates directly in your inbox.

Stay Late.
The best things are always worth the wait ;)

– The LATE Team

Want to change how you receive these emails? You can unsubscribe from this list here.`,
      },
      shop: {
        subject: "You're on the List for The Age of Late",
        content: `Thank you for your interest! You've been added to our exclusive waitlist and will be the first to know when our new collection drops.

Stay Late.
The best things are always worth the wait ;)

– The LATE Team

Want to change how you receive these emails? You can unsubscribe from this list here.`,
      },
      podcast: {
        subject: "Get Ready to Listen",
        content: `Thanks for signing up! We'll send you a notification as soon as our first episodes of 'Left Righteously' are released. Prepare for a thought-provoking listen.

Stay Late.
The best things are always worth the wait ;)

– The LATE Team

Want to change how you receive these emails? You can unsubscribe from this list here.`,
      },
      "auction-collector": {
        subject: "Welcome to The LATE Auction Waitlist",
        content: `You're on the list! Thank you for joining the LATE Auction Waitlist. You'll receive an exclusive early access link before our next auction goes live.

Stay Late.
The best things are always worth the wait ;)

– The LATE Team

Want to change how you receive these emails? You can unsubscribe from this list here.`,
      },
      "auction_creator": {
        subject: "Your LATE Auction Application is Received",
        content: `Thank you for your application! We appreciate your interest in collaborating with us. Our team is reviewing your submission and will be in touch soon.

Stay Late.
The best things are always worth the wait ;)

– The LATE Team`,
      },
      contact: {
        subject: "We've Received Your Message",
        content: `Thank you for reaching out to LATE. We appreciate you getting in touch and will respond as soon as possible.

Stay Late.
The best things are always worth the wait ;)

– The LATE Team`,
      },
    }

    return templates[category] || templates.newsletter
  }

  const currentTemplate = getEmailTemplate(selectedCategory)

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Email Automation Dashboard</h1>
            <p className="text-zinc-400">Manage email campaigns and subscriber communications</p>
          </div>
          <Button
            onClick={fetchStats}
            disabled={isRefreshing}
            variant="outline"
            className="bg-zinc-900 border-zinc-700 hover:bg-zinc-800"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh Stats
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-zinc-400">{stat.category}</p>
                    <p className="text-2xl font-bold">{stat.count}</p>
                    <p className="text-xs text-zinc-500 mt-1">Real-time from database</p>
                  </div>
                  <div className={`p-2 rounded-full ${stat.color}`}>{stat.icon}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-6">
          <TabsList className="grid grid-cols-3 lg:grid-cols-6 bg-zinc-900">
            <TabsTrigger value="newsletter" className="data-[state=active]:bg-blue-600">
              <Mail className="w-4 h-4 mr-2" />
              Newsletter
            </TabsTrigger>
            <TabsTrigger value="shop" className="data-[state=active]:bg-green-600">
              <Radio className="w-4 h-4 mr-2" />
              Shop
            </TabsTrigger>
            <TabsTrigger value="podcast" className="data-[state=active]:bg-red-600">
              <Radio className="w-4 h-4 mr-2" />
              Podcast
            </TabsTrigger>
            <TabsTrigger value="auction-collector" className="data-[state=active]:bg-purple-600">
              <UserCheck className="w-4 h-4 mr-2" />
              Collectors
            </TabsTrigger>
            <TabsTrigger value="auction_creator" className="data-[state=active]:bg-pink-600">
              <Palette className="w-4 h-4 mr-2" />
              Creators
            </TabsTrigger>
            <TabsTrigger value="contact" className="data-[state=active]:bg-orange-600">
              <MessageSquare className="w-4 h-4 mr-2" />
              Contact
            </TabsTrigger>
          </TabsList>

          {/* Email Template Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Email Template Preview
                </CardTitle>
                <CardDescription>Current autoresponder template for {selectedCategory} subscribers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Subject Line</label>
                  <div className="bg-zinc-800 p-3 rounded border text-sm">{currentTemplate.subject}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Message Content</label>
                  <div className="bg-zinc-800 p-4 rounded border text-sm whitespace-pre-line max-h-96 overflow-y-auto">
                    {currentTemplate.content}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="w-5 h-5" />
                  Test Email
                </CardTitle>
                <CardDescription>Send a test email to verify the automation is working</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Test Email Address</label>
                  <Input
                    type="email"
                    placeholder="test@example.com"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    className="bg-zinc-800 border-zinc-700"
                  />
                </div>
                <Button
                  onClick={handleSendTestEmail}
                  disabled={isLoading || !testEmail}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Test Email
                    </>
                  )}
                </Button>
                {result && (
                  <div
                    className={`p-3 rounded border ${
                      result.success
                        ? "bg-green-900/20 border-green-500 text-green-400"
                        : "bg-red-900/20 border-red-500 text-red-400"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {result.success ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                      <span className="text-sm">{result.message}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
