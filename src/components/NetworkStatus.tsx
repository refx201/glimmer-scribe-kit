import { useState, useEffect } from 'react';
import { Wifi, WifiOff, Server, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

interface NetworkStatusProps {
  showServerStatus?: boolean;
}

export function NetworkStatus({ showServerStatus = true }: NetworkStatusProps) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [serverStatus, setServerStatus] = useState<'unknown' | 'online' | 'offline'>('unknown');
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowAlert(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowAlert(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Check server status
  useEffect(() => {
    if (!showServerStatus) return;

    const checkServerStatus = async () => {
      try {
        const response = await fetch('http://localhost:3001/health', {
          method: 'GET',
          signal: AbortSignal.timeout(5000) // 5 second timeout
        });
        
        if (response.ok) {
          setServerStatus('online');
          if (showAlert && isOnline) {
            setShowAlert(false);
          }
        } else {
          setServerStatus('offline');
          if (isOnline) {
            setShowAlert(true);
          }
        }
      } catch (error) {
        setServerStatus('offline');
        if (isOnline) {
          setShowAlert(true);
        }
      }
    };

    // Check immediately
    checkServerStatus();

    // Check every 30 seconds
    const interval = setInterval(checkServerStatus, 30000);

    return () => clearInterval(interval);
  }, [showServerStatus, isOnline, showAlert]);

  // Auto-hide alert after 10 seconds
  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  return null; // Temporarily disabled

  const getAlertContent = () => {
    if (!isOnline) {
      return {
        icon: <WifiOff className="h-4 w-4" />,
        title: 'لا يوجد اتصال بالإنترنت',
        description: 'يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.',
        variant: 'destructive' as const
      };
    }

    if (serverStatus === 'offline') {
      return {
        icon: <Server className="h-4 w-4" />,
        title: 'الخادم غير متاح',
        description: (
          <div className="space-y-2 text-sm">
            <p>لا يمكن الاتصال بخادم procell.</p>
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <p className="font-semibold text-blue-800 mb-1">للمطورين:</p>
              <ol className="list-decimal list-inside text-blue-700 space-y-1">
                <li>تأكد من تشغيل الخادم: <code className="bg-blue-100 px-1 rounded">cd server && npm run dev</code></li>
                <li>تحقق من الرابط: <a href="http://localhost:3001/health" target="_blank" rel="noopener noreferrer" className="underline">http://localhost:3001/health</a></li>
                <li>راجع ملف <code className="bg-blue-100 px-1 rounded">START_SERVER.md</code> للتعليمات الكاملة</li>
              </ol>
            </div>
          </div>
        ),
        variant: 'default' as const
      };
    }

    return null;
  };

  const alertContent = getAlertContent();
  if (!alertContent) return null;

  return (
    <Alert variant={alertContent.variant} className="fixed top-4 left-4 right-4 z-[100] max-w-md mx-auto shadow-lg border-2">
      <div className="flex items-start gap-3">
        {alertContent.icon}
        <div className="flex-1">
          <h4 className="font-semibold mb-1">{alertContent.title}</h4>
          <AlertDescription className="text-sm">
            {alertContent.description}
          </AlertDescription>
        </div>
        <button
          onClick={() => setShowAlert(false)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="إغلاق التنبيه"
        >
          <AlertCircle className="h-4 w-4" />
        </button>
      </div>
    </Alert>
  );
}

// Server status indicator for development - DISABLED
export function ServerStatusIndicator() {
  return null;
}