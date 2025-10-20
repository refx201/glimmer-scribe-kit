import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const REDIRECT_DELAY_SUCCESS = 1200;
const REDIRECT_DELAY_ERROR = 2000;

export function AuthCallback() {
  const [status, setStatus] = useState<'working' | 'done' | 'error'>('working');
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    let timeoutId: NodeJS.Timeout;

    const handleCallback = async () => {
      try {
        console.log('🔄 [AUTH CALLBACK] Starting OAuth callback processing...');

        // USE THE INITIALLY CAPTURED PARAMS FROM index.html
        const initialParams = (window as any).__INITIAL_OAUTH_PARAMS__;
        
        if (!initialParams) {
          console.error('❌ [AUTH CALLBACK] No initial params captured');
          setStatus('error');
          toast.error('فشل في تحليل بيانات المصادقة');
          timeoutId = setTimeout(() => navigate('/login', { replace: true }), REDIRECT_DELAY_ERROR);
          return;
        }

        console.log('📜 [AUTH CALLBACK] Using initially captured params:', {
          href: initialParams.href,
          hash: initialParams.hash ? '***' : 'empty',
          search: initialParams.search
        });

        // Parse parameters from the INITIALLY CAPTURED URL
        const initialUrl = new URL(initialParams.href);
        const initialSearchParams = new URLSearchParams(initialUrl.search);
        const initialHashParams = new URLSearchParams(initialUrl.hash.substring(1));

        console.log('🔍 [AUTH CALLBACK] Initial parameter analysis:', {
          searchParams: Object.fromEntries(initialSearchParams.entries()),
          hashParams: Object.fromEntries(initialHashParams.entries())
        });

        // Check for OAuth parameters in the INITIAL capture
        const hasAccessToken = initialHashParams.has('access_token');
        const hasRefreshToken = initialHashParams.has('refresh_token');
        const hasCode = initialSearchParams.has('code');
        const hasError = initialSearchParams.has('error') || initialHashParams.has('error');

        console.log('🎯 [AUTH CALLBACK] Initial OAuth parameter check:', {
          hasAccessToken,
          hasRefreshToken, 
          hasCode,
          hasError,
          tokenType: initialHashParams.get('token_type'),
          expiresIn: initialHashParams.get('expires_in')
        });

        if (hasError) {
          const errorDesc = initialSearchParams.get('error_description') || initialHashParams.get('error_description');
          console.error('❌ [AUTH CALLBACK] OAuth error in initial params:', errorDesc);
          setStatus('error');
          toast.error(`خطأ في المصادقة: ${errorDesc || 'حدث خطأ غير معروف'}`);
          timeoutId = setTimeout(() => navigate('/login', { replace: true }), REDIRECT_DELAY_ERROR);
          return;
        }

        // SUCCESS CASE: We have tokens in the initial hash
        if (hasAccessToken && hasRefreshToken) {
          console.log('✅ [AUTH CALLBACK] OAuth tokens found in INITIAL hash');
          
          // Manually set the session using the tokens from initial capture
          const accessToken = initialHashParams.get('access_token');
          const refreshToken = initialHashParams.get('refresh_token');
          
          if (accessToken && refreshToken) {
            console.log('🔑 [AUTH CALLBACK] Setting session with captured tokens');
            
            // Set the session manually
            const { data: { session }, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken
            });

            if (error) {
              console.error('❌ [AUTH CALLBACK] Manual session setting error:', error);
              setStatus('error');
              toast.error('فشل في إنشاء الجلسة');
              timeoutId = setTimeout(() => navigate('/login', { replace: true }), REDIRECT_DELAY_ERROR);
              return;
            }

            if (session) {
              console.log('✅ [AUTH CALLBACK] Session established manually:', session.user.email);
              setStatus('done');
              toast.success('تم تسجيل الدخول بنجاح!');
              
              // Clear the initial params to avoid reuse
              (window as any).__INITIAL_OAUTH_PARAMS__ = null;
              
              timeoutId = setTimeout(() => navigate('/', { replace: true }), REDIRECT_DELAY_SUCCESS);
            } else {
              throw new Error('No session after manual token setting');
            }
          }
        }
        // Wait for auth state change as fallback
        else {
          console.log('⏳ [AUTH CALLBACK] Waiting for auth state change...');
          
          const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
              if (cancelled) return;
              
              console.log('🔄 [AUTH CALLBACK] Auth state change:', event);
              
              if (event === 'SIGNED_IN' && session) {
                console.log('✅ [AUTH CALLBACK] User signed in via OAuth:', session.user.email);
                setStatus('done');
                toast.success('تم تسجيل الدخول بنجاح!');
                
                // Clear the initial params
                (window as any).__INITIAL_OAUTH_PARAMS__ = null;
                
                if (timeoutId) clearTimeout(timeoutId);
                timeoutId = setTimeout(() => navigate('/', { replace: true }), REDIRECT_DELAY_SUCCESS);
                
                subscription.unsubscribe();
              }
            }
          );

          // Fallback timeout
          timeoutId = setTimeout(() => {
            if (cancelled) return;
            console.log('❌ [AUTH CALLBACK] Timeout waiting for session');
            setStatus('error');
            toast.error('انتهت مهلة تسجيل الدخول');
            subscription.unsubscribe();
            navigate('/login', { replace: true });
          }, 5000);
        }

      } catch (error) {
        console.error('❌ [AUTH CALLBACK] Critical error:', error);
        if (!cancelled) {
          setStatus('error');
          toast.error('حدث خطأ غير متوقع في تسجيل الدخول');
          timeoutId = setTimeout(() => navigate('/login', { replace: true }), REDIRECT_DELAY_ERROR);
        }
      }
    };

    handleCallback();

    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [navigate]);

  return (
    <main className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-4">
        {status === 'working' && (
          <>
            <div className="mx-auto h-12 w-12 border-3 border-procell-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-lg font-medium">جاري إكمال تسجيل الدخول...</p>
            <p className="text-sm text-gray-500">يتم الآن معالجة بيانات المصادقة</p>
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
            <p className="text-lg font-medium text-red-600">حدث خطأ في تسجيل الدخول</p>
          </>
        )}
      </div>
    </main>
  );
}