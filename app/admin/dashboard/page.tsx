"use client"

import { useEffect, useState } from "react"
import { CustomTabs, TabPanel } from "@/components/custom-tabs"
import { StatsCard } from "@/components/stats-card"
import { DataTable } from "@/components/data-table"
import type { DashboardStats, Subscriber, Comment } from "@/types/database"

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, subscribersRes, commentsRes] = await Promise.all([
          fetch("/api/dashboard/stats"),
          fetch("/api/subscribers"),
          fetch("/api/comments?articleSlug=all&articleType=all"),
        ])

        const statsData = await statsRes.json()
        const subscribersData = await subscribersRes.json()
        const commentsData = await commentsRes.json()

        setStats(statsData.data)
        setSubscribers(subscribersData.data || [])
        setComments(commentsData.data || [])
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  const subscriberColumns = [
    { key: "email", header: "Email" },
    { key: "name", header: "Name" },
    { key: "source", header: "Source" },
    {
      key: "subscribed_at",
      header: "Subscribed",
      render: (item: Subscriber) => new Date(item.subscribed_at).toLocaleDateString(),
    },
    {
      key: "is_active",
      header: "Status",
      render: (item: Subscriber) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            item.is_active
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
          }`}
        >
          {item.is_active ? "Active" : "Inactive"}
        </span>
      ),
    },
  ]

  const commentColumns = [
    { key: "email", header: "Email" },
    { key: "name", header: "Name" },
    { key: "article_slug", header: "Article" },
    {
      key: "comment",
      header: "Comment",
      render: (item: Comment) => <div className="max-w-xs truncate">{item.comment}</div>,
    },
    {
      key: "created_at",
      header: "Date",
      render: (item: Comment) => new Date(item.created_at).toLocaleDateString(),
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Admin Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Subscribers"
            value={stats?.totalSubscribers || 0}
            icon={
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            }
          />
          <StatsCard
            title="Total Posts"
            value={stats?.totalPosts || 0}
            icon={
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
            }
          />
          <StatsCard
            title="Total Comments"
            value={stats?.totalComments || 0}
            icon={
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            }
          />
          <StatsCard
            title="Page Views"
            value={stats?.totalPageViews || 0}
            icon={
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            }
          />
        </div>

        {/* Tabs */}
        <CustomTabs
          tabs={[
            {
              id: "subscribers",
              label: "Subscribers",
              content: (
                <TabPanel>
                  <DataTable data={subscribers} columns={subscriberColumns} emptyMessage="No subscribers yet" />
                </TabPanel>
              ),
            },
            {
              id: "comments",
              label: "Comments",
              content: (
                <TabPanel>
                  <DataTable data={comments} columns={commentColumns} emptyMessage="No comments yet" />
                </TabPanel>
              ),
            },
            {
              id: "analytics",
              label: "Analytics",
              content: (
                <TabPanel>
                  <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400">Analytics dashboard coming soon</p>
                  </div>
                </TabPanel>
              ),
            },
          ]}
        />
      </div>
    </div>
  )
}
