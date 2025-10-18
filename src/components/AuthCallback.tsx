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
        console.log('[AUTH CALLBACK] Pathname:', window.location.pathname);
        console.log('[AUTH CALLBACK] Search params:', window.location.search);
        console.log('[AUTH CALLBACK] Hash:', window.location.hash);
        
        // Check if we have the necessary URL parameters
        const url = new URL(window.location.href);
        const code = url.searchParams.get('code');
        const oauthError = url.searchParams.get('error');
        const errorDescription = url.searchParams.get('error_description');
        const hasHashParams = url.hash.includes('access_token');
        
        // Check for OAuth errors
        if (oauthError) {
          console.error('[AUTH CALLBACK] OAuth error:', oauthError);
          if (!cancelled) {
            setStatus('error');
            toast.error(`خطأ في المصادقة: ${errorDescription || oauthError}`);
            setTimeout(() => (window.location.href = '/'), 2000);
          }
          return;
        }
        
        // Check for existing session first (user might already be logged in)
        const { data: { session: existingSession } } = await supabase.auth.getSession();
        
        if (existingSession) {
          console.log('[AUTH CALLBACK] Session already exists, redirecting');
          if (!cancelled) {
            setStatus('done');
            toast.success('تم تسجيل الدخول بنجاح');
            setTimeout(() => (window.location.href = '/profile'), 600);
          }
          return;
        }
        
        // If no code/hash and no existing session, try to exchange anyway
        if (!code && !hasHashParams) {
          console.log('[AUTH CALLBACK] No OAuth params, attempting exchange anyway');
        }

        console.log('[AUTH CALLBACK] Starting OAuth exchange...');
        
        const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(window.location.href);
        
        if (exchangeError) {
          console.error('[AUTH CALLBACK] Exchange error:', exchangeError);
          
          // Final session check
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session) {
            if (!cancelled) {
              setStatus('done');
              toast.success('تم تسجيل الدخول بنجاح');
              setTimeout(() => (window.location.href = '/profile'), 600);
            }
            return;
          }
          
          if (!cancelled) {
            setStatus('error');
            toast.error('تعذّر إكمال تسجيل الدخول. حاول مرة أخرى.');
            setTimeout(() => (window.location.href = '/'), 1500);
          }
          return;
        }

        console.log('[AUTH CALLBACK] Exchange successful!');
        
        if (!cancelled) {
          setStatus('done');
          toast.success('تم تسجيل الدخول بنجاح');
          setTimeout(() => (window.location.href = '/profile'), 600);
        }
      } catch (e) {
        console.error('[AUTH CALLBACK] ❌ Unexpected error in AuthCallback:', {
          message: e.message,
          stack: e.stack,
          name: e.name
        });
        if (!cancelled) {
          setStatus('error');
          toast.error('حدث خطأ غير متوقع');
          setTimeout(() => (window.location.href = '/'), 1500);
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
