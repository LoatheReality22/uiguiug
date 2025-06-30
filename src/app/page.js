"use client";

import React, { useState, useEffect } from 'react';

// Supabase configuration
const SUPABASE_URL = 'https://itdxqdjybaekwqsagynr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0ZHhxZGp5YmFla3dxc2FneW5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyNDU1NTIsImV4cCI6MjA2NjgyMTU1Mn0.IPInwhJoFPyeoQuPrEdSm0v87aD5O4dZLJ0YL_neur8';

// API Functions
async function fetchClients() {
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
}

async function fetchCases() {
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
}

async function fetchAppointments() {
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
}

const HyamMovementPortal = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [clients, setClients] = useState([]);
  const [cases, setCases] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      case 'inactive':
      case 'closed':
      case 'completed':
        return 'bg-gray-300 text-black';
      case 'on_hold':
      case 'cancelled':
        return 'bg-gray-400 text-white';
      default:
        return 'bg-gray-200 text-black';
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <div className="text-2xl font-light text-black mb-2">Hyam Movement</div>
          <div className="text-sm text-gray-600">Loading your portal...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile Header */}
      <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
              <span className="text-white font-light text-sm">H</span>
            </div>
            <h1 className="text-lg font-light text-black">Hyam Movement</h1>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl hover:bg-gray-50 transition-all duration-200"
          >
            <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 transition-transform duration-300`}>
          <div className="flex flex-col h-full">
            {/* Desktop Header */}
            <div className="hidden lg:flex items-center space-x-4 p-8 border-b border-gray-200">
              <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center">
                <span className="text-white font-light text-xl">H</span>
              </div>
              <div>
                <h1 className="text-xl font-light text-black">Hyam Movement</h1>
                <p className="text-sm text-gray-600">Advocacy Portal</p>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 p-6 space-y-2">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: '⌘' },
                { id: 'clients', label: 'Clients', icon: '👥' },
                { id: 'cases', label: 'Cases', icon: '📋' },
                { id: 'reports', label: 'Analytics', icon: '📊' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-2xl transition-all duration-200 hover:bg-gray-50 ${
                    currentView === item.id ? 'bg-black text-white shadow-xl' : 'text-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-light">{item.label}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200">
              <button
                onClick={loadAllData}
                className="w-full px-4 py-3 rounded-2xl border border-gray-300 hover:bg-gray-50 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="text-sm font-light">Sync Data</span>
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1">
          <div className="p-4 lg:p-8 max-w-7xl mx-auto">
            
            {/* Dashboard View */}
            {currentView === 'dashboard' && (
              <div className="space-y-8">
                <div className="text-center lg:text-left">
                  <h2 className="text-3xl lg:text-4xl font-light text-black mb-3">Welcome back</h2>
                  <p className="text-gray-600 text-lg font-light">Manage your advocacy work with elegance</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                  {[
                    { label: 'Total Clients', value: clients.length, icon: '👥' },
                    { label: 'Active Cases', value: cases.filter(c => c.status === 'open' || c.status === 'in_progress').length, icon: '📋' },
                    { label: 'Scheduled', value: appointments.filter(a => a.status === 'scheduled').length, icon: '📅' },
                    { label: 'This Month', value: cases.length, icon: '📈' }
                  ].map((stat, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-3xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="text-2xl mb-3">{stat.icon}</div>
                      <div className="text-2xl lg:text-3xl font-light text-black mb-1">{stat.value}</div>
                      <div className="text-sm text-gray-600 font-light">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-3xl p-6 lg:p-8 border border-gray-200">
                  <h3 className="text-xl font-light text-black mb-6">Quick Actions</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {[
                      { label: 'View Clients', action: () => setCurrentView('clients'), icon: '👥' },
                      { label: 'Review Cases', action: () => setCurrentView('cases'), icon: '📋' },
                      { label: 'See Analytics', action: () => setCurrentView('reports'), icon: '📊' }
                    ].map((action, index) => (
                      <button
                        key={index}
                        onClick={action.action}
                        className="p-6 rounded-2xl border-2 border-dashed border-gray-300 hover:border-black hover:bg-gray-50 transition-all duration-300 group"
                      >
                        <div className="text-center">
                          <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-200">
                            {action.icon}
                          </div>
                          <p className="font-light text-black">{action.label}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Clients View */}
            {currentView === 'clients' && (
              <div className="space-y-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                  <h2 className="text-2xl lg:text-3xl font-light text-black">Clients</h2>
                  <div className="text-sm text-gray-600 font-light">{clients.length} total clients</div>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search clients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 font-light"
                  />
                  <svg className="absolute left-4 top-4 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>

                {/* Clients Grid */}
                {filteredClients.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredClients.map((client) => (
                      <div
                        key={client.id}
                        className="bg-white rounded-3xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                        onClick={() => setSelectedClient(client)}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center">
                            <span className="text-white font-light">
                              {client.first_name.charAt(0)}{client.last_name.charAt(0)}
                            </span>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-light ${getStatusColor(client.status)}`}>
                            {client.status}
                          </span>
                        </div>
                        
                        <h3 className="text-lg font-light text-black mb-2">
                          {client.first_name} {client.last_name}
                        </h3>
                        <p className="text-sm text-gray-600 font-light mb-1">{client.email}</p>
                        <p className="text-sm text-gray-500 font-light">{client.case_type || 'No case type'}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">👥</div>
                    <h3 className="text-xl font-light text-black mb-2">No Clients Found</h3>
                    <p className="text-gray-600 font-light">
                      {searchTerm ? 'No clients match your search.' : 'No clients in the database yet.'}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Cases View */}
            {currentView === 'cases' && (
              <div className="space-y-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                  <h2 className="text-2xl lg:text-3xl font-light text-black">Cases</h2>
                  <div className="text-sm text-gray-600 font-light">{cases.length} total cases</div>
                </div>

                {cases.length > 0 ? (
                  <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-4 text-left text-sm font-light text-gray-900">Case</th>
                            <th className="px-6 py-4 text-left text-sm font-light text-gray-900">Client</th>
                            <th className="px-6 py-4 text-left text-sm font-light text-gray-900">Status</th>
                            <th className="px-6 py-4 text-left text-sm font-light text-gray-900">Priority</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {cases.map((caseItem) => {
                            const client = clients.find(c => c.id === caseItem.client_id);
                            return (
                              <tr key={caseItem.id} className="hover:bg-gray-50 transition-colors duration-200">
                                <td className="px-6 py-4">
                                  <div>
                                    <div className="font-light text-black">{caseItem.title}</div>
                                    <div className="text-sm text-gray-600 font-light">{caseItem.description.substring(0, 50)}...</div>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="font-light text-black">
                                    {client ? `${client.first_name} ${client.last_name}` : 'Unknown'}
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <span className={`px-3 py-1 rounded-full text-xs font-light ${getStatusColor(caseItem.status)}`}>
                                    {caseItem.status.replace('_', ' ')}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <span className="text-sm font-light text-gray-700">
                                    {caseItem.priority}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📋</div>
                    <h3 className="text-xl font-light text-black mb-2">No Cases Found</h3>
                    <p className="text-gray-600 font-light">No cases in the database yet.</p>
                  </div>
                )}
              </div>
            )}

            {/* Reports View */}
            {currentView === 'reports' && (
              <div className="space-y-6">
                <h2 className="text-2xl lg:text-3xl font-light text-black">Analytics</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-3xl p-6 border border-gray-200">
                    <h3 className="text-lg font-light text-black mb-6">Case Status</h3>
                    <div className="space-y-4">
                      {[
                        { label: 'Open Cases', value: cases.filter(c => c.status === 'open').length },
                        { label: 'In Progress', value: cases.filter(c => c.status === 'in_progress').length },
                        { label: 'Closed Cases', value: cases.filter(c => c.status === 'closed').length }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between py-2">
                          <span className="text-sm font-light text-gray-700">{item.label}</span>
                          <span className="text-lg font-light text-black">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-3xl p-6 border border-gray-200">
                    <h3 className="text-lg font-light text-black mb-6">Client Status</h3>
                    <div className="space-y-4">
                      {[
                        { label: 'Active Clients', value: clients.filter(c => c.status === 'active').length },
                        { label: 'Pending Clients', value: clients.filter(c => c.status === 'pending').length },
                        { label: 'Total Clients', value: clients.length }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between py-2">
                          <span className="text-sm font-light text-gray-700">{item.label}</span>
                          <span className="text-lg font-light text-black">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default HyamMovementPortal;
