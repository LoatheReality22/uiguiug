"use client";

import React, { useState } from 'react';

// Supabase configuration
const SUPABASE_URL = 'https://itdxqdjybaekwqsagynr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0ZHhxZGp5YmFla3dxc2FneW5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyNDU1NTIsImV4cCI6MjA2NjgyMTU1Mn0.IPInwhJoFPyeoQuPrEdSm0v87aD5O4dZLJ0YL_neur8';

export default function App() {
  const [user, setUser] = useState(null);
  const [isSignup, setIsSignup] = useState(false); // Toggle between login/signup

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

          <form onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const email = formData.get('email');
            const password = formData.get('password');
            const fullName = formData.get('fullName');

            if (isSignup) {
              // Signup with Supabase
              try {
                const response = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
                  method: 'POST',
                  headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    email,
                    password,
                    data: { full_name: fullName }
                  })
                });

                const data = await response.json();

                if (response.ok) {
                  alert('✅ Account created! Please check your email to confirm your account, then login.');
                  setIsSignup(false); // Switch to login
                } else {
                  alert(`❌ Signup failed: ${data.error_description || data.msg}`);
                }
              } catch (error) {
                alert('❌ Network error. Please try again.');
              }
            } else {
              // Login with Supabase
              try {
                const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
                  method: 'POST',
                  headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok) {
                  setUser(data.user);
                  alert('✅ Login successful!');
                } else {
                  // Fallback to demo login
                  if (email === 'admin@hyam.com' && password === 'admin123') {
                    setUser({ email, name: 'Demo Admin' });
                  } else {
                    alert(`❌ Login failed: ${data.error_description || 'Invalid credentials'}\n\nTry demo: admin@hyam.com / admin123`);
                  }
                }
              } catch (error) {
                // Fallback to demo login
                if (email === 'admin@hyam.com' && password === 'admin123') {
                  setUser({ email, name: 'Demo Admin' });
                } else {
                  alert('❌ Network error. Try demo: admin@hyam.com / admin123');
                }
              }
            }
          }} className="space-y-6">
            
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
              className="w-full bg-black text-white py-4 rounded-2xl font-light hover:bg-gray-800 transition-all duration-200"
            >
              {isSignup ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <div className="text-center mt-6">
            <button
              onClick={() => setIsSignup(!isSignup)}
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

        <div className="mt-12 bg-white rounded-3xl p-8 border border-gray-200">
          <h3 className="text-2xl font-light text-black mb-4">🎉 Authentication System Active</h3>
          <p className="text-gray-600 font-light">
            Users can now create accounts and login to access the advocacy portal.
          </p>
        </div>
      </main>
    </div>
  );
}
