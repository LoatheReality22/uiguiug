// Admin configuration
export const ADMIN_EMAILS = [
  'harley@hyammovement.com',
  'admin@hyammovement.com'
]

export const isAdmin = (email) => {
  return ADMIN_EMAILS.includes(email?.toLowerCase())
}

// Demo users for testing
export const DEMO_USERS = [
  {
    email: 'harley@hyammovement.com',
    password: 'admin123',
    name: 'Harley - Admin',
    role: 'admin'
  },
  {
    email: 'client@demo.com',
    password: 'client123',
    name: 'Demo Client',
    role: 'client'
  }
]

export const authenticateUser = (email, password) => {
  const user = DEMO_USERS.find(u => 
    u.email.toLowerCase() === email.toLowerCase() && u.password === password
  )
  
  if (user) {
    return {
      id: `user_${Date.now()}`,
      email: user.email,
      name: user.name,
      role: user.role,
      isAdmin: isAdmin(user.email)
    }
  }
  
  return null
}