import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { User, Session, RealtimeChannel } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

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
  userRoles: string[]
  hasRole: (role: string) => boolean
  isAdmin: boolean
  updatePresence: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [userRoles, setUserRoles] = useState<string[]>([])
  const [presenceChannel, setPresenceChannel] = useState<RealtimeChannel | null>(null)

  // Fetch user roles from database
  const fetchUserRoles = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);

      if (error) {
        console.error('[AUTH] Error fetching roles:', error);
        return [];
      }

      const roles = data?.map(r => r.role) || [];
      console.log('[AUTH] User roles:', roles);
      return roles;
    } catch (error) {
      console.error('[AUTH] Critical error fetching roles:', error);
      return [];
    }
  }, []);

  // Update user presence in realtime
  const updatePresence = useCallback(async () => {
    if (!user) return;

    try {
      await supabase
        .from('user_presence')
        .upsert({
          user_id: user.id,
          heartbeat_at: new Date().toISOString(),
          metadata: {
            page: window.location.pathname,
            userAgent: navigator.userAgent
          }
        }, {
          onConflict: 'user_id'
        });
    } catch (error) {
      console.error('[AUTH] Error updating presence:', error);
    }
  }, [user]);

  // Setup Supabase Realtime presence tracking
  const setupPresenceTracking = useCallback(async (userId: string) => {
    console.log('[AUTH] Setting up presence tracking for:', userId);

    // Clean up existing channel
    if (presenceChannel) {
      await supabase.removeChannel(presenceChannel);
    }

    // Create new presence channel
    const channel = supabase.channel(`presence:${userId}`, {
      config: {
        presence: {
          key: userId
        }
      }
    });

    // Track online status
    channel
      .on('presence', { event: 'sync' }, () => {
        console.log('[AUTH] Presence synced');
      })
      .on('presence', { event: 'join' }, ({ newPresences }) => {
        console.log('[AUTH] User joined:', newPresences);
      })
      .on('presence', { event: 'leave' }, ({ leftPresences }) => {
        console.log('[AUTH] User left:', leftPresences);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            user_id: userId,
            online_at: new Date().toISOString()
          });

          // Update presence in database
          await updatePresence();

          // Set up heartbeat interval
          const heartbeatInterval = setInterval(updatePresence, 30000); // Every 30 seconds

          // Store interval ID for cleanup
          (channel as any).heartbeatInterval = heartbeatInterval;
        }
      });

    setPresenceChannel(channel);

    return channel;
  }, [presenceChannel, updatePresence]);

  // Function to sync profile with database
  const syncProfileWithDatabase = async (userId: string, session: Session) => {
    console.log('[AUTH] Starting profile sync for user:', userId);
    console.log('[AUTH] Session provider:', session.user.app_metadata?.provider);
    console.log('[AUTH] User metadata:', session.user.user_metadata);
    
    try {
      // Fetch user roles
      const roles = await fetchUserRoles(userId);
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
          roles: roles
        };
        console.log('[AUTH] Setting user profile:', userProfileData);
        setUserProfile(userProfileData);
        setUserRoles(roles);

        // Setup presence tracking
        await setupPresenceTracking(userId);
      } else {
        console.log('[AUTH] No profile found, using metadata fallback');
        const fallbackProfile = {
          id: userId,
          email: session.user.email,
          name: session.user.user_metadata?.name || session.user.user_metadata?.full_name || 'مستخدم',
          roles: roles
        };
        console.log('[AUTH] Fallback profile:', fallbackProfile);
        setUserProfile(fallbackProfile);
        setUserRoles(roles);

        // Setup presence tracking
        await setupPresenceTracking(userId);
      }
    } catch (error) {
      console.error('[AUTH] Critical error syncing profile:', error);
      // Fallback to user metadata on any error
      const errorFallback = {
        id: userId,
        email: session.user.email,
        name: session.user.user_metadata?.name || session.user.user_metadata?.full_name || 'مستخدم',
        roles: []
      };
      console.log('[AUTH] Error fallback profile:', errorFallback);
      setUserProfile(errorFallback);
      setUserRoles([]);
    }
  };

  useEffect(() => {
    let mounted = true;
    
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
          
          // Handle successful sign-in (both OAuth and email/password)
          if (event === 'SIGNED_IN') {
            const userName = session.user.user_metadata?.name || session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'المستخدم';
            const provider = session.user.app_metadata?.provider;
            
            console.log('[AUTH] Sign in successful, provider:', provider);
            
            toast.success(`أهلاً بك، ${userName}!`, {
              description: provider === 'google' ? 'تم تسجيل الدخول بنجاح عبر Google' : 'تم تسجيل الدخول بنجاح',
              duration: 4000
            });
            
            // Redirect to profile after sign-in
            setTimeout(() => {
              window.location.href = '/profile';
            }, 1000);
          }
        } else {
          setUserProfile(null);
          setUserRoles([]);

          // Clean up presence tracking
          if (presenceChannel) {
            // Clear heartbeat interval
            if ((presenceChannel as any).heartbeatInterval) {
              clearInterval((presenceChannel as any).heartbeatInterval);
            }
            await supabase.removeChannel(presenceChannel);
            setPresenceChannel(null);
          }
        }
        
        setLoading(false);
      }
    );
    
    // Initialize auth by checking for existing session
    const initializeAuth = async () => {
      try {
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

      // Cleanup presence tracking
      if (presenceChannel) {
        if ((presenceChannel as any).heartbeatInterval) {
          clearInterval((presenceChannel as any).heartbeatInterval);
        }
        supabase.removeChannel(presenceChannel);
      }
    };
  }, [fetchUserRoles, setupPresenceTracking])


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
      
      // onAuthStateChange will handle the redirect
    } catch (error) {
      console.error('Sign in error:', error)
      throw error
    }
  }

  const signInWithGoogle = async () => {
    try {
      console.log('[AUTH] Starting Google sign in...');
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      })
      if (error) {
        console.error('[AUTH] Google OAuth error:', error);
        throw error;
      }
      console.log('[AUTH] Google OAuth redirect initiated');
    } catch (error) {
      console.error('[AUTH] Google sign in error:', error)
      toast.error('حدثت مشكلة في تسجيل الدخول عبر Google');
      throw error
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
      // Clean up presence before signing out
      if (user) {
        await supabase
          .from('user_presence')
          .delete()
          .eq('user_id', user.id);
      }

      const { error } = await supabase.auth.signOut()
      if (error) throw error

      // Redirect to home after sign out
      setTimeout(() => {
        window.location.href = '/';
      }, 500);
    } catch (error) {
      console.error('Sign out error:', error)
      throw error
    }
  }

  // Helper functions for role checking
  const hasRole = useCallback((role: string) => {
    return userRoles.includes(role);
  }, [userRoles]);

  const isAdmin = useCallback(() => {
    return userRoles.includes('admin');
  }, [userRoles]);

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signInWithApple,
    signOut,
    userProfile,
    userRoles,
    hasRole,
    isAdmin: isAdmin(),
    updatePresence
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