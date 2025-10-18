import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { User, Session, RealtimeChannel } from '@supabase/supabase-js'
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
  const syncProfileWithDatabase = useCallback(async (userId: string, email?: string, name?: string) => {
    console.log('[AUTH] Starting profile sync for user:', userId);
    
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
      if (!existingProfile && !fetchError && email) {
        const profileData = {
          id: userId,
          email: email,
          full_name: name || email.split('@')[0] || 'مستخدم',
          display_name: name || email.split('@')[0] || 'مستخدم'
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
        console.log('[AUTH] No profile found, using fallback');
        const fallbackProfile = {
          id: userId,
          email: email || '',
          name: name || email?.split('@')[0] || 'مستخدم',
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
      const errorFallback = {
        id: userId,
        email: email || '',
        name: name || email?.split('@')[0] || 'مستخدم',
        roles: []
      };
      console.log('[AUTH] Error fallback profile:', errorFallback);
      setUserProfile(errorFallback);
      setUserRoles([]);
    }
  }, [fetchUserRoles, setupPresenceTracking]);

  useEffect(() => {
    let mounted = true;
    
    // Set up Supabase auth state listener
    console.log('[AUTH] Setting up Supabase auth state listener...');
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('=== [AUTH] Supabase auth state changed ===');
        console.log('[AUTH] Event:', event);
        console.log('[AUTH] Session:', session ? 'exists' : 'null');
        
        if (!mounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log('[AUTH] ✅ User authenticated:', session.user.email);
          await syncProfileWithDatabase(
            session.user.id, 
            session.user.email || '', 
            session.user.user_metadata?.full_name || session.user.user_metadata?.name
          );
        } else {
          console.log('[AUTH] ⚠️ No user - signed out');
          setUserProfile(null);
          setUserRoles([]);

          // Clean up presence tracking
          if (presenceChannel) {
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
    
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        syncProfileWithDatabase(
          session.user.id,
          session.user.email || '',
          session.user.user_metadata?.full_name || session.user.user_metadata?.name
        );
      }
      setLoading(false);
    });

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
  }, [syncProfileWithDatabase, presenceChannel]);

  const signUp = async (email: string, password: string, name: string, userType = 'customer', phone?: string) => {
    try {
      console.log('Frontend signup attempt - auto-confirming user')
      
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
    } catch (error) {
      console.error('Sign in error:', error)
      throw error
    }
  }

  const signInWithGoogle = async () => {
    // Google sign-in is handled by GoogleAuthButton component using Firebase
    console.log('ℹ️ [AUTH] Use GoogleAuthButton component for Google sign-in');
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

      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

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
