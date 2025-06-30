"use client";

import React, { useState } from 'react';

export default function App() {
  // Start with NO user (null) so login shows first
  const [user, setUser] = useState(null);

  console.log('Current user state:', user); // Debug log

  // Login Component
  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-gray-200 p-8 shadow-lg">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-light text-2xl">H</span>
            </div>
            <h1 className="text-3xl font-light text-black">Hyam Movement</h1>
            <p className="text-gray-600 font-light">Access your advocacy portal</p>
          </div>

          <form onSubmit={(e) => {
            e.preventDefault();
            const email = e.target.email.value;
            const password = e.target.password.value;
            
            if (email === 'admin@hyam.com' && password === 'admin123') {
              setUser({ email, name: 'Admin User' });
            } else {
              alert('❌ Invalid credentials. Try admin@hyam.com / admin123');
            }
          }} className="space-y-6">
            
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
              placeholder="Password"
              required
              className="w-full px-4 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent font-light"
            />
            
            <button
              type="submit"
              className="w-full bg-black text-white py-4 rounded-2xl font-light hover:bg-gray-800 transition-all duration-200"
            >
              Sign In
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-500">Demo credentials:</p>
            <p className="text-sm text-gray-600 font-mono">admin@hyam.com / admin123</p>
          </div>
        </div>
      </div>
    );
  }

  // Portal Dashboard (only shows after login)
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
            <span className="text-sm text-gray-600">Welcome, {user.email}</span>
            <button
              onClick={() => setUser(null)}
              className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-light transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="p-8 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-light text-black mb-4">✅ Login Successful!</h2>
          <p className="text-gray-600 font-light text-lg">Welcome to your Hyam Movement advocacy portal</p>
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
      </main>
    </div>
  );
}
