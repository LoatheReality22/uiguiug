import { useState } from 'react'
import { Users, Settings, Shield, Mail, Database, Activity } from 'lucide-react'
import { mockClients, mockCases } from '../lib/data'

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('overview')
  
  const adminTabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'settings', label: 'System Settings', icon: Settings },
    { id: 'security', label: 'Security', icon: Shield },
  ]
  
  const systemStats = {
    totalUsers: mockClients.length + 2, // clients + admins
    totalCases: mockCases.length,
    activeUsers: mockClients.filter(c => c.status === 'active').length,
    systemHealth: 'Excellent'
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Shield className="w-8 h-8 text-red-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-600">Manage system settings and user access</p>
        </div>
      </div>
      
      {/* Admin Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-1 p-1">
            {adminTabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-red-50 text-red-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </div>
        
        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600">Total Users</p>
                      <p className="text-2xl font-bold text-blue-900">{systemStats.totalUsers}</p>
                    </div>
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600">Total Cases</p>
                      <p className="text-2xl font-bold text-green-900">{systemStats.totalCases}</p>
                    </div>
                    <Database className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-600">Active Users</p>
                      <p className="text-2xl font-bold text-purple-900">{systemStats.activeUsers}</p>
                    </div>
                    <Activity className="w-8 h-8 text-purple-600" />
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-orange-600">System Health</p>
                      <p className="text-2xl font-bold text-orange-900">{systemStats.systemHealth}</p>
                    </div>
                    <Shield className="w-8 h-8 text-orange-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent System Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600">New client registration: Sarah Johnson</span>
                    <span className="text-gray-400">2 hours ago</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-600">Case status updated: Immigration Review</span>
                    <span className="text-gray-400">4 hours ago</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-gray-600">System backup completed successfully</span>
                    <span className="text-gray-400">6 hours ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* User Management Tab */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
                <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                  Add New User
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Name</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Email</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Role</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 text-gray-900">Harley (You)</td>
                      <td className="py-3 px-4 text-gray-600">harley@hyammovement.com</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Admin
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                      </td>
                    </tr>
                    {mockClients.map((client) => (
                      <tr key={client.id} className="border-b border-gray-100">
                        <td className="py-3 px-4 text-gray-900">{client.name}</td>
                        <td className="py-3 px-4 text-gray-600">{client.email}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Client
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            client.status === 'active' ? 'bg-green-100 text-green-800' :
                            client.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {client.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 space-x-2">
                          <button className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                          <button className="text-red-600 hover:text-red-800 text-sm">Suspend</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {/* System Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">System Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Mail className="w-6 h-6 text-blue-600" />
                    <h4 className="text-lg font-medium text-gray-900">Email Configuration</h4>
                  </div>
                  <p className="text-gray-600 mb-4">Configure email notifications and SMTP settings</p>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Configure Email
                  </button>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Database className="w-6 h-6 text-green-600" />
                    <h4 className="text-lg font-medium text-gray-900">Database Management</h4>
                  </div>
                  <p className="text-gray-600 mb-4">Backup and restore database settings</p>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                    Manage Database
                  </button>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Settings className="w-6 h-6 text-purple-600" />
                    <h4 className="text-lg font-medium text-gray-900">General Settings</h4>
                  </div>
                  <p className="text-gray-600 mb-4">Configure general application settings</p>
                  <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                    Edit Settings
                  </button>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Activity className="w-6 h-6 text-orange-600" />
                    <h4 className="text-lg font-medium text-gray-900">System Monitoring</h4>
                  </div>
                  <p className="text-gray-600 mb-4">Monitor system performance and logs</p>
                  <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
                    View Logs
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Security Settings</h3>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Shield className="w-6 h-6 text-red-600" />
                  <h4 className="text-lg font-medium text-red-900">Security Status</h4>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-red-700">Two-Factor Authentication</span>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Enabled
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-red-700">SSL Certificate</span>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Valid
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-red-700">Password Policy</span>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Strong
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-red-700">Session Timeout</span>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      30 minutes
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Access Control</h4>
                  <p className="text-gray-600 mb-4">Manage user permissions and access levels</p>
                  <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                    Configure Access
                  </button>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Audit Logs</h4>
                  <p className="text-gray-600 mb-4">View system access and security logs</p>
                  <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                    View Audit Logs
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}