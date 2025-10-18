import { Button } from './ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function GoogleAuthButton() {
  const handleGoogleSignIn = async () => {
    try {
      // Get current path for redirect after auth
      const currentPath = window.location.pathname;
      const redirectPath = currentPath === '/login' || currentPath === '/signup' ? '/' : currentPath;
      
      // Determine the correct redirect URL
      const host = window.location.hostname;
      const isProdDomain = host === 'procell.app' || host === 'www.procell.app';
      const redirectBase = isProdDomain ? 'https://procell.app' : window.location.origin;
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${redirectBase}${redirectPath}`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        console.error('Google sign in error:', error);
        
        // Check for domain restriction error
        if (error.message?.includes('Can only be used on')) {
          toast.error('تسجيل Google يعمل فقط على النطاق procell.app');
        } else {
          toast.error('فشل تسجيل الدخول عبر Google');
        }
      }
    } catch (error: any) {
      console.error('Google sign in error:', error);
      toast.error('حدثت مشكلة في تسجيل الدخول عبر Google');
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleGoogleSignIn}
      className="w-12 h-12 rounded-full p-0 flex items-center justify-center hover:bg-blue-50 border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 shadow-md hover:shadow-lg"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
    </Button>
  );
}
