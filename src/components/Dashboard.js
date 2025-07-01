'use client'

import { useState, useEffect } from 'react'
import { Users, FileText, TrendingUp, AlertCircle } from 'lucide-react'
import { getAnalytics, getCases } from '../lib/supabase'

export default function Dashboard({ user }) {
  const [analytics, setAnalytics] = useState({
    totalClients: 0,
    activeCases: 0,
    completedCases: 0,
    highPriorityCases: 0,
    successRate: 0
  })
  const [recentCases, setRecentCases] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Load analytics
        const analyticsData = await getAnalytics()
        setAnalytics(analyticsData)

        // Load recent cases
        const { data: casesData } = await getCases(user.isAdmin ? null : user.id)
        if (casesData) {
          setRecentCases(casesData.slice(0, 3))
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [user])

  const stats = [
    {
      label: 'Total Clients',
      value: analytics.totalClients,
      icon: Users,
      color: 'blue'
    },
    {
      label: 'Active Cases',
      value: analytics.activeCases,
      icon: FileText,
      color: 'green'
    },
    {
      label: 'Success Rate',
      value: `${analytics.successRate}%`,
      icon: TrendingUp,
      color: 'purple'
    },
    {
      label: 'High Priority',
      value: analytics.highPriorityCases,
      icon: AlertCircle,
      color: 'red'
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user.name.split(' ')[0]}
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your {user.isAdmin ? 'organization' : 'cases'} today.
        </p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${
                  stat.color === 'blue' ? 'bg-blue-50' :
                  stat.color === 'green' ? 'bg-green-50' :
                  stat.color === 'purple' ? 'bg-purple-50' :
                  'bg-red-50'
                }`}>
                  <Icon className={`w-6 h-6 ${
                    stat.color === 'blue' ? 'text-blue-600' :
                    stat.color === 'green' ? 'text-green-600' :
                    stat.color === 'purple' ? 'text-purple-600' :
                    'text-red-600'
                  }`} />
                </div>
              </div>
            </div>
          )
        })}
      </div>
      
      {/* Recent Cases */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Recent Cases</h2>
        </div>
        <div className="p-6">
          {recentCases.length > 0 ? (
            <div className="space-y-4">
              {recentCases.map((case_) => (
                <div key={case_.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">{case_.title}</h3>
                    <p className="text-sm text-gray-600">
                      {case_.profiles ? `Client: ${case_.profiles.full_name}` : 'Client information unavailable'}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      case_.status === 'completed' ? 'bg-green-100 text-green-800' :
                      case_.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                      case_.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      case_.status === 'review' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {case_.status}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      case_.priority === 'high' ? 'bg-red-100 text-red-800' :
                      case_.priority === 'medium' ? 'bg-orange-100 text-orange-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {case_.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No cases found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}