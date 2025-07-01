import { useState } from 'react'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'
import { authenticateUser } from '../lib/auth'

export default function AuthForm({ onLogin }) {
  const [isSignup, setIsSignup] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isSignup) {
        // For demo purposes, create a new user
        const newUser = {
          id: `user_${Date.now()}`,
          email: formData.email,
          name: formData.fullName,
          role: 'client',
          isAdmin: false
        }
        onLogin(newUser)
      } else {
        // Authenticate existing user
        const user = authenticateUser(formData.email, formData.password)
        if (user) {
          onLogin(user)
        } else {
          setError('Invalid email or password. Try harley@hyammovement.com / admin123')
        }
      }
    } catch (err) {
      setError('Authentication failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">H</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Hyam Movement</h1>
          <p className="text-gray-600 mt-2">
            {isSignup ? 'Create your account' : 'Welcome back'}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {isSignup && (
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required={isSignup}
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
                placeholder="Enter your full name"
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
                placeholder="Enter your password"
                minLength="6"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading 
              ? (isSignup ? 'Creating Account...' : 'Signing In...') 
              : (isSignup ? 'Create Account' : 'Sign In')
            }
          </button>
        </form>

        {/* Toggle Form */}
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsSignup(!isSignup)
              setError('')
              setFormData({ email: '', password: '', fullName: '' })
            }}
            className="text-gray-600 hover:text-black transition-colors"
          >
            {isSignup 
              ? "Already have an account? Sign in" 
              : "Don't have an account? Create one"
            }
          </button>
        </div>

        {/* Demo Credentials */}
        {!isSignup && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Demo Credentials:</p>
            <div className="space-y-1 text-sm">
              <p className="font-mono text-gray-800">harley@hyammovement.com / admin123</p>
              <p className="font-mono text-gray-800">client@demo.com / client123</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}