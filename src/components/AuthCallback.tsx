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
        
        // Handle OAuth errors immediately
        if (error_param) {
          console.error('[AUTH CALLBACK] OAuth error:', error_param);
          if (!cancelled) {
            setStatus('error');
            toast.error(`خطأ في المصادقة: ${error_description || error_param}`);
            setTimeout(() => (window.location.href = '/'), 2000);
          }
          return;
        }

        // 1) If session already exists, we're done
        console.log('[AUTH CALLBACK] Checking for existing session...');
        const { data: { session: existingSession } } = await supabase.auth.getSession();
        if (existingSession) {
          console.log('[AUTH CALLBACK] ✅ Session already exists, redirecting to profile');
          if (!cancelled) {
            setStatus('done');
            toast.success('تم تسجيل الدخول بنجاح');
            setTimeout(() => (window.top ? (window.top.location.href = '/profile') : (window.location.href = '/profile')), 600);
          }
          return;
        }

        // 1.1) No session yet — if we have an OAuth code, immediately exchange it for a session
        if (code) {
          console.log('[AUTH CALLBACK] No existing session. Trying immediate code exchange...');
          const { error: immediateExchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (immediateExchangeError) {
            console.warn('[AUTH CALLBACK] Immediate exchange failed:', immediateExchangeError.message);
          } else {
            const { data: { session: newSession } } = await supabase.auth.getSession();
            if (newSession) {
              console.log('[AUTH CALLBACK] ✅ Session established via immediate exchange');
              if (!cancelled) {
                setStatus('done');
                toast.success('تم تسجيل الدخول بنجاح');
                setTimeout(() => (window.top ? (window.top.location.href = '/profile') : (window.location.href = '/profile')), 600);
              }
              return;
            }
          }
        }

        // 2) If no code and no session, this might be after Supabase removed the code from URL.
        // We'll wait briefly for the client to finalize the PKCE exchange automatically (detectSessionInUrl=true).
        const maxWaitMs = 12000;
        const intervalMs = 300;
        let waited = 0;
        let attemptedManualExchange = false;

        while (!cancelled && waited <= maxWaitMs) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            console.log('[AUTH CALLBACK] ✅ Session detected after wait');
            if (!cancelled) {
              setStatus('done');
              toast.success('تم تسجيل الدخول بنجاح');
              setTimeout(() => (window.top ? (window.top.location.href = '/profile') : (window.location.href = '/profile')), 600);
            }
            return;
          }

          // As a fallback, if we still don't have a session after ~1s and we have a code,
          // try manual exchange once (covers cases where auto handling didn’t run).
          if (!attemptedManualExchange && code && waited >= 1000) {
            attemptedManualExchange = true;
            console.log('[AUTH CALLBACK] Attempting manual code exchange fallback...');
            const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
            if (exchangeError) {
              console.warn('[AUTH CALLBACK] Manual exchange fallback error:', exchangeError.message);
            } else {
              // After a successful manual exchange, loop will detect the session on next iteration
              console.log('[AUTH CALLBACK] Manual exchange reported success, rechecking session...');
            }
          }

          await new Promise((res) => setTimeout(res, intervalMs));
          waited += intervalMs;
        }

        // 3) If we reach here, no session was created
        console.error('[AUTH CALLBACK] ❌ No session established after waiting');
        if (!cancelled) {
          setStatus('error');
          toast.error('تعذر إكمال تسجيل الدخول. حاول مرة أخرى.');
           setTimeout(() => (window.top ? (window.top.location.href = '/') : (window.location.href = '/')), 2000);
        }
      } catch (e: any) {
        console.error('[AUTH CALLBACK] ❌ Unexpected error:', e);
        if (!cancelled) {
          setStatus('error');
          toast.error('حدث خطأ غير متوقع');
          setTimeout(() => (window.top ? (window.top.location.href = '/') : (window.location.href = '/')), 1500);
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
