import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

// Handles OAuth redirects (Google/Apple). Exchanges the auth code for a session,
// then redirects the user accordingly.
export function AuthCallback() {
  const [status, setStatus] = useState<'working' | 'done' | 'error'>('working');

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        console.log('=== [AUTH CALLBACK] Starting OAuth callback handler ===');
        console.log('[AUTH CALLBACK] Timestamp:', new Date().toISOString());
        console.log('[AUTH CALLBACK] Full URL:', window.location.href);
        
        const url = new URL(window.location.href);
        const code = url.searchParams.get('code');
        const error_param = url.searchParams.get('error');
        const error_description = url.searchParams.get('error_description');
        
        console.log('[AUTH CALLBACK] URL params:', {
          hasCode: !!code,
          hasError: !!error_param,
          errorDescription: error_description
        });
        
        // Handle OAuth errors
        if (error_param) {
          console.error('[AUTH CALLBACK] OAuth error:', error_param);
          if (!cancelled) {
            setStatus('error');
            toast.error(`خطأ في المصادقة: ${error_description || error_param}`);
            setTimeout(() => window.location.href = '/', 2000);
          }
          return;
        }
        
        // Check for existing session first
        console.log('[AUTH CALLBACK] Checking for existing session...');
        const { data: { session: existingSession } } = await supabase.auth.getSession();
        
        if (existingSession) {
          console.log('[AUTH CALLBACK] ✅ Session already exists, redirecting to profile');
          if (!cancelled) {
            setStatus('done');
            toast.success('تم تسجيل الدخول بنجاح');
            setTimeout(() => window.location.href = '/profile', 600);
          }
          return;
        }
        
        // If no code parameter, this is not a valid OAuth callback
        if (!code) {
          console.log('[AUTH CALLBACK] No code parameter, redirecting to home');
          if (!cancelled) {
            setTimeout(() => window.location.href = '/', 500);
          }
          return;
        }

        // Attempt to exchange the code for a session
        console.log('[AUTH CALLBACK] Exchanging code for session...');
        const { data: sessionData, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        
        if (exchangeError) {
          console.error('[AUTH CALLBACK] ❌ Exchange error:', exchangeError);
          
          // One more session check in case it succeeded despite error
          const { data: { session: finalSession } } = await supabase.auth.getSession();
          
          if (finalSession) {
            console.log('[AUTH CALLBACK] ✅ Session found despite error');
            if (!cancelled) {
              setStatus('done');
              toast.success('تم تسجيل الدخول بنجاح');
              setTimeout(() => window.location.href = '/profile', 600);
            }
            return;
          }
          
          // Real error - show message and redirect
          if (!cancelled) {
            setStatus('error');
            toast.error('حدث خطأ في تسجيل الدخول. حاول مرة أخرى.');
            setTimeout(() => window.location.href = '/', 2000);
          }
          return;
        }

        console.log('[AUTH CALLBACK] ✅ Exchange successful!');
        
        if (!cancelled) {
          setStatus('done');
          toast.success('تم تسجيل الدخول بنجاح');
          setTimeout(() => window.location.href = '/profile', 600);
        }
      } catch (e: any) {
        console.error('[AUTH CALLBACK] ❌ Unexpected error:', e);
        if (!cancelled) {
          setStatus('error');
          toast.error('حدث خطأ غير متوقع');
          setTimeout(() => window.location.href = '/', 1500);
        }
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 border-2 border-procell-primary border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-muted-foreground">
          {status === 'working' ? 'جاري إكمال تسجيل الدخول...' : status === 'done' ? 'تم تسجيل الدخول' : 'حدث خطأ'}
        </p>
      </div>
    </main>
  );
}
