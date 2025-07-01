import { TrendingUp, Users, FileText, Clock, CheckCircle } from 'lucide-react'
import { getAnalytics, mockCases, mockClients } from '../lib/data'

export default function AnalyticsView() {
  const analytics = getAnalytics()
  
  const casesByType = mockCases.reduce((acc, case_) => {
    acc[case_.type] = (acc[case_.type] || 0) + 1
    return acc
  }, {})
  
  const casesByStatus = mockCases.reduce((acc, case_) => {
    acc[case_.status] = (acc[case_.status] || 0) + 1
    return acc
  }, {})
  
  const monthlyStats = [
    { month: 'Jan', cases: 8, clients: 3 },
    { month: 'Feb', cases: 12, clients: 4 },
    { month: 'Mar', cases: 6, clients: 2 },
  ]
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
        <p className="text-gray-600">Track your organization's impact and performance</p>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Clients</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{analytics.totalClients}</p>
              <p className="text-sm text-green-600 mt-1">+2 this month</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-50">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Cases</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{analytics.activeCases}</p>
              <p className="text-sm text-blue-600 mt-1">In progress</p>
            </div>
            <div className="p-3 rounded-lg bg-green-50">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{analytics.successRate}%</p>
              <p className="text-sm text-green-600 mt-1">Above average</p>
            </div>
            <div className="p-3 rounded-lg bg-purple-50">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed Cases</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{analytics.completedCases}</p>
              <p className="text-sm text-gray-600 mt-1">All time</p>
            </div>
            <div className="p-3 rounded-lg bg-green-50">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Cases by Type */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cases by Type</h3>
          <div className="space-y-3">
            {Object.entries(casesByType).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{type}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(count / mockCases.length) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Cases by Status */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cases by Status</h3>
          <div className="space-y-3">
            {Object.entries(casesByStatus).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 capitalize">{status.replace('-', ' ')}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        status === 'completed' ? 'bg-green-600' :
                        status === 'in-progress' ? 'bg-blue-600' :
                        status === 'pending' ? 'bg-yellow-600' :
                        'bg-purple-600'
                      }`}
                      style={{ width: `${(count / mockCases.length) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Monthly Trends */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trends</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Month</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">New Cases</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">New Clients</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Growth</th>
              </tr>
            </thead>
            <tbody>
              {monthlyStats.map((stat, index) => (
                <tr key={stat.month} className="border-b border-gray-100">
                  <td className="py-3 px-4 text-gray-900">{stat.month} 2024</td>
                  <td className="py-3 px-4 text-gray-900">{stat.cases}</td>
                  <td className="py-3 px-4 text-gray-900">{stat.clients}</td>
                  <td className="py-3 px-4">
                    <span className={`text-sm ${index > 0 && stat.cases > monthlyStats[index-1].cases ? 'text-green-600' : 'text-gray-600'}`}>
                      {index > 0 ? (stat.cases > monthlyStats[index-1].cases ? '+' : '') : ''}
                      {index > 0 ? stat.cases - monthlyStats[index-1].cases : 'N/A'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}