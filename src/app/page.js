"use client";

import React, { useState, useEffect } from 'react';
import Auth from '../components/Auth';

// Your existing HyamMovementPortal component code stays the same...
// Just add this wrapper at the bottom:

const AuthWrapper = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const session = localStorage.getItem('supabase_session');
    if (session) {
      try {
        const parsed = JSON.parse(session);
        setUser(parsed.user);
      } catch (e) {
        localStorage.removeItem('supabase_session');
      }
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('supabase_session');
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Auth onLogin={setUser} />;
  }

  return (
    <div>
      {/* Add logout button to your existing portal */}
      {React.cloneElement(children, { user, onLogout: handleLogout })}
    </div>
  );
};

// Replace your export with this:
export default function App() {
  return (
    <AuthWrapper>
      <HyamMovementPortal />
    </AuthWrapper>
  );
}
