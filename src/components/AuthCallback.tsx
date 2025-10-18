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
        const state = url.searchParams.get('state');
        const oauthError = url.searchParams.get('error');
        const errorDescription = url.searchParams.get('error_description');
        const hasHashParams = url.hash.includes('access_token');
        
        console.log('[AUTH CALLBACK] URL Parameters:', {
          code: code ? `${code.substring(0, 10)}...` : null,
          state: state ? `${state.substring(0, 10)}...` : null,
          error: oauthError,
          errorDescription,
          hasHashParams
        });
        
        // Check for OAuth errors
        if (oauthError) {
          console.error('[AUTH CALLBACK] OAuth error returned:', oauthError);
          console.error('[AUTH CALLBACK] Error description:', errorDescription);
          if (!cancelled) {
            setStatus('error');
            toast.error(`خطأ في المصادقة: ${errorDescription || oauthError}`);
            setTimeout(() => (window.location.href = '/'), 2000);
          }
          return;
        }
        
        if (!code && !hasHashParams) {
          console.warn('[AUTH CALLBACK] ⚠️ No OAuth code or access token found in URL');
          if (!cancelled) {
            console.log('[AUTH CALLBACK] Checking for existing session as fallback...');
            // Check if we already have a session (might have been set by previous attempt)
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();
            console.log('[AUTH CALLBACK] Existing session check:', {
              hasSession: !!session,
              error: sessionError?.message,
              userId: session?.user?.id
            });
            
            if (session) {
              console.log('[AUTH CALLBACK] ✅ Existing session found, redirecting to profile');
              setStatus('done');
              window.location.href = '/profile';
              return;
            }
            
            console.error('[AUTH CALLBACK] ❌ No session found and no OAuth params');
            setStatus('error');
            toast.error('رابط غير صالح. حاول تسجيل الدخول مرة أخرى.');
            setTimeout(() => (window.location.href = '/'), 1500);
          }
          return;
        }

        console.log('[AUTH CALLBACK] 🔄 Starting OAuth code exchange...');
        console.log('[AUTH CALLBACK] Code length:', code?.length);
        console.log('[AUTH CALLBACK] Has hash params:', hasHashParams);
        // Perform the exchange; this will persist the session in storage
        const exchangeStartTime = Date.now();
        console.log('[AUTH CALLBACK] Calling exchangeCodeForSession with URL:', window.location.href);
        
        const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(window.location.href);
        
        const exchangeDuration = Date.now() - exchangeStartTime;
        console.log('[AUTH CALLBACK] Exchange completed in:', exchangeDuration, 'ms');
        
        if (exchangeError) {
          console.error('[AUTH CALLBACK] ❌ exchangeCodeForSession error:', {
            message: exchangeError.message,
            status: exchangeError.status,
            name: exchangeError.name,
            stack: exchangeError.stack
          });
          
          // Check if we somehow got a session despite the error
          console.log('[AUTH CALLBACK] Checking for session despite error...');
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          console.log('[AUTH CALLBACK] Session check result:', {
            hasSession: !!session,
            sessionError: sessionError?.message,
            userId: session?.user?.id,
            userEmail: session?.user?.email
          });
          
          if (session) {
            console.log('[AUTH CALLBACK] ✅ Session exists despite error, continuing');
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

        console.log('[AUTH CALLBACK] ✅ Exchange successful!');
        console.log('[AUTH CALLBACK] Session data:', {
          hasSession: !!data?.session,
          hasUser: !!data?.user,
          userId: data?.user?.id,
          userEmail: data?.user?.email,
          provider: data?.user?.app_metadata?.provider,
          expiresAt: data?.session?.expires_at
        });
        
        if (!cancelled) {
          setStatus('done');
          toast.success('تم تسجيل الدخول بنجاح');
          
          // Clean URL first
          console.log('[AUTH CALLBACK] Cleaning URL parameters...');
          try {
            const cleanUrl = url.origin + url.pathname;
            window.history.replaceState({}, document.title, cleanUrl);
            console.log('[AUTH CALLBACK] URL cleaned:', cleanUrl);
          } catch (e) {
            console.warn('[AUTH CALLBACK] ⚠️ Could not clean URL:', e);
          }
          
          console.log('[AUTH CALLBACK] Redirecting to profile in 600ms...');
          setTimeout(() => {
            console.log('[AUTH CALLBACK] 🚀 Redirecting now to /profile');
            window.location.href = '/profile';
          }, 600);
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
