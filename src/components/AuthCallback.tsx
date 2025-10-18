import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Constants - No magic numbers!
const REDIRECT_DELAY_SUCCESS = 1200; // ms - Time to show success message
const REDIRECT_DELAY_ERROR = 2000; // ms - Time to show error message

/**
 * AuthCallback Component
 * Single Responsibility: Exchange OAuth code for session
 * Clean Architecture: No business logic, just code exchange
 */
export function AuthCallback() {
  const [status, setStatus] = useState<'working' | 'done' | 'error'>('working');

  useEffect(() => {
    let cancelled = false;

    const exchangeCodeForSession = async () => {
      try {
        console.log('🔐 [AUTH CALLBACK] OAuth callback initiated');
        console.log('⏰ [AUTH CALLBACK] Timestamp:', new Date().toISOString());
        console.log('🌐 [AUTH CALLBACK] URL:', window.location.href);
        
        const url = new URL(window.location.href);
        const code = url.searchParams.get('code');
        const error_param = url.searchParams.get('error');
        const error_description = url.searchParams.get('error_description');
        
        // Step 1: Check for OAuth errors
        if (error_param) {
          console.error('❌ [AUTH CALLBACK] OAuth provider error:', error_param);
          if (!cancelled) {
            setStatus('error');
            toast.error(`خطأ في المصادقة: ${error_description || error_param}`);
            setTimeout(() => (window.location.href = '/'), REDIRECT_DELAY_ERROR);
          }
          return;
        }

        // Step 2: Verify we have an OAuth code
        if (!code) {
          console.error('❌ [AUTH CALLBACK] No OAuth code in URL');
          if (!cancelled) {
            setStatus('error');
            toast.error('خطأ في رابط المصادقة. يرجى المحاولة مرة أخرى.');
            setTimeout(() => (window.location.href = '/'), REDIRECT_DELAY_ERROR);
          }
          return;
        }

        console.log('✅ [AUTH CALLBACK] OAuth code found, exchanging...');
        
        // Step 3: Exchange code for session
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);
        
        if (error) {
          console.error('❌ [AUTH CALLBACK] Exchange failed:', error.message);
          if (!cancelled) {
            setStatus('error');
            toast.error('فشل تسجيل الدخول: ' + error.message);
            setTimeout(() => (window.location.href = '/'), REDIRECT_DELAY_ERROR);
          }
          return;
        }

        if (!data.session) {
          console.error('❌ [AUTH CALLBACK] No session in response');
          if (!cancelled) {
            setStatus('error');
            toast.error('تعذر إنشاء الجلسة');
            setTimeout(() => (window.location.href = '/'), REDIRECT_DELAY_ERROR);
          }
          return;
        }

        // Step 4: Success!
        console.log('✅ [AUTH CALLBACK] Session established');
        console.log('👤 [AUTH CALLBACK] User:', data.session.user.email);
        
        if (!cancelled) {
          const userName = data.session.user.user_metadata?.name || 
                          data.session.user.user_metadata?.full_name || 
                          data.session.user.email?.split('@')[0] || 
                          'المستخدم';
          
          setStatus('done');
          toast.success(`أهلاً بك، ${userName}!`, {
            description: 'تم تسجيل الدخول بنجاح عبر Google',
            duration: 3000
          });
          
          console.log('🚀 [AUTH CALLBACK] Redirecting to profile...');
          setTimeout(() => {
            window.location.href = '/profile';
          }, REDIRECT_DELAY_SUCCESS);
        }
      } catch (error: any) {
        console.error('❌ [AUTH CALLBACK] Fatal error:', error);
        if (!cancelled) {
          setStatus('error');
          toast.error('حدث خطأ غير متوقع');
          setTimeout(() => (window.location.href = '/'), REDIRECT_DELAY_ERROR);
        }
      }
    };

    exchangeCodeForSession();
    
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-4">
        {status === 'working' && (
          <>
            <div className="mx-auto h-12 w-12 border-3 border-procell-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-lg font-medium">جاري إكمال تسجيل الدخول...</p>
          </>
        )}
        {status === 'done' && (
          <>
            <div className="mx-auto h-12 w-12 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-lg font-medium text-green-600">تم تسجيل الدخول بنجاح!</p>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="mx-auto h-12 w-12 bg-red-500 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-lg font-medium text-red-600">حدث خطأ</p>
          </>
        )}
      </div>
    </main>
  );
}
