"use client"

import { useState, type ReactNode } from "react"

interface Tab {
  id: string
  label: string
  content: ReactNode
}

interface CustomTabsProps {
  tabs: Tab[]
  defaultTab?: string
  className?: string
}

export function CustomTabs({ tabs, defaultTab, className = "" }: CustomTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id)

  const activeTabContent = tabs.find((tab) => tab.id === activeTab)?.content

  return (
    <div className={`w-full ${className}`}>
      {/* Tab Headers */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 font-medium text-sm transition-colors relative ${
              activeTab === tab.id
                ? "text-purple-600 dark:text-purple-400"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 dark:bg-purple-400" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="py-6">{activeTabContent}</div>
    </div>
  )
}

interface TabPanelProps {
  children: ReactNode
  className?: string
}

export function TabPanel({ children, className = "" }: TabPanelProps) {
  return <div className={className}>{children}</div>
}
