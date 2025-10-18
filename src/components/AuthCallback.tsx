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
        const url = window.location.href;
        console.log('[AUTH] Callback page loaded with URL:', url);

        // Perform the exchange; this will persist the session in storage
        const { data, error } = await supabase.auth.exchangeCodeForSession(url);
        if (error) {
          console.error('[AUTH] exchangeCodeForSession error on callback page:', error);
          if (!cancelled) {
            setStatus('error');
            toast.error('تعذّر إكمال تسجيل الدخول. حاول مرة أخرى.');
            setTimeout(() => (window.location.href = '/'), 1200);
          }
          return;
        }

        console.log('[AUTH] Session established from callback:', !!data?.session);
        if (!cancelled) {
          setStatus('done');
          toast.success('تم تسجيل الدخول بنجاح');
          setTimeout(() => (window.location.href = '/profile'), 600);
        }
      } catch (e) {
        console.error('[AUTH] Unexpected error in AuthCallback:', e);
        if (!cancelled) {
          setStatus('error');
          toast.error('حدث خطأ غير متوقع');
          setTimeout(() => (window.location.href = '/'), 1200);
        }
      } finally {
        // Clean URL (remove code/hash params) without navigating away if we stayed
        try {
          const u = new URL(window.location.href);
          const clean = u.origin + u.pathname;
          window.history.replaceState({}, document.title, clean);
        } catch {}
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
