"use client";

import React, { useState, useEffect } from 'react';
import { supabase, signUp, signIn, signOut } from '../lib/supabase';

export default function App() {
  const [user, setUser] = useState(null);
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isInitialLoading, setIsInitialLoading] = useState(true);

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
        setMessage('✅ Account created! Please check your email to confirm your account.');
        setIsSignup(false); // Switch to login
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
          setMessage('');
        } else {
          setMessage(` Login failed: ${error.message}\n\n`);
        }
      } else {
        setMessage('Login successful!');
        // User will be set automatically via the auth state change listener
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
              message.includes('') 
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
  <h3 className="text-2xl font-light text-black mb-4">Welcome to Your Dashboard</h3>
  <p className="text-gray-600 font-light">
    Your secure portal for managing advocacy services and client relationships.
  </p>
</div>
            
          </div>
        </div>
      </main>
    </div>
  );
}
