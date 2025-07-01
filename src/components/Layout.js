import { LogOut, User, Shield } from 'lucide-react'

export default function Layout({ user, onLogout, children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
              <span className="text-white font-semibold text-lg">H</span>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Hyam Movement</h1>
              <p className="text-sm text-gray-500">Client Portal</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {user.isAdmin && (
              <div className="flex items-center space-x-2 bg-red-50 text-red-700 px-3 py-1 rounded-full">
                <Shield className="w-4 h-4" />
                <span className="text-sm font-medium">Admin</span>
              </div>
            )}
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">{user.name}</span>
              </div>
              
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  )
}