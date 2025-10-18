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
          user_id: user.uid,
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

  // Function to sync profile with database (for Firebase users)
  const syncProfileWithDatabase = async (userId: string, firebaseUser?: FirebaseUser) => {
    console.log('[AUTH] Starting profile sync for user:', userId);
    console.log('[AUTH] Firebase user:', firebaseUser?.email);
    
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
          email: firebaseUser?.email || '',
          full_name: firebaseUser?.displayName || firebaseUser?.email?.split('@')[0] || 'مستخدم',
          display_name: firebaseUser?.displayName || firebaseUser?.email?.split('@')[0] || 'مستخدم',
          phone: firebaseUser?.phoneNumber || '',
          phone_number: firebaseUser?.phoneNumber || ''
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
        console.log('[AUTH] No profile found, using Firebase user data fallback');
        const fallbackProfile = {
          id: userId,
          email: firebaseUser?.email || '',
          name: firebaseUser?.displayName || firebaseUser?.email?.split('@')[0] || 'مستخدم',
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
      // Fallback to Firebase user data on any error
      const errorFallback = {
        id: userId,
        email: firebaseUser?.email || '',
        name: firebaseUser?.displayName || firebaseUser?.email?.split('@')[0] || 'مستخدم',
        roles: []
      };
      console.log('[AUTH] Error fallback profile:', errorFallback);
      setUserProfile(errorFallback);
      setUserRoles([]);
    }
  };

  useEffect(() => {
    let mounted = true;
    
    // Set up Firebase auth state listener
    console.log('[AUTH] Setting up Firebase auth state listener...');
    const unsubscribe = onFirebaseAuthStateChange(async (firebaseUser) => {
      console.log('=== [AUTH] Firebase auth state changed ===');
      console.log('[AUTH] Timestamp:', new Date().toISOString());
      console.log('[AUTH] Firebase user:', {
        hasUser: !!firebaseUser,
        userId: firebaseUser?.uid,
        userEmail: firebaseUser?.email,
        displayName: firebaseUser?.displayName
      });
      
      if (!mounted) return;
      
      setUser(firebaseUser);
      
      if (firebaseUser) {
        console.log('[AUTH] ✅ Firebase user authenticated');
        console.log('[AUTH] Starting profile sync...');
        
        // Sync to Supabase
        await syncUserToSupabase(firebaseUser);
        await syncProfileWithDatabase(firebaseUser.uid, firebaseUser);
        
        console.log('[AUTH] Profile sync completed');
      } else {
        console.log('[AUTH] ⚠️ No Firebase user - signed out');
        setUserProfile(null);
        setUserRoles([]);
        setSession(null);

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
    });
    
    // Initialize Firebase auth
    const initializeAuth = () => {
      console.log('=== [AUTH] Initializing Firebase authentication ===');
      console.log('[AUTH] Current user:', firebaseAuth.currentUser?.email);
      
      if (firebaseAuth.currentUser && mounted) {
        setUser(firebaseAuth.currentUser);
        syncUserToSupabase(firebaseAuth.currentUser);
        syncProfileWithDatabase(firebaseAuth.currentUser.uid, firebaseAuth.currentUser);
      }
      
      setLoading(false);
      console.log('[AUTH] ✅ Firebase auth initialized');
    };
    
    initializeAuth();

    return () => {
      mounted = false;
      unsubscribe();

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
          .eq('user_id', user.uid);
      }

      const { error } = await firebaseSignOut()
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