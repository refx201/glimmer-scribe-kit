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
    let authSubscription: any = null;

    const handleCallback = async () => {
      try {
        console.group('🔐 [AUTH CALLBACK] OAuth Callback Processing');
        console.log('⏰ Timestamp:', new Date().toISOString());
        console.log('🌐 Current URL:', window.location.href);
        console.log('📍 Pathname:', window.location.pathname);
        console.log('🔍 Search params:', window.location.search);
        console.log('🔗 Hash:', window.location.hash);
        
        // Parse URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');
        const errorDescription = urlParams.get('error_description');
        
        console.log('📦 URL Parameters:', {
          hasCode: !!code,
          codeLength: code?.length || 0,
          error,
          errorDescription
        });
        
        if (error) {
          console.error('❌ [AUTH CALLBACK] OAuth Error from Provider:', {
            error,
            description: errorDescription
          });
          setStatus('error');
          toast.error(`فشل تسجيل الدخول: ${errorDescription || error}`);
          setTimeout(() => navigate('/'), REDIRECT_DELAY_ERROR);
          console.groupEnd();
          return;
        }
        
        if (!code) {
          console.warn('⚠️ [AUTH CALLBACK] No authorization code in URL');
        }
        
        // Check current session before setting up listener
        console.log('🔎 Checking for existing session...');
        const { data: { session: existingSession }, error: sessionError } = await supabase.auth.getSession();
        console.log('📊 Existing session check:', {
          hasSession: !!existingSession,
          error: sessionError?.message,
          userId: existingSession?.user?.id,
          email: existingSession?.user?.email,
          provider: existingSession?.user?.app_metadata?.provider
        });
        
        if (existingSession) {
          console.log('✅ [AUTH CALLBACK] Session already exists, redirecting...');
          const userName = existingSession.user.user_metadata?.name || 
                          existingSession.user.user_metadata?.full_name || 
                          existingSession.user.email?.split('@')[0] || 
                          'المستخدم';
          
          setStatus('done');
          toast.success(`أهلاً بك، ${userName}!`, {
            description: 'تم تسجيل الدخول بنجاح',
            duration: 3000
          });
          console.groupEnd();
          setTimeout(() => navigate('/'), REDIRECT_DELAY_SUCCESS);
          return;
        }
        
        console.log('👂 [AUTH CALLBACK] Setting up auth state listener...');
        let listenerTriggered = false;
        
        // Listen for auth state changes - this will automatically handle the OAuth code exchange
        authSubscription = supabase.auth.onAuthStateChange(async (event, session) => {
          console.group('🔔 [AUTH CALLBACK] Auth State Change');
          console.log('⏰ Event timestamp:', new Date().toISOString());
          console.log('📢 Event type:', event);
          console.log('🔐 Session status:', session ? 'EXISTS' : 'NULL');
          
          if (session) {
            console.log('👤 User details:', {
              id: session.user.id,
              email: session.user.email,
              provider: session.user.app_metadata?.provider,
              created_at: session.user.created_at,
              metadata: session.user.user_metadata
            });
            console.log('🎫 Session details:', {
              access_token_length: session.access_token?.length || 0,
              refresh_token_length: session.refresh_token?.length || 0,
              expires_at: session.expires_at,
              expires_in: session.expires_in
            });
          }
          
          console.groupEnd();
          
          if (cancelled) {
            console.log('⏹️ [AUTH CALLBACK] Component unmounted, ignoring event');
            return;
          }
          
          if (listenerTriggered) {
            console.log('⏭️ [AUTH CALLBACK] Listener already processed, skipping');
            return;
          }
          
          if (event === 'SIGNED_IN' && session) {
            listenerTriggered = true;
            console.log('✅ [AUTH CALLBACK] Sign-in successful!');
            console.log('👤 [AUTH CALLBACK] User:', session.user.email);
            
            const userName = session.user.user_metadata?.name || 
                            session.user.user_metadata?.full_name || 
                            session.user.email?.split('@')[0] || 
                            'المستخدم';
            
            setStatus('done');
            toast.success(`أهلاً بك، ${userName}!`, {
              description: 'تم تسجيل الدخول بنجاح',
              duration: 3000
            });
            
            console.log('🚀 [AUTH CALLBACK] Redirecting to home in', REDIRECT_DELAY_SUCCESS, 'ms');
            console.groupEnd();
            setTimeout(() => {
              navigate('/');
            }, REDIRECT_DELAY_SUCCESS);
          } else if (event === 'INITIAL_SESSION' && !session) {
            console.log('⏳ [AUTH CALLBACK] No initial session, waiting 2s for code exchange...');
            
            // Give it a moment for the session to be established
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Try to get session again
            console.log('🔄 [AUTH CALLBACK] Retrying session check...');
            const { data: { session: retrySession }, error: retryError } = await supabase.auth.getSession();
            
            console.log('🔍 [AUTH CALLBACK] Retry result:', {
              hasSession: !!retrySession,
              error: retryError?.message,
              userId: retrySession?.user?.id
            });
            
            if (retryError || !retrySession) {
              listenerTriggered = true;
              console.error('❌ [AUTH CALLBACK] No session after retry');
              console.error('💥 [AUTH CALLBACK] Error details:', retryError);
              setStatus('error');
              toast.error('لم يتم العثور على جلسة. يرجى المحاولة مرة أخرى.');
              console.groupEnd();
              setTimeout(() => navigate('/'), REDIRECT_DELAY_ERROR);
            } else {
              console.log('✅ [AUTH CALLBACK] Session found on retry!');
            }
          }
        });
        
        console.log('✅ [AUTH CALLBACK] Auth listener setup complete');
        console.groupEnd();
        
      } catch (error: any) {
        console.group('❌ [AUTH CALLBACK] Fatal Error');
        console.error('💥 Error object:', error);
        console.error('📝 Error message:', error?.message);
        console.error('📚 Error stack:', error?.stack);
        console.groupEnd();
        
        if (!cancelled) {
          setStatus('error');
          toast.error('حدث خطأ غير متوقع');
          setTimeout(() => navigate('/'), REDIRECT_DELAY_ERROR);
        }
      }
    };

    handleCallback();
    
    return () => {
      console.log('🧹 [AUTH CALLBACK] Cleaning up...');
      cancelled = true;
      if (authSubscription) {
        authSubscription.data?.subscription?.unsubscribe();
      }
    };
  }, [navigate]);

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
