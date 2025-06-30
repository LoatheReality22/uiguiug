"use client";

import { useState } from 'react';

const SUPABASE_URL = 'https://itdxqdjybaekwqsagynr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0ZHhxZGp5YmFla3dxc2FneW5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyNDU1NTIsImV4cCI6MjA2NjgyMTU1Mn0.IPInwhJoFPyeoQuPrEdSm0v87aD5O4dZLJ0YL_neur8';

export default function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Simple demo login - replace with real auth later
    if (email === 'admin@hyam.com' && password === 'admin123') {
      onLogin({ email, id: '1', role: 'admin' });
      setMessage(' Login successful!');
    } else {
      setMessage(' Invalid credentials. Try admin@hyam.com / admin123');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-light text-2xl">H</span>
          </div>
          <h2 className="text-3xl font-light text-black">Hyam Movement</h2>
          <p className="text-gray-600 font-light">Access your advocacy portal</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          {message && (
            <div className="px-4 py-3 rounded-2xl text-sm bg-gray-100 text-gray-800 border border-gray-300">
              {message}
            </div>
          )}
          
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            required
            className="w-full px-4 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent font-light"
          />
          
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full px-4 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent font-light"
          />
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-4 rounded-2xl font-light hover:bg-gray-800 transition-all duration-200 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-500">Hyam Movement</p>
          <p className="text-sm text-gray-600">2025</p>
        </div>
      </div>
    </div>
  );
}
