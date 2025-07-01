import { useState } from 'react'
import { Search, Plus, Calendar, User } from 'lucide-react'
import { mockCases } from '../lib/data'
import { format } from 'date-fns'

export default function CasesView({ isAdmin }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  
  const filteredCases = mockCases.filter(case_ => {
    const matchesSearch = case_.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         case_.clientName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || case_.status === selectedStatus
    const matchesType = selectedType === 'all' || case_.type === selectedType
    return matchesSearch && matchesStatus && matchesType
  })
  
  const caseTypes = [...new Set(mockCases.map(case_ => case_.type))]
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cases</h1>
          <p className="text-gray-600">Track and manage all advocacy cases</p>
        </div>
        {isAdmin && (
          <button className="flex items-center space-x-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
            <Plus className="w-4 h-4" />
            <span>New Case</span>
          </button>
        )}
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search cases..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="in-progress">In Progress</option>
            <option value="pending">Pending</option>
            <option value="review">Under Review</option>
            <option value="completed">Completed</option>
          </select>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            {caseTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Cases List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="divide-y divide-gray-200">
          {filteredCases.map((case_) => (
            <div key={case_.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{case_.title}</h3>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {case_.type}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{case_.clientName}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>Due: {format(new Date(case_.dueDate), 'MMM dd, yyyy')}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm">{case_.description}</p>
                </div>
                
                <div className="flex items-center space-x-3 ml-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    case_.status === 'completed' ? 'bg-green-100 text-green-800' :
                    case_.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                    case_.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    case_.status === 'review' ? 'bg-purple-100 text-purple-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {case_.status}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    case_.priority === 'high' ? 'bg-red-100 text-red-800' :
                    case_.priority === 'medium' ? 'bg-orange-100 text-orange-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {case_.priority}
                  </span>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {filteredCases.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No cases found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}