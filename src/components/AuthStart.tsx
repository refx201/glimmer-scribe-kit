import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

// Starts OAuth from the top window context to avoid iframe restrictions
export function AuthStart() {
  useEffect(() => {
    const start = async () => {
      try {
        const url = new URL(window.location.href);
        const provider = (url.searchParams.get('provider') || 'google') as 'google' | 'apple';
        const redirectUrl = `${window.location.origin}/auth/callback`;

        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: provider as any,
          options: {
            redirectTo: redirectUrl,
            skipBrowserRedirect: false,
            queryParams: provider === 'google' ? {
              access_type: 'offline',
              prompt: 'select_account',
            } : undefined,
          },
        });

        if (error) {
          console.error('[AUTH START] OAuth error:', error);
          toast.error('تعذر بدء تسجيل الدخول');
          setTimeout(() => {
            if (window.top) window.top.location.href = '/';
            else window.location.href = '/';
          }, 1200);
          return;
        }

        if (data?.url) {
          // Force redirect (some environments require manual redirect)
          if (window.top) window.top.location.href = data.url;
          else window.location.href = data.url;
        }
      } catch (e) {
        console.error('[AUTH START] Unexpected error:', e);
        toast.error('حدث خطأ غير متوقع');
        setTimeout(() => {
          if (window.top) window.top.location.href = '/';
          else window.location.href = '/';
        }, 1200);
      }
    };

    start();
  }, []);

  return (
    <main className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 border-2 border-procell-primary border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-muted-foreground">جاري تحويلك لبدء تسجيل الدخول...</p>
      </div>
    </main>
  );
}
