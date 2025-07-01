import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth helper functions
export const signUp = async (email, password, fullName) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role: 'client'
      }
    }
  })
  
  if (data.user && !error) {
    // Create user profile in profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: data.user.id,
          email: data.user.email,
          full_name: fullName,
          role: 'client',
          status: 'pending'
        }
      ])
    
    if (profileError) {
      console.error('Error creating profile:', profileError)
    }
  }
  
  return { data, error }
}

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  
  if (data.user && !error) {
    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single()
    
    return { 
      data: { 
        ...data, 
        profile 
      }, 
      error 
    }
  }
  
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    
    return { user, profile }
  }
  
  return { user: null, profile: null }
}

// Database helper functions
export const getClients = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'client')
    .order('created_at', { ascending: false })
  
  return { data, error }
}

export const getCases = async (userId = null) => {
  let query = supabase
    .from('cases')
    .select(`
      *,
      profiles!cases_client_id_fkey(full_name, email)
    `)
    .order('created_at', { ascending: false })
  
  if (userId) {
    query = query.eq('client_id', userId)
  }
  
  const { data, error } = await query
  return { data, error }
}

export const createCase = async (caseData) => {
  const { data, error } = await supabase
    .from('cases')
    .insert([caseData])
    .select()
  
  return { data, error }
}

export const updateCase = async (id, updates) => {
  const { data, error } = await supabase
    .from('cases')
    .update(updates)
    .eq('id', id)
    .select()
  
  return { data, error }
}

export const getAnalytics = async () => {
  // Get total clients
  const { count: totalClients } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'client')
  
  // Get active cases
  const { count: activeCases } = await supabase
    .from('cases')
    .select('*', { count: 'exact', head: true })
    .in('status', ['in-progress', 'pending'])
  
  // Get completed cases
  const { count: completedCases } = await supabase
    .from('cases')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'completed')
  
  // Get high priority cases
  const { count: highPriorityCases } = await supabase
    .from('cases')
    .select('*', { count: 'exact', head: true })
    .eq('priority', 'high')
    .neq('status', 'completed')
  
  // Get total cases for success rate
  const { count: totalCases } = await supabase
    .from('cases')
    .select('*', { count: 'exact', head: true })
  
  const successRate = totalCases > 0 ? Math.round((completedCases / totalCases) * 100) : 0
  
  return {
    totalClients: totalClients || 0,
    activeCases: activeCases || 0,
    completedCases: completedCases || 0,
    highPriorityCases: highPriorityCases || 0,
    successRate
  }
}