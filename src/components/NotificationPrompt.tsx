import { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

declare global {
  interface Window {
    OneSignal?: any;
  }
}

export function NotificationPrompt() {
  const [isVisible, setIsVisible] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    // Check if OneSignal is available and notification permission
    const checkNotificationStatus = async () => {
      if (window.OneSignal) {
        try {
          const isPushSupported = await window.OneSignal.Notifications.isPushSupported();
          const permission = await window.OneSignal.Notifications.permissionNative;
          
          if (isPushSupported && permission === 'default') {
            // Show prompt after 3 seconds if not yet asked
            setTimeout(() => setIsVisible(true), 3000);
          } else if (permission === 'granted') {
            setIsSubscribed(true);
          }
        } catch (error) {
          console.error('Error checking notification status:', error);
        }
      }
    };

    // Wait for OneSignal to initialize
    if (window.OneSignal) {
      checkNotificationStatus();
    } else {
      // Retry after a delay if OneSignal not loaded yet
      const timer = setTimeout(checkNotificationStatus, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAllow = async () => {
    try {
      if (window.OneSignal) {
        await window.OneSignal.Notifications.requestPermission();
        const permission = await window.OneSignal.Notifications.permissionNative;
        
        if (permission === 'granted') {
          setIsSubscribed(true);
          setIsVisible(false);
        }
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    // Don't show again for this session
    sessionStorage.setItem('notificationPromptDismissed', 'true');
  };

  // Don't show if already dismissed in this session or if subscribed
  if (!isVisible || isSubscribed || sessionStorage.getItem('notificationPromptDismissed')) {
    return null;
  }

  return (
    <>
      {/* Mobile overlay backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-[100] md:hidden"
        onClick={handleDismiss}
      />
      
      {/* Notification prompt card */}
      <Card className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-[101] p-6 shadow-2xl border-2 border-primary/20 bg-background animate-in slide-in-from-bottom-5 duration-300">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-8 w-8"
          onClick={handleDismiss}
        >
          <X className="h-4 w-4" />
        </Button>

        <div className="flex items-start gap-4 mb-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <Bell className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1">
              🔔 احصل على التنبيهات
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              لا تفوت العروض الحصرية والمنتجات الجديدة! سنرسل لك إشعارات فورية على جهازك.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            onClick={handleAllow}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-12"
          >
            <Bell className="ml-2 h-4 w-4" />
            السماح بالإشعارات
          </Button>
          <Button
            onClick={handleDismiss}
            variant="outline"
            className="flex-1 h-12"
          >
            ليس الآن
          </Button>
        </div>

        <p className="text-xs text-muted-foreground mt-3 text-center">
          يمكنك تغيير الإعدادات في أي وقت من إعدادات المتصفح
        </p>
      </Card>
    </>
  );
}
