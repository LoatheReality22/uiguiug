"use client";

import { useState, useEffect } from 'react'
import AuthForm from '../components/AuthForm'
import Layout from '../components/Layout'
import Navigation from '../components/Navigation'
import Dashboard from '../components/Dashboard'
import ClientsView from '../components/ClientsView'
import CasesView from '../components/CasesView'
import AnalyticsView from '../components/AnalyticsView'
import AdminPanel from '../components/AdminPanel'

export default function App() {
  const [user, setUser] = useState(null)
  const [currentView, setCurrentView] = useState('dashboard')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('hyam_user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        localStorage.removeItem('hyam_user')
      }
    }
    setLoading(false)
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
    localStorage.setItem('hyam_user', JSON.stringify(userData))
    setCurrentView('dashboard')
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('hyam_user')
    setCurrentView('dashboard')
  }

  const handleViewChange = (view) => {
    setCurrentView(view)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">H</span>
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <AuthForm onLogin={handleLogin} />
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard user={user} />
      case 'clients':
        return <ClientsView isAdmin={user.isAdmin} />
      case 'cases':
        return <CasesView isAdmin={user.isAdmin} />
      case 'analytics':
        return <AnalyticsView />
      case 'admin':
        return user.isAdmin ? <AdminPanel /> : <Dashboard user={user} />
      default:
        return <Dashboard user={user} />
    }
  }

  return (
    <Layout user={user} onLogout={handleLogout}>
      <Navigation 
        currentView={currentView} 
        onViewChange={handleViewChange}
        isAdmin={user.isAdmin}
      />
      {renderCurrentView()}
    </Layout>
  )
}