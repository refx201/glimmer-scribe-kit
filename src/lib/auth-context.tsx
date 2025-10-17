import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, name: string, userType?: string, phone?: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signInWithApple: () => Promise<void>
  signOut: () => Promise<void>
  userProfile: any
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Set up auth state listener FIRST (before checking for existing session)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email)
        
        // Store both session and user
        setSession(session)
        setUser(session?.user ?? null)
        
        // Set basic profile from user metadata
        if (session?.user) {
          setUserProfile({
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.name || session.user.user_metadata?.full_name || 'مستخدم',
            userType: session.user.user_metadata?.userType || 'customer'
          })
          
          // Handle successful sign in
          if (event === 'SIGNED_IN') {
            const userName = session.user.user_metadata?.name || session.user.user_metadata?.full_name || 'المستخدم';
            const isGoogleSignIn = session.user.app_metadata?.provider === 'google';
            
            // Show welcome message
            toast.success(`أهلاً بك، ${userName}!`, {
              description: isGoogleSignIn ? 'تم تسجيل الدخول بنجاح عبر Google' : 'تم تسجيل الدخول بنجاح'
            });
            
            // Clean up OAuth hash from URL if present
            if (window.location.hash.includes('access_token')) {
              window.history.replaceState({}, document.title, window.location.pathname);
            }
          }
        } else {
          setUserProfile(null)
        }
        
        setLoading(false)
      }
    )

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        setUserProfile({
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.name || session.user.user_metadata?.full_name || 'مستخدم',
          userType: session.user.user_metadata?.userType || 'customer'
        })
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])


  const signUp = async (email: string, password: string, name: string, userType = 'customer', phone?: string) => {
    try {
      console.log('Frontend signup attempt - auto-confirming user')
      
      // Use Supabase client with emailRedirectTo and auto-confirmation disabled
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            name,
            userType,
            phone: phone || ''
          }
        }
      })
      
      if (error) throw error
      
      console.log('User signed up successfully:', data.user?.email)
      
      // Show welcome toast
      toast.success('مرحباً بك! تم إنشاء حسابك بنجاح', {
        description: 'يمكنك الآن تسجيل الدخول والاستمتاع بخدماتنا'
      })
    } catch (error) {
      console.error('Signup error:', error)
      throw error
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) throw error
      
      // Show welcome toast
      const userName = data.user?.user_metadata?.name || 'المستخدم'
      toast.success(`أهلاً بك، ${userName}!`, {
        description: 'تم تسجيل الدخول بنجاح'
      })
    } catch (error) {
      console.error('Sign in error:', error)
      throw error
    }
  }

  const signInWithGoogle = async () => {
    try {
      const currentPath = window.location.pathname;
      const redirectTo = currentPath === '/login' || currentPath === '/signup' ? '/' : currentPath;
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}${redirectTo}`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });
      
      if (error) throw error;
      
      // After successful OAuth, the user will be redirected back to the site
      // The auth state change listener will handle the success message
    } catch (error) {
      console.error('Google sign in error:', error);
      toast.error('فشل تسجيل الدخول عبر Google');
      throw error;
    }
  }

  const signInWithApple = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: `${window.location.origin}/`,
        }
      })
      if (error) throw error
    } catch (error) {
      console.error('Apple sign in error:', error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      console.error('Sign out error:', error)
      throw error
    }
  }

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signInWithApple,
    signOut,
    userProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}