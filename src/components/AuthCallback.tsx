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

    const handleCallback = async () => {
      try {
        console.log('🔐 [AUTH CALLBACK] Processing OAuth callback...');
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ [AUTH CALLBACK] Session error:', error);
          if (!cancelled) {
            setStatus('error');
            toast.error('فشل تسجيل الدخول');
            setTimeout(() => navigate('/'), REDIRECT_DELAY_ERROR);
          }
          return;
        }

        if (!session) {
          console.error('❌ [AUTH CALLBACK] No session found');
          if (!cancelled) {
            setStatus('error');
            toast.error('لم يتم العثور على جلسة');
            setTimeout(() => navigate('/'), REDIRECT_DELAY_ERROR);
          }
          return;
        }

        console.log('✅ [AUTH CALLBACK] Session established');
        console.log('👤 [AUTH CALLBACK] User:', session.user.email);
        
        if (!cancelled) {
          const userName = session.user.user_metadata?.name || 
                          session.user.user_metadata?.full_name || 
                          session.user.email?.split('@')[0] || 
                          'المستخدم';
          
          setStatus('done');
          toast.success(`أهلاً بك، ${userName}!`, {
            description: 'تم تسجيل الدخول بنجاح',
            duration: 3000
          });
          
          setTimeout(() => navigate('/profile'), REDIRECT_DELAY_SUCCESS);
        }
      } catch (error: any) {
        console.error('❌ [AUTH CALLBACK] Fatal error:', error);
        if (!cancelled) {
          setStatus('error');
          toast.error('حدث خطأ غير متوقع');
          setTimeout(() => navigate('/'), REDIRECT_DELAY_ERROR);
        }
      }
    };

    handleCallback();
    
    return () => {
      cancelled = true;
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
