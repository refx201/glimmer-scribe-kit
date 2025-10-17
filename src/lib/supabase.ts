import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://npbblbwuoaqcsysrzjiq.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5wYmJsYnd1b2FxY3N5c3J6amlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUxMzU3OTQsImV4cCI6MjA1MDcxMTc5NH0.d5j3bCX2izoOeMwhXoJwV34qHLcZxnRclPONsQBca-s"

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    }
  }
)

// API base URL - Updated for Express server
export const API_BASE_URL = typeof window !== 'undefined' 
  ? (window.location.hostname === 'localhost' ? 'http://localhost:3001/api/v1' : 'https://api.procell.app/api/v1')
  : 'http://localhost:3001/api/v1'

// API helper function
export async function apiCall(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  // If user is authenticated, use their access token
  const { data: { session } } = await supabase.auth.getSession()
  if (session?.access_token) {
    defaultHeaders.Authorization = `Bearer ${session.access_token}`
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ 
        error: `Server responded with status ${response.status}`,
        code: 'HTTP_ERROR'
      }))
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    // Enhanced error logging
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      console.error('🔴 Network Error: Cannot connect to server')
      console.info('📍 Server URL:', url)
      console.info('💡 Possible solutions:')
      console.info('   1. Make sure the Express server is running')
      console.info('   2. Check if the server port (3001) is correct')
      console.info('   3. Verify CORS settings if needed')
      
      // Create a more user-friendly error
      const networkError = new Error('Cannot connect to server. Please make sure the server is running.')
      networkError.name = 'NetworkError'
      throw networkError
    }
    
    console.error('API call error:', error)
    throw error
  }
}
