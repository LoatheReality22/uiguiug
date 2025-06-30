"use client";

import React, { useState, useEffect } from 'react';
import Auth from '../components/Auth';

// Your portal component (keeping the same code from before)
const HyamMovementPortal = ({ user, onLogout }) => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [clients, setClients] = useState([]);
  const [cases, setCases] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Supabase configuration
  const SUPABASE_URL = 'https://itdxqdjybaekwqsagynr.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0ZHhxZGp5YmFla3dxc2FneW5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyNDU1NTIsImV4cCI6MjA2NjgyMTU1Mn0.IPInwhJoFPyeoQuPrEdSm0v87aD5O4dZLJ0YL_neur8';

  // API Functions
  const fetchClients = async () => {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/clients?select=*&order=created_at.desc`, {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      return response.ok ? await response.json() : [];
    } catch (error) {
      console.error('Error fetching clients:', error);
      return [];
    }
  };

  const fetchCases = async () => {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/cases?select=*&order=created_at.desc`, {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      return response.ok ? await response.json() : [];
    } catch (error) {
      console.error('Error fetching cases:', error);
      return [];
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/appointments?select=*&order=date_time.asc`, {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      return response.ok ? await response.json() : [];
    } catch (error) {
      console.error('Error fetching appointments:', error);
      return [];
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [clientsData, casesData, appointmentsData] = await Promise.all([
        fetchClients(),
        fetchCases(),
        fetchAppointments()
      ]);
      
      setClients(clientsData);
      setCases(casesData);
      setAppointments(appointmentsData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setLoading(false);
  };

  const filteredClients = clients.filter(client =>
    client.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
      case 'open':
      case 'scheduled':
        return 'bg-black text-white';
      case 'pending':
      case 'in_progress':
        return 'bg-gray-600 text-white';
      default:
        return 'bg-gray-200 text-black';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <div className="text-2xl font-light text-black mb-2">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header with logout */}
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
              <span className="text-white font-light text-sm">H</span>
            </div>
            <h1 className="text-lg font-light text-black">Hyam Movement</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Welcome, {user.email}</span>
            <button
              onClick={onLogout}
              className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-light transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 lg:p-8 max-w-7xl mx-auto">
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-light text-black mb-3">Dashboard</h2>
            <p className="text-gray-600 font-light">Your advocacy portal</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-3xl p-6 border border-gray-200">
              <div className="text-2xl mb-3">👥</div>
              <div className="text-2xl font-light text-black">{clients.length}</div>
              <div className="text-sm text-gray-600 font-light">Total Clients</div>
            </div>
            <div className="bg-white rounded-3xl p-6 border border-gray-200">
              <div className="text-2xl mb-3">📋</div>
              <div className="text-2xl font-light text-black">{cases.length}</div>
              <div className="text-sm text-gray-600 font-light">Active Cases</div>
            </div>
            <div className="bg-white rounded-3xl p-6 border border-gray-200">
              <div className="text-2xl mb-3">📅</div>
              <div className="text-2xl font-light text-black">{appointments.length}</div>
              <div className="text-sm text-gray-600 font-light">Appointments</div>
            </div>
            <div className="bg-white rounded-3xl p-6 border border-
