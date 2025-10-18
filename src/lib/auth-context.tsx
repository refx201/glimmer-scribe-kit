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
    console.log('[AUTH] Starting profile sync for user:', userId);
    console.log('[AUTH] Session provider:', session.user.app_metadata?.provider);
    console.log('[AUTH] User metadata:', session.user.user_metadata);
    
    try {
      // First, check if profile exists
      console.log('[AUTH] Checking for existing profile...');
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (fetchError) {
        console.error('[AUTH] Error fetching profile:', fetchError);
      } else {
        console.log('[AUTH] Existing profile:', existingProfile ? 'found' : 'not found');
      }

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

        console.log('[AUTH] Creating new profile:', profileData);
        const { error: insertError } = await supabase
          .from('profiles')
          .insert(profileData);

        if (insertError) {
          console.error('[AUTH] Error creating profile:', insertError);
        } else {
          console.log('[AUTH] Profile created successfully');
        }
      }

      // Fetch the latest profile data
      console.log('[AUTH] Fetching latest profile data...');
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('[AUTH] Error fetching profile:', profileError);
      }

      if (profile) {
        console.log('[AUTH] Profile data retrieved:', profile);
        const userProfileData = {
          id: profile.id,
          email: profile.email,
          name: profile.display_name || profile.full_name || 'مستخدم',
          phone: profile.phone || profile.phone_number,
          userType: 'customer' // Always default to customer for OAuth users
        };
        console.log('[AUTH] Setting user profile:', userProfileData);
        setUserProfile(userProfileData);
      } else {
        console.log('[AUTH] No profile found, using metadata fallback');
        const fallbackProfile = {
          id: userId,
          email: session.user.email,
          name: session.user.user_metadata?.name || session.user.user_metadata?.full_name || 'مستخدم',
          userType: 'customer'
        };
        console.log('[AUTH] Fallback profile:', fallbackProfile);
        setUserProfile(fallbackProfile);
      }
    } catch (error) {
      console.error('[AUTH] Critical error syncing profile:', error);
      // Fallback to user metadata on any error
      const errorFallback = {
        id: userId,
        email: session.user.email,
        name: session.user.user_metadata?.name || session.user.user_metadata?.full_name || 'مستخدم',
        userType: 'customer'
      };
      console.log('[AUTH] Error fallback profile:', errorFallback);
      setUserProfile(errorFallback);
    }
  };

  useEffect(() => {
    let mounted = true;
    let isProcessingOAuth = false;
    
    // Set up auth state listener FIRST (critical for OAuth)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[AUTH] State change event:', event, session?.user?.email);
        
        if (!mounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log('[AUTH] User session active, syncing profile...');
          // Sync profile in background
          setTimeout(async () => {
            if (mounted) {
              await syncProfileWithDatabase(session.user.id, session);
            }
          }, 0);
          
          // Show welcome for email/password logins (OAuth handled in init)
          if (event === 'SIGNED_IN' && !isProcessingOAuth) {
            const userName = session.user.user_metadata?.name || session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'المستخدم';
            
            setTimeout(() => {
              toast.success(`أهلاً بك، ${userName}!`, {
                description: 'تم تسجيل الدخول بنجاح',
                duration: 4000
              });
            }, 100);
          }
        } else {
          setUserProfile(null);
        }
        
        setLoading(false);
      }
    );
    
    // Initialize auth by checking for OAuth callback
    const initializeAuth = async () => {
      try {
        // Check if we have an OAuth callback token in URL
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const hasAuthCallback = hashParams.has('access_token') || hashParams.has('code');
        
        if (hasAuthCallback) {
          console.log('[AUTH] Detected OAuth callback, processing...');
          isProcessingOAuth = true;
          
          // Wait longer for Supabase to process OAuth tokens
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Retry getting session up to 3 times
          let session = null;
          for (let i = 0; i < 3; i++) {
            console.log(`[AUTH] Attempt ${i + 1} to get session...`);
            const { data, error } = await supabase.auth.getSession();
            
            if (error) {
              console.error('[AUTH] Error getting session:', error);
            }
            
            if (data?.session) {
              session = data.session;
              console.log('[AUTH] Session retrieved successfully!');
              break;
            }
            
            if (i < 2) {
              console.log('[AUTH] Session not ready, waiting...');
              await new Promise(resolve => setTimeout(resolve, 300));
            }
          }
          
          if (!mounted) return;
          
          if (session) {
            console.log('[AUTH] OAuth session established:', session.user.email);
            setSession(session);
            setUser(session.user);
            
            // Sync profile
            await syncProfileWithDatabase(session.user.id, session);
            
            // Show welcome message
            const userName = session.user.user_metadata?.name || session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'المستخدم';
            const provider = session.user.app_metadata?.provider;
            
            toast.success(`أهلاً بك، ${userName}!`, {
              description: provider === 'google' ? 'تم تسجيل الدخول بنجاح عبر Google' : 'تم تسجيل الدخول بنجاح',
              duration: 4000
            });
            
            // Clean up URL
            setTimeout(() => {
              window.history.replaceState(null, '', window.location.pathname);
            }, 500);
          } else {
            console.error('[AUTH] Failed to retrieve OAuth session after multiple attempts');
            toast.error('فشل تسجيل الدخول. يرجى المحاولة مرة أخرى.');
          }
        } else {
          // Regular session check (no OAuth)
          console.log('[AUTH] Checking for existing session...');
          const { data: { session }, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error('[AUTH] Error getting session:', error);
          }
          
          if (!mounted) return;
          
          if (session) {
            console.log('[AUTH] Existing session found:', session.user.email);
            setSession(session);
            setUser(session.user);
            await syncProfileWithDatabase(session.user.id, session);
          } else {
            console.log('[AUTH] No existing session');
          }
        }
        
        setLoading(false);
        console.log('[AUTH] Initialization complete');
      } catch (error) {
        console.error('[AUTH] Critical error during initialization:', error);
        if (mounted) {
          setLoading(false);
          toast.error('حدث خطأ في تسجيل الدخول');
        }
      }
    };
    
    // Start initialization
    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
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