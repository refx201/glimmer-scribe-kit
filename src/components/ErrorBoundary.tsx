import { Component, ReactNode, ErrorInfo } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { AlertTriangle, RefreshCw, Home, MessageCircle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // In production, you could send this to an error tracking service
    // Example: sendErrorToService(error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleContactSupport = () => {
    const message = encodeURIComponent(
      `مرحباً، واجهت مشكلة تقنية في الموقع. تفاصيل الخطأ: ${this.state.error?.message || 'خطأ غير معروف'}`
    );
    window.open(`https://wa.me/972598366822?text=${message}`, '_blank');
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl shadow-lg border-0">
            <CardHeader className="text-center bg-gradient-to-r from-red-50 to-orange-50 border-b">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <CardTitle className="text-2xl text-gray-900 mb-2">
                عذراً، حدث خطأ تقني
              </CardTitle>
              <p className="text-gray-600">
                واجهنا مشكلة تقنية غير متوقعة. نحن نعمل على حلها.
              </p>
            </CardHeader>
            
            <CardContent className="p-8">
              <div className="space-y-6">
                {/* Error message in development */}
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-semibold text-red-800 mb-2">تفاصيل الخطأ (للمطورين):</h4>
                    <pre className="text-sm text-red-700 overflow-auto whitespace-pre-wrap">
                      {this.state.error.message}
                    </pre>
                    {this.state.errorInfo && (
                      <details className="mt-2">
                        <summary className="cursor-pointer text-red-800 font-medium">Stack Trace</summary>
                        <pre className="text-xs text-red-600 mt-2 overflow-auto">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </details>
                    )}
                  </div>
                )}

                {/* User-friendly suggestions */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-3">ما يمكنك فعله:</h4>
                  <ul className="text-sm text-blue-700 space-y-2">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                      تحديث الصفحة والمحاولة مرة أخرى
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                      التأكد من اتصال الإنترنت
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                      مسح ذاكرة التخزين المؤقت للمتصفح
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                      التواصل مع الدعم الفني إذا استمرت المشكلة
                    </li>
                  </ul>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    onClick={this.handleReload}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <RefreshCw className="h-4 w-4 ml-2" />
                    تحديث الصفحة
                  </Button>
                  
                  <Button 
                    onClick={this.handleGoHome}
                    variant="outline"
                    className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    <Home className="h-4 w-4 ml-2" />
                    العودة للرئيسية
                  </Button>
                  
                  <Button 
                    onClick={this.handleContactSupport}
                    variant="outline"
                    className="flex-1 border-green-300 text-green-700 hover:bg-green-50"
                  >
                    <MessageCircle className="h-4 w-4 ml-2" />
                    تواصل معنا
                  </Button>
                </div>

                {/* Support info */}
                <div className="text-center text-sm text-gray-500 pt-6 border-t">
                  <p className="mb-2">
                    للمساعدة الفورية، تواصل معنا على واتساب: 
                    <span className="font-medium text-green-600 mr-1">0598-366-822</span>
                  </p>
                  <p className="text-xs">
                    نحن متاحون 24/7 لخدمتك - procell
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}