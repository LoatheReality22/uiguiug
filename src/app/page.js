"use client";

import React, { useState, useEffect } from 'react';
import { supabase, signUp, signIn, signOut } from '../../lib/supabase';

export default function App() {
  const [user, setUser] = useState(null);
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard'); // dashboard, clients, cases, analytics, admin

  // Admin emails - add your email here
  const adminEmails = ['admin@hyam.com', 'youremail@domain.com'];
  const isAdmin = user && adminEmails.includes(user.email);

  // Mock data for admin
  const [users, setUsers] = useState([
    { id: 1, email: 'john@example.com', name: 'John Doe', role: 'client', created: '2024-01-15' },
    { id: 2, email: 'jane@example.com', name: 'Jane Smith', role: 'client', created: '2024-01-20' },
    { id: 3, email: 'admin@hyam.com', name: 'Admin User', role: 'admin', created: '2024-01-01' }
  ]);

  const [cases, setCases] = useState([
    { id: 1, title: 'Immigration Case #001', client: 'John Doe', status: 'active', priority: 'high' },
    { id: 2, title: 'Family Law Case #002', client: 'Jane Smith', status: 'pending', priority: 'medium' },
    { id: 3, title: 'Business Law Case #003', client: 'Mike Johnson', status: 'completed', priority: 'low' }
  ]);

  // Check if user is already logged in on page load
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
      }
      setIsInitialLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          setUser(session.user);
        } else {
          setUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const fullName = formData.get('fullName');

    if (isSignup) {
      // Sign up
      const { data, error } = await signUp(email, password, fullName);
      
      if (error) {
        setMessage(`❌ Signup failed: ${error.message}`);
      } else {
        setMessage('✅ Account created successfully! You can now sign in.');
        setIsSignup(false);
      }
    } else {
      // Sign in
      const { data, error } = await signIn(email, password);
      
      if (error) {
        // Fallback to demo login if Supabase fails
        if (email === 'admin@hyam.com' && password === 'admin123') {
          setUser({ 
            email, 
            user_metadata: { full_name: 'Demo Admin' },
            id: 'demo-user' 
          });
          setMessage('✅ Demo login successful!');
        } else {
          setMessage(`❌ Login failed: ${error.message}\n\nTry demo: admin@hyam.com / admin123`);
        }
      } else {
        setMessage('✅ Login successful!');
      }
    }
    
    setLoading(false);
  };

  const handleLogout = async () => {
    const { error } = await signOut();
    if (error) {
      console.error('Error logging out:', error);
    }
    setUser(null);
    setCurrentView('dashboard');
  };

  const deleteUser = (userId) => {
    setUsers(users.filter(u => u.id !== userId));
    setMessage('✅ User deleted successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  const updateCaseStatus = (caseId, newStatus) => {
    setCases(cases.map(c => c.id === caseId ? {...c, status: newStatus} : c));
    setMessage('✅ Case updated successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  // Show loading spinner while checking auth state
  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white font-light text-2xl">H</span>
          </div>
          <p className="text-gray-600 font-light">Loading...</p>
        </div>
      </div>
    );
  }

  // Auth Component (Login + Signup)
  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-gray-200 p-8 shadow-lg">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-light text-2xl">H</span>
            </div>
            <h1 className="text-3xl font-light text-black">Hyam Movement</h1>
            <p className="text-gray-600 font-light">
              {isSignup ? 'Create your account' : 'Access your advocacy portal'}
            </p>
          </div>

          {message && (
            <div className={`px-4 py-3 rounded-2xl text-sm mb-6 ${
              message.includes('❌') 
                ? 'bg-red-50 text-red-800 border border-red-200' 
                : 'bg-green-50 text-green-800 border border-green-200'
            }`}>
              {message}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-6">
            {isSignup && (
              <input
                name="fullName"
                type="text"
                placeholder="Full Name"
                required
                className="w-full px-4 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent font-light"
              />
            )}
            
            <input
              name="email"
              type="email"
              placeholder="Email address"
              required
              className="w-full px-4 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent font-light"
            />
            
            <input
              name="password"
              type="password"
              placeholder="Password (min 6 characters)"
              required
              minLength="6"
              className="w-full px-4 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent font-light"
            />
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-4 rounded-2xl font-light hover:bg-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading 
                ? (isSignup ? 'Creating Account...' : 'Signing In...') 
                : (isSignup ? 'Create Account' : 'Sign In')
              }
            </button>
          </form>

          <div className="text-center mt-6">
            <button
              onClick={() => {
                setIsSignup(!isSignup);
                setMessage('');
              }}
              className="text-gray-600 font-light hover:text-black transition-colors"
            >
              {isSignup 
                ? "Already have an account? Sign in" 
                : "Don't have an account? Create one"
              }
            </button>
          </div>

          {!isSignup && (
            <div className="text-center mt-4">
              <p className="text-sm text-gray-500">Demo login:</p>
              <p className="text-sm text-gray-600 font-mono">admin@hyam.com / admin123</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Portal Dashboard
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
              <span className="text-white font-light">H</span>
            </div>
            <h1 className="text-xl font-light text-black">Hyam Movement Portal</h1>
          </div>
          <div className="flex items-center space-x-4">
            {isAdmin && (
              <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                👑 Admin
              </span>
            )}
            <span className="text-sm text-gray-600">
              Welcome, {user.user_metadata?.full_name || user.email}
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-light transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-gray-50 border-b border-gray-200 px-6 py-3">
        <div className="flex space-x-6">
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`px-4 py-2 rounded-lg font-light transition-colors ${
              currentView === 'dashboard' ? 'bg-black text-white' : 'text-gray-600 hover:text-black'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setCurrentView('clients')}
            className={`px-4 py-2 rounded-lg font-light transition-colors ${
              currentView === 'clients' ? 'bg-black text-white' : 'text-gray-600 hover:text-black'
            }`}
          >
            Clients
          </button>
          <button
            onClick={() => setCurrentView('cases')}
            className={`px-4 py-2 rounded-lg font-light transition-colors ${
              currentView === 'cases' ? 'bg-black text-white' : 'text-gray-600 hover:text-black'
            }`}
          >
            Cases
          </button>
          <button
            onClick={() => setCurrentView('analytics')}
            className={`px-4 py-2 rounded-lg font-light transition-colors ${
              currentView === 'analytics' ? 'bg-black text-white' : 'text-gray-600 hover:text-black'
            }`}
          >
            Analytics
          </button>
          {isAdmin && (
            <button
              onClick={() => setCurrentView('admin')}
              className={`px-4 py-2 rounded-lg font-light transition-colors ${
                currentView === 'admin' ? 'bg-red-600 text-white' : 'text-red-600 hover:bg-red-50'
              }`}
            >
              🔒 Admin
            </button>
          )}
        </div>
      </nav>

      <main className="p-8 max-w-6xl mx-auto">
        {/* Message Display */}
        {message && (
          <div className={`mb-6 px-4 py-3 rounded-2xl text-sm ${
            message.includes('❌') 
              ? 'bg-red-50 text-red-800 border border-red-200' 
              : 'bg-green-50 text-green-800 border border-green-200'
          }`}>
            {message}
          </div>
        )}

        {/* Dashboard View */}
        {currentView === 'dashboard' && (
          <>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-light text-black mb-4">Welcome to Your Portal</h2>
              <p className="text-gray-600 font-light text-lg">Manage your advocacy work with elegance</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-3xl p-8 border border-gray-200 hover:shadow-lg transition-all duration-300">
                <div className="text-4xl mb-6">👥</div>
                <h3 className="text-2xl font-light text-black mb-3">Clients</h3>
                <p className="text-gray-600 font-light">Manage client relationships</p>
              </div>
              
              <div className="bg-white rounded-3xl p-8 border border-gray-200 hover:shadow-lg transition-all duration-300">
                <div className="text-4xl mb-6">📋</div>
                <h3 className="text-2xl font-light text-black mb-3">Cases</h3>
                <p className="text-gray-600 font-light">Track advocacy cases</p>
              </div>
              
              <div className="bg-white rounded-3xl p-8 border border-gray-200 hover:shadow-lg transition-all duration-300">
                <div className="text-4xl mb-6">📊</div>
                <h3 className="text-2xl font-light text-black mb-3">Analytics</h3>
                <p className="text-gray-600 font-light">View your impact</p>
              </div>
            </div>
          </>
        )}

        {/* Clients View */}
        {currentView === 'clients' && (
          <div>
            <h2 className="text-3xl font-light text-black mb-8">Client Management</h2>
            <div className="bg-white rounded-3xl p-8 border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.filter(u => u.role === 'client').map(client => (
                  <div key={client.id} className="bg-gray-50 rounded-2xl p-6">
                    <h3 className="font-medium text-black mb-2">{client.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{client.email}</p>
                    <p className="text-xs text-gray-500">Joined: {client.created}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Cases View */}
        {currentView === 'cases' && (
          <div>
            <h2 className="text-3xl font-light text-black mb-8">Case Management</h2>
            <div className="bg-white rounded-3xl p-8 border border-gray-200">
              <div className="space-y-4">
                {cases.map(caseItem => (
                  <div key={caseItem.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <div>
                      <h3 className="font-medium text-black">{caseItem.title}</h3>
                      <p className="text-sm text-gray-600">Client: {caseItem.client}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        caseItem.status === 'active' ? 'bg-green-100 text-green-800' :
                        caseItem.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {caseItem.status}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        caseItem.priority === 'high' ? 'bg-red-100 text-red-800' :
                        caseItem.priority === 'medium' ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {caseItem.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Analytics View */}
        {currentView === 'analytics' && (
          <div>
            <h2 className="text-3xl font-light text-black mb-8">Analytics Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-3xl p-6 border border-gray-200">
                <h3 className="text-lg font-medium text-black mb-2">Total Clients</h3>
                <p className="text-3xl font-light text-black">{users.filter(u => u.role === 'client').length}</p>
              </div>
              <div className="bg-white rounded-3xl p-6 border border-gray-200">
                <h3 className="text-lg font-medium text-black mb-2">Active Cases</h3>
                <p className="text-3xl font-light text-black">{cases.filter(c => c.status === 'active').length}</p>
              </div>
              <div className="bg-white rounded-3xl p-6 border border-gray-200">
                <h3 className="text-lg font-medium text-black mb-2">Completed Cases</h3>
                <p className="text-3xl font-light text-black">{cases.filter(c => c.status === 'completed').length}</p>
              </div>
              <div className="bg-white rounded-3xl p-6 border border-gray-200">
                <h3 className="text-lg font-medium text-black mb-2">Success Rate</h3>
                <p className="text-3xl font-light text-black">94%</p>
              </div>
            </div>
          </div>
        )}

        {/* Admin View */}
        {currentView === 'admin' && isAdmin && (
          <div>
            <h2 className="text-3xl font-light text-black mb-8">🔒 Admin Panel</h2>
            
            {/* User Management */}
            <div className="bg-white rounded-3xl p-8 border border-gray-200 mb-8">
              <h3 className="text-xl font-medium text-black mb-6">User Management</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 font-medium text-gray-700">Name</th>
                      <th className="text-left py-3 font-medium text-gray-700">Email</th>
                      <th className="text-left py-3 font-medium text-gray-700">Role</th>
                      <th className="text-left py-3 font-medium text-gray-700">Created</th>
                      <th className="text-left py-3 font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id} className="border-b border-gray-100">
                        <td className="py-3 text-gray-900">{user.name}</td>
                        <td className="py-3 text-gray-600">{user.email}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="py-3 text-gray-600">{user.created}</td>
                        <td className="py-3">
                          {user.role !== 'admin' && (
                            <button
                              onClick={() => deleteUser(user.id)}
                              className="text-red-600 hover:text-red-800 text-sm font-medium"
                            >
                              Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* System Settings */}
            <div className="bg-white rounded-3xl p-8 border border-gray-200">
              <h3 className="text-xl font-medium text-black mb-6">System Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-gray-50 rounded-2xl">
                  <h4 className="font-medium text-black mb-2">Email Notifications</h4>
                  <p className="text-sm text-gray-600 mb-3">Manage system email settings</p>
                  <button className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800">
                    Configure
                  </button>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl">
                  <h4 className="font-medium text-black mb-2">Security Settings</h4>
                  <p className="text-sm text-gray-600 mb-3">Manage access controls</p>
                  <button className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800">
                    Configure
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
