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
        console.log('[AUTH] Callback page loaded');
        
        // Check if we have the necessary URL parameters
        const url = new URL(window.location.href);
        const code = url.searchParams.get('code');
        const hasHashParams = url.hash.includes('access_token');
        
        if (!code && !hasHashParams) {
          console.warn('[AUTH] No OAuth code or access token found in URL');
          if (!cancelled) {
            // Check if we already have a session (might have been set by previous attempt)
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
              console.log('[AUTH] Existing session found, redirecting to profile');
              setStatus('done');
              window.location.href = '/profile';
              return;
            }
            
            setStatus('error');
            toast.error('رابط غير صالح. حاول تسجيل الدخول مرة أخرى.');
            setTimeout(() => (window.location.href = '/'), 1500);
          }
          return;
        }

        console.log('[AUTH] Exchanging OAuth code for session...');
        // Perform the exchange; this will persist the session in storage
        const { data, error } = await supabase.auth.exchangeCodeForSession(window.location.href);
        
        if (error) {
          console.error('[AUTH] exchangeCodeForSession error:', error);
          
          // Check if we somehow got a session despite the error
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            console.log('[AUTH] Session exists despite error, continuing');
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

        console.log('[AUTH] Session established from callback:', !!data?.session);
        if (!cancelled) {
          setStatus('done');
          toast.success('تم تسجيل الدخول بنجاح');
          
          // Clean URL first
          try {
            const cleanUrl = url.origin + url.pathname;
            window.history.replaceState({}, document.title, cleanUrl);
          } catch (e) {
            console.warn('[AUTH] Could not clean URL:', e);
          }
          
          setTimeout(() => (window.location.href = '/profile'), 600);
        }
      } catch (e) {
        console.error('[AUTH] Unexpected error in AuthCallback:', e);
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
