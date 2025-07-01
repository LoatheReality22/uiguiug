// Mock data for the portal
export const mockClients = [
  {
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
    status: 'active',
    joinDate: '2024-01-15',
    caseCount: 2,
    priority: 'high'
  },
  {
    id: 2,
    name: 'Michael Chen',
    email: 'michael.chen@email.com',
    phone: '+1 (555) 234-5678',
    status: 'active',
    joinDate: '2024-02-03',
    caseCount: 1,
    priority: 'medium'
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@email.com',
    phone: '+1 (555) 345-6789',
    status: 'pending',
    joinDate: '2024-02-20',
    caseCount: 1,
    priority: 'low'
  },
  {
    id: 4,
    name: 'David Thompson',
    email: 'david.thompson@email.com',
    phone: '+1 (555) 456-7890',
    status: 'completed',
    joinDate: '2023-11-10',
    caseCount: 3,
    priority: 'medium'
  }
]

export const mockCases = [
  {
    id: 1,
    title: 'Immigration Status Review',
    clientId: 1,
    clientName: 'Sarah Johnson',
    status: 'in-progress',
    priority: 'high',
    type: 'Immigration',
    createdDate: '2024-01-20',
    dueDate: '2024-03-15',
    description: 'Comprehensive review of immigration status and pathway to permanent residency'
  },
  {
    id: 2,
    title: 'Family Reunification Case',
    clientId: 1,
    clientName: 'Sarah Johnson',
    status: 'pending',
    priority: 'high',
    type: 'Family Law',
    createdDate: '2024-02-01',
    dueDate: '2024-04-01',
    description: 'Assistance with family reunification process and documentation'
  },
  {
    id: 3,
    title: 'Work Permit Application',
    clientId: 2,
    clientName: 'Michael Chen',
    status: 'in-progress',
    priority: 'medium',
    type: 'Employment',
    createdDate: '2024-02-05',
    dueDate: '2024-03-20',
    description: 'Application for work permit and employment authorization'
  },
  {
    id: 4,
    title: 'Citizenship Application',
    clientId: 3,
    clientName: 'Emily Rodriguez',
    status: 'review',
    priority: 'low',
    type: 'Citizenship',
    createdDate: '2024-02-22',
    dueDate: '2024-05-01',
    description: 'Preparation and submission of citizenship application'
  },
  {
    id: 5,
    title: 'Deportation Defense',
    clientId: 4,
    clientName: 'David Thompson',
    status: 'completed',
    priority: 'high',
    type: 'Defense',
    createdDate: '2023-11-15',
    dueDate: '2024-01-30',
    description: 'Legal defense against deportation proceedings - Successfully resolved'
  }
]

export const getClientById = (id) => {
  return mockClients.find(client => client.id === parseInt(id))
}

export const getCasesByClientId = (clientId) => {
  return mockCases.filter(case_ => case_.clientId === parseInt(clientId))
}

export const getCaseById = (id) => {
  return mockCases.find(case_ => case_.id === parseInt(id))
}

export const getAnalytics = () => {
  const totalClients = mockClients.length
  const activeCases = mockCases.filter(c => c.status === 'in-progress' || c.status === 'pending').length
  const completedCases = mockCases.filter(c => c.status === 'completed').length
  const highPriorityCases = mockCases.filter(c => c.priority === 'high' && c.status !== 'completed').length
  
  return {
    totalClients,
    activeCases,
    completedCases,
    highPriorityCases,
    successRate: Math.round((completedCases / mockCases.length) * 100)
  }
}