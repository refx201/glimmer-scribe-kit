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

        // 1) First, check if session already exists
        console.log('[AUTH CALLBACK] Checking for existing session...');
        const { data: { session: existingSession } } = await supabase.auth.getSession();
        if (existingSession) {
          console.log('[AUTH CALLBACK] ✅ Session already exists, redirecting to profile');
          if (!cancelled) {
            const userName = existingSession.user.user_metadata?.name || 
                            existingSession.user.user_metadata?.full_name || 
                            existingSession.user.email?.split('@')[0] || 
                            'المستخدم';
            setStatus('done');
            toast.success(`أهلاً بك، ${userName}!`);
            setTimeout(() => (window.location.href = '/profile'), 600);
          }
          return;
        }

        // 2) Check if we have a code to exchange
        if (!code) {
          console.error('[AUTH CALLBACK] ❌ No OAuth code found in URL and no existing session');
          if (!cancelled) {
            setStatus('error');
            toast.error('خطأ في رابط المصادقة. يرجى المحاولة مرة أخرى.');
            setTimeout(() => (window.location.href = '/'), 2000);
          }
          return;
        }

        console.log('[AUTH CALLBACK] Found OAuth code, exchanging for session...');
        
        // 3) Exchange the code for a session immediately
        const { data: exchangeData, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        
        if (exchangeError) {
          console.error('[AUTH CALLBACK] ❌ Code exchange failed:', exchangeError.message);
          if (!cancelled) {
            setStatus('error');
            toast.error('فشل تسجيل الدخول: ' + exchangeError.message);
            setTimeout(() => (window.location.href = '/'), 2000);
          }
          return;
        }

        if (!exchangeData.session) {
          console.error('[AUTH CALLBACK] ❌ No session returned from exchange');
          if (!cancelled) {
            setStatus('error');
            toast.error('تعذر إنشاء الجلسة');
            setTimeout(() => (window.location.href = '/'), 2000);
          }
          return;
        }

        // 4) Session established successfully
        console.log('[AUTH CALLBACK] ✅ Session established successfully');
        console.log('[AUTH CALLBACK] User:', exchangeData.session.user.email);
        
        if (!cancelled) {
          const userName = exchangeData.session.user.user_metadata?.name || 
                          exchangeData.session.user.user_metadata?.full_name || 
                          exchangeData.session.user.email?.split('@')[0] || 
                          'المستخدم';
          
          setStatus('done');
          toast.success(`أهلاً بك، ${userName}!`, {
            description: 'تم تسجيل الدخول بنجاح عبر Google',
            duration: 3000
          });
          
          // Redirect to profile
          setTimeout(() => {
            console.log('[AUTH CALLBACK] Redirecting to profile...');
            window.location.href = '/profile';
          }, 800);
        }
      } catch (e: any) {
        console.error('[AUTH CALLBACK] ❌ Unexpected error:', e);
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
