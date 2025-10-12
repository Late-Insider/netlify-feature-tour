import type React from "react"
interface StatsCardProps {
  title: string
  value: string | number
  icon?: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
}

export function StatsCard({ title, value, icon, trend, className = "" }: StatsCardProps) {
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-transform hover:scale-105 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
          {trend && (
            <div className="mt-2 flex items-center text-sm">
              <span className={`font-medium ${trend.isPositive ? "text-green-600" : "text-red-600"}`}>
                {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
              </span>
              <span className="ml-2 text-gray-500">vs last period</span>
            </div>
          )}
        </div>
        {icon && <div className="flex-shrink-0 p-3 bg-purple-100 dark:bg-purple-900 rounded-full">{icon}</div>}
      </div>
    </div>
  )
}
