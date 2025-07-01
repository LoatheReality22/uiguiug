import { Home, Users, FileText, BarChart3, Settings } from 'lucide-react'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'clients', label: 'Clients', icon: Users },
  { id: 'cases', label: 'Cases', icon: FileText },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
]

const adminNavItems = [
  { id: 'admin', label: 'Admin Panel', icon: Settings, adminOnly: true },
]

export default function Navigation({ currentView, onViewChange, isAdmin }) {
  const allNavItems = [...navItems, ...(isAdmin ? adminNavItems : [])]
  
  return (
    <nav className="bg-white border-b border-gray-200 mb-8">
      <div className="flex space-x-1 overflow-x-auto">
        {allNavItems.map((item) => {
          const Icon = item.icon
          const isActive = currentView === item.id
          const isAdminItem = item.adminOnly
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${
                isActive
                  ? isAdminItem
                    ? 'bg-red-50 text-red-700 border-b-2 border-red-500'
                    : 'bg-blue-50 text-blue-700 border-b-2 border-blue-500'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}