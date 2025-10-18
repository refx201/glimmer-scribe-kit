import { supabase as supabaseClient } from '@/integrations/supabase/client'

export const supabase = supabaseClient as any

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
