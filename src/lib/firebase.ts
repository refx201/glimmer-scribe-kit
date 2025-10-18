import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged, User } from 'firebase/auth';
import { supabase } from '@/integrations/supabase/client';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDmRYecM1JdWP7VzVnurN-Yfa5j-BES97k",
  authDomain: "procell-d97aa.firebaseapp.com",
  projectId: "procell-d97aa",
  storageBucket: "procell-d97aa.firebasestorage.app",
  messagingSenderId: "1060052477811",
  appId: "1:1060052477811:web:8cc3b51ef9e43bae168706",
  measurementId: "G-2LPFJDHLN0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Configure Google provider
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    console.log('🔐 [FIREBASE] Starting Google sign-in...');
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    console.log('✅ [FIREBASE] Google sign-in successful:', user.email);
    
    // Sync user to Supabase profiles
    await syncUserToSupabase(user);
    
    return { user, error: null };
  } catch (error: any) {
    console.error('❌ [FIREBASE] Sign-in error:', error);
    return { user: null, error };
  }
};

// Sign out
export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    console.log('✅ [FIREBASE] Sign-out successful');
    return { error: null };
  } catch (error: any) {
    console.error('❌ [FIREBASE] Sign-out error:', error);
    return { error };
  }
};

// Sync Firebase user to Supabase profiles table
export const syncUserToSupabase = async (user: User) => {
  try {
    console.log('🔄 [FIREBASE] Syncing user to Supabase...');
    
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.uid)
      .maybeSingle();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('❌ [FIREBASE] Error checking profile:', fetchError);
      return;
    }

    if (!existingProfile) {
      // Create new profile
      const profileData = {
        id: user.uid,
        email: user.email || '',
        full_name: user.displayName || user.email?.split('@')[0] || 'مستخدم',
        display_name: user.displayName || user.email?.split('@')[0] || 'مستخدم',
        phone: user.phoneNumber || '',
        phone_number: user.phoneNumber || ''
      };

      const { error: insertError } = await supabase
        .from('profiles')
        .insert(profileData);

      if (insertError) {
        console.error('❌ [FIREBASE] Error creating profile:', insertError);
      } else {
        console.log('✅ [FIREBASE] Profile created successfully');
      }
    } else {
      console.log('✅ [FIREBASE] Profile already exists');
    }
  } catch (error) {
    console.error('❌ [FIREBASE] Error syncing to Supabase:', error);
  }
};

// Auth state observer
export const onFirebaseAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
