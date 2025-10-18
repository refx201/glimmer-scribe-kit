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

  // Function to sync profile with database
  const syncProfileWithDatabase = async (userId: string, session: Session) => {
    try {
      // First, check if profile exists
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      // Create profile if it doesn't exist
      if (!existingProfile && !fetchError) {
        const profileData = {
          id: userId,
          email: session.user.email,
          full_name: session.user.user_metadata?.name || session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'مستخدم',
          display_name: session.user.user_metadata?.name || session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'مستخدم',
          phone: session.user.user_metadata?.phone || '',
          phone_number: session.user.user_metadata?.phone || ''
        };

        const { error: insertError } = await supabase
          .from('profiles')
          .insert(profileData);

        if (insertError) {
          console.error('Error creating profile:', insertError);
        }
      }

      // Fetch the latest profile data
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profile) {
        setUserProfile({
          id: profile.id,
          email: profile.email,
          name: profile.display_name || profile.full_name || 'مستخدم',
          phone: profile.phone || profile.phone_number,
          userType: session.user.user_metadata?.userType || 'customer'
        });
      } else {
        // Fallback to user metadata
        setUserProfile({
          id: userId,
          email: session.user.email,
          name: session.user.user_metadata?.name || session.user.user_metadata?.full_name || 'مستخدم',
          userType: session.user.user_metadata?.userType || 'customer'
        });
      }
    } catch (error) {
      console.error('Error syncing profile:', error);
      // Fallback to user metadata on any error
      setUserProfile({
        id: userId,
        email: session.user.email,
        name: session.user.user_metadata?.name || session.user.user_metadata?.full_name || 'مستخدم',
        userType: session.user.user_metadata?.userType || 'customer'
      });
    }
  };

  useEffect(() => {
    let mounted = true;
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email)
        
        if (!mounted) return;
        
        // Store session and user
        setSession(session)
        setUser(session?.user ?? null)
        
        // Sync profile from database
        if (session?.user) {
          // Use setTimeout to defer the profile sync and prevent blocking
          setTimeout(async () => {
            if (mounted) {
              await syncProfileWithDatabase(session.user.id, session);
            }
          }, 0);
          
          // Handle successful sign in - show toast only once
          if (event === 'SIGNED_IN') {
            const userName = session.user.user_metadata?.name || session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'المستخدم';
            const isGoogleSignIn = session.user.app_metadata?.provider === 'google';
            
            // Show welcome message
            setTimeout(() => {
              toast.success(`أهلاً بك، ${userName}!`, {
                description: isGoogleSignIn ? 'تم تسجيل الدخول بنجاح عبر Google' : 'تم تسجيل الدخول بنجاح',
                duration: 4000
              });
            }, 100);
            
            // Clean up URL hash after successful OAuth sign in
            if (window.location.hash.includes('access_token')) {
              setTimeout(() => {
                window.history.replaceState(null, '', window.location.pathname);
              }, 500);
            }
          }
        } else {
          setUserProfile(null)
        }
        
        setLoading(false)
      }
    )

    // THEN get session - this will process URL hash if present
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      
      if (session) {
        setSession(session)
        setUser(session?.user ?? null)
        // Defer profile sync
        setTimeout(() => {
          if (mounted) {
            syncProfileWithDatabase(session.user.id, session);
          }
        }, 0);
      }
      setLoading(false)
    })

    return () => {
      mounted = false;
      subscription.unsubscribe();
    }
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
      const redirectPath = currentPath === '/login' || currentPath === '/signup' ? '/' : currentPath;

      const host = window.location.hostname;
      const isProdDomain = host === 'procell.app' || host === 'www.procell.app';
      const redirectBase = isProdDomain ? 'https://procell.app' : window.location.origin;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${redirectBase}${redirectPath}`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) throw error;
    } catch (error: any) {
      console.error('Google sign in error:', error);
      const msg = error?.message?.includes('Can only be used on')
        ? 'تسجيل Google يعمل فقط على النطاق procell.app. افتح الموقع على https://procell.app وحاول مرة أخرى.'
        : 'فشل تسجيل الدخول عبر Google';
      toast.error(msg);
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