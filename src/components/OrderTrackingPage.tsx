import { useState, useEffect, memo } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  Package, 
  Search, 
  CheckCircle, 
  Clock, 
  Truck, 
  MapPin, 
  Phone, 
  Calendar,
  User,
  CreditCard,
  ShoppingBag,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  Star,
  Copy,
  Share2,
  MessageCircle,
  Navigation
} from 'lucide-react';

// Sample order data - في التطبيق الحقيقي سيأتي من قاعدة البيانات
const SAMPLE_ORDERS = {
  'ORD-2024-001': {
    orderId: 'ORD-2024-001',
    customerName: 'أحمد محمد',
    customerPhone: '0598366822',
    orderDate: '2024-01-15T10:30:00Z',
    totalAmount: 3999,
    paymentMethod: 'فيزا',
    deliveryAddress: 'رام الله - المنارة - شارع النصر - بناية الأمل - الطابق الثالث',
    estimatedDelivery: '2024-01-17T15:00:00Z',
    currentStatus: 'in_transit',
    items: [
      {
        id: 1,
        name: 'iPhone 15 Pro Max - 256GB',
        color: 'تيتانيوم طبيعي',
        price: 3999,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1592286049617-3feb4da2681e?w=100&h=100&fit=crop'
      }
    ],
    trackingHistory: [
      {
        status: 'order_placed',
        title: 'تم تأكيد الطلب',
        description: 'تم استلام طلبك وتأكيده بنجاح',
        timestamp: '2024-01-15T10:30:00Z',
        completed: true
      },
      {
        status: 'payment_confirmed',
        title: 'تم تأكيد الدفع',
        description: 'تم تأكيد عملية الدفع بنجاح',
        timestamp: '2024-01-15T11:15:00Z',
        completed: true
      },
      {
        status: 'preparing',
        title: 'جاري التحضير',
        description: 'يتم تحضير طلبك في المستودع',
        timestamp: '2024-01-15T14:00:00Z',
        completed: true
      },
      {
        status: 'in_transit',
        title: 'في الطريق إليك',
        description: 'طلبك في طريقه للتسليم - الوصول المتوقع خلال 2-4 ساعات',
        timestamp: '2024-01-16T09:00:00Z',
        completed: true,
        active: true,
        driverName: 'محمد أبو علي',
        driverPhone: '0598765432',
        estimatedArrival: '2024-01-16T15:30:00Z'
      },
      {
        status: 'delivered',
        title: 'تم التسليم',
        description: 'تم تسليم طلبك بنجاح',
        timestamp: null,
        completed: false
      }
    ]
  },
  'ORD-2024-002': {
    orderId: 'ORD-2024-002',
    customerName: 'فاطمة خالد',
    customerPhone: '0597654321',
    orderDate: '2024-01-14T16:45:00Z',
    totalAmount: 1299,
    paymentMethod: 'تحويل بنكي',
    deliveryAddress: 'نابلس - رفيديا - شارع سفيان - بناية النور - شقة 12',
    estimatedDelivery: '2024-01-16T12:00:00Z',
    currentStatus: 'delivered',
    items: [
      {
        id: 2,
        name: 'AirPods Pro - الجيل الثاني',
        color: 'أبيض',
        price: 999,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=100&h=100&fit=crop'
      },
      {
        id: 3,
        name: 'شاحن لاسلكي سريع',
        color: 'أسود',
        price: 300,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1609792858446-86356ae75eb5?w=100&h=100&fit=crop'
      }
    ],
    trackingHistory: [
      {
        status: 'order_placed',
        title: 'تم تأكيد الطلب',
        description: 'تم استلام طلبك وتأكيده بنجاح',
        timestamp: '2024-01-14T16:45:00Z',
        completed: true
      },
      {
        status: 'payment_confirmed',
        title: 'تم تأكيد الدفع',
        description: 'تم تأكيد عملية الدفع بالتحويل البنكي',
        timestamp: '2024-01-15T08:30:00Z',
        completed: true
      },
      {
        status: 'preparing',
        title: 'تم التحضير',
        description: 'تم تحضير طلبك وجاهز للشحن',
        timestamp: '2024-01-15T12:00:00Z',
        completed: true
      },
      {
        status: 'in_transit',
        title: 'تم الشحن',
        description: 'طلبك في طريقه للتسليم',
        timestamp: '2024-01-15T15:30:00Z',
        completed: true
      },
      {
        status: 'delivered',
        title: 'تم التسليم',
        description: 'تم تسليم طلبك بنجاح للعميلة فاطمة خالد',
        timestamp: '2024-01-16T11:45:00Z',
        completed: true,
        active: true,
        deliveredTo: 'فاطمة خالد',
        rating: 5
      }
    ]
  }
};

const STATUS_CONFIG = {
  order_placed: {
    icon: ShoppingBag,
    color: 'bg-blue-500',
    textColor: 'text-blue-700',
    bgColor: 'bg-blue-50'
  },
  payment_confirmed: {
    icon: CreditCard,
    color: 'bg-green-500',
    textColor: 'text-green-700',
    bgColor: 'bg-green-50'
  },
  preparing: {
    icon: Package,
    color: 'bg-orange-500',
    textColor: 'text-orange-700',
    bgColor: 'bg-orange-50'
  },
  in_transit: {
    icon: Truck,
    color: 'bg-purple-500',
    textColor: 'text-purple-700',
    bgColor: 'bg-purple-50'
  },
  delivered: {
    icon: CheckCircle,
    color: 'bg-green-600',
    textColor: 'text-green-700',
    bgColor: 'bg-green-50'
  }
};

const OrderTrackingPage = memo(() => {
  const [orderNumber, setOrderNumber] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const handleSearch = async () => {
    if (!orderNumber.trim()) {
      setError('الرجاء إدخال رقم الطلبية');
      return;
    }

    setIsLoading(true);
    setError('');

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const order = SAMPLE_ORDERS[orderNumber.toUpperCase() as keyof typeof SAMPLE_ORDERS];
      
      if (order) {
        setSearchedOrder(order);
        setError('');
      } else {
        setSearchedOrder(null);
        setError('لم يتم العثور على الطلبية. تأكد من رقم الطلبية وحاول مرة أخرى.');
      }
    } catch (err) {
      setError('حدث خطأ أثناء البحث. الرجاء المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-PS', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEstimatedTime = (estimatedArrival: string) => {
    const arrival = new Date(estimatedArrival);
    const now = currentTime;
    const diff = arrival.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diff <= 0) return 'متوقع الوصول قريباً';
    if (hours <= 0) return `متوقع الوصول خلال ${minutes} دقيقة`;
    return `متوقع الوصول خلال ${hours} ساعة و ${minutes} دقيقة`;
  };

  const copyOrderNumber = () => {
    navigator.clipboard.writeText(searchedOrder.orderId);
    // Could add toast notification here
  };

  const shareOrder = () => {
    const text = `تتبع طلبيتي من ProCell: ${searchedOrder.orderId}`;
    const url = `${window.location.origin}${window.location.pathname}?order=${searchedOrder.orderId}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'تتبع الطلبية - ProCell',
        text,
        url
      });
    } else {
      navigator.clipboard.writeText(`${text}\n${url}`);
    }
  };

  const contactSupport = () => {
    const message = encodeURIComponent(`مرحباً، أحتاج مساعدة بخصوص الطلبية رقم: ${searchedOrder.orderId}`);
    window.open(`https://wa.me/972598366822?text=${message}`, '_blank');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-white pt-20 md:pt-24">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Package className="h-4 w-4 ml-1" />
            تتبع الطلبات
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-procell-dark mb-4">
            🚚 تتبع طلبيتك
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            أدخل رقم الطلبية لمعرفة آخر تحديثات شحن ووصول طلبك
          </p>
        </div>

        {/* Search Section */}
        <Card className="max-w-2xl mx-auto mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="أدخل رقم الطلبية (مثال: ORD-2024-001)"
                  className="text-lg py-3 px-4"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Button
                onClick={handleSearch}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold"
              >
                {isLoading ? (
                  <RefreshCw className="h-5 w-5 ml-2 animate-spin" />
                ) : (
                  <Search className="h-5 w-5 ml-2" />
                )}
                {isLoading ? 'جاري البحث...' : 'تتبع الطلبية'}
              </Button>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 ml-2" />
                <span className="text-red-700">{error}</span>
              </div>
            )}

            {/* Quick Access Sample Orders */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700 mb-2 font-medium">أرقام طلبيات تجريبية للاختبار:</p>
              <div className="flex flex-wrap gap-2">
                {Object.keys(SAMPLE_ORDERS).map((orderId) => (
                  <Button
                    key={orderId}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setOrderNumber(orderId);
                      setSearchedOrder(SAMPLE_ORDERS[orderId as keyof typeof SAMPLE_ORDERS]);
                      setError('');
                    }}
                    className="text-xs"
                  >
                    {orderId}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Details */}
        {searchedOrder && (
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Order Summary */}
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div>
                    <CardTitle className="text-xl mb-2">معلومات الطلبية</CardTitle>
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-mono">#{searchedOrder.orderId}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={copyOrderNumber}
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        <Copy className="h-3 w-3 ml-1" />
                        نسخ
                      </Button>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4 md:mt-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={shareOrder}
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      <Share2 className="h-4 w-4 ml-1" />
                      مشاركة
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={contactSupport}
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      <MessageCircle className="h-4 w-4 ml-1" />
                      دعم
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Customer Info */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <User className="h-5 w-5 ml-2 text-blue-600" />
                      معلومات العميل
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">الاسم:</span> {searchedOrder.customerName}</p>
                      <p><span className="font-medium">الهاتف:</span> {searchedOrder.customerPhone}</p>
                    </div>
                  </div>

                  {/* Order Info */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <Calendar className="h-5 w-5 ml-2 text-blue-600" />
                      تفاصيل الطلب
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">تاريخ الطلب:</span> {formatDate(searchedOrder.orderDate)}</p>
                      <p><span className="font-medium">طريقة الدفع:</span> {searchedOrder.paymentMethod}</p>
                      <p><span className="font-medium">إجمالي المبلغ:</span> {searchedOrder.totalAmount.toLocaleString()} ₪</p>
                    </div>
                  </div>

                  {/* Delivery Info */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <MapPin className="h-5 w-5 ml-2 text-blue-600" />
                      عنوان التسليم
                    </h3>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {searchedOrder.deliveryAddress}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tracking Timeline */}
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900 flex items-center">
                  <Navigation className="h-6 w-6 ml-2 text-blue-600" />
                  مراحل تتبع الطلبية
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-6">
                <div className="space-y-6">
                  {searchedOrder.trackingHistory.map((step: any, index: number) => {
                    const StatusIcon = STATUS_CONFIG[step.status as keyof typeof STATUS_CONFIG]?.icon || Package;
                    const isLast = index === searchedOrder.trackingHistory.length - 1;
                    
                    return (
                      <div key={index} className="relative">
                        {/* Timeline Line */}
                        {!isLast && (
                          <div className={`absolute right-6 top-12 w-0.5 h-16 ${step.completed ? 'bg-green-400' : 'bg-gray-200'}`} />
                        )}
                        
                        <div className={`flex items-start gap-4 p-4 rounded-xl transition-all duration-300 ${
                          step.active ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200' : 
                          step.completed ? STATUS_CONFIG[step.status as keyof typeof STATUS_CONFIG]?.bgColor : 'bg-gray-50'
                        }`}>
                          {/* Status Icon */}
                          <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                            step.completed ? STATUS_CONFIG[step.status as keyof typeof STATUS_CONFIG]?.color : 'bg-gray-300'
                          } ${step.active ? 'animate-pulse' : ''}`}>
                            <StatusIcon className="h-6 w-6 text-white" />
                          </div>

                          {/* Content */}
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className={`font-semibold text-lg ${
                                step.completed ? STATUS_CONFIG[step.status as keyof typeof STATUS_CONFIG]?.textColor : 'text-gray-500'
                              }`}>
                                {step.title}
                              </h3>
                              {step.completed && step.timestamp && (
                                <Badge variant="outline" className="text-xs">
                                  {formatDate(step.timestamp)}
                                </Badge>
                              )}
                            </div>
                            
                            <p className="text-gray-600 mb-3">{step.description}</p>
                            
                            {/* Special content for active step */}
                            {step.active && step.status === 'in_transit' && (
                              <div className="bg-blue-100 rounded-lg p-4 mt-3">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-semibold text-blue-800 mb-2">معلومات السائق</h4>
                                    <p className="text-sm text-blue-700">📞 {step.driverName}</p>
                                    <p className="text-sm text-blue-700">📱 {step.driverPhone}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-blue-800 mb-2">وقت الوصول المتوقع</h4>
                                    <p className="text-sm text-blue-700 font-medium">
                                      {getEstimatedTime(step.estimatedArrival)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            {/* Special content for delivered step */}
                            {step.active && step.status === 'delivered' && step.rating && (
                              <div className="bg-green-100 rounded-lg p-4 mt-3">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h4 className="font-semibold text-green-800 mb-1">تم التسليم إلى: {step.deliveredTo}</h4>
                                    <div className="flex items-center gap-1">
                                      <span className="text-sm text-green-700">تقييم التسليم:</span>
                                      {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`h-4 w-4 ${i < step.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                                      ))}
                                    </div>
                                  </div>
                                  <CheckCircle className="h-8 w-8 text-green-600" />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900 flex items-center">
                  <ShoppingBag className="h-6 w-6 ml-2 text-blue-600" />
                  محتويات الطلبية ({searchedOrder.items.length} منتج)
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-6">
                <div className="space-y-4">
                  {searchedOrder.items.map((item: any, index: number) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-600">اللون: {item.color}</p>
                        <p className="text-sm text-gray-600">الكمية: {item.quantity}</p>
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-lg text-blue-600">{item.price.toLocaleString()} ₪</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Separator className="my-4" />
                
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">الإجمالي:</span>
                  <span className="text-2xl font-bold text-blue-600">{searchedOrder.totalAmount.toLocaleString()} ₪</span>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={contactSupport}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 font-semibold"
              >
                <MessageCircle className="h-5 w-5 ml-2" />
                تواصل مع خدمة العملاء
              </Button>
              
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 font-semibold"
              >
                <RefreshCw className="h-5 w-5 ml-2" />
                تحديث الحالة
              </Button>
            </div>
          </div>
        )}

        {/* Help Section */}
        {!searchedOrder && (
          <Card className="max-w-4xl mx-auto bg-gradient-to-br from-blue-50 to-purple-50 border-0">
            <CardContent className="p-8 text-center">
              <Package className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">كيفية تتبع طلبيتك</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div className="text-center">
                  <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 font-bold">1</div>
                  <h3 className="font-semibold mb-2">أدخل رقم الطلبية</h3>
                  <p className="text-gray-600">ستجد رقم طلبيتك في رسالة التأكيد المرسلة عبر SMS أو WhatsApp</p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 font-bold">2</div>
                  <h3 className="font-semibold mb-2">تابع الحالة</h3>
                  <p className="text-gray-600">ستظهر لك جميع مراحل معالجة وشحن طلبيتك بالتفصيل</p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 font-bold">3</div>
                  <h3 className="font-semibold mb-2">استلم طلبيتك</h3>
                  <p className="text-gray-600">سيتم إشعارك عند وصول طلبيتك وتسليمها في الموعد المحدد</p>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div className="text-center">
                <h3 className="font-semibold text-gray-900 mb-3">تحتاج مساعدة؟</h3>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => window.open('https://wa.me/972598366822', '_blank')}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <MessageCircle className="h-4 w-4 ml-2" />
                    واتساب: 0598-366-822
                  </Button>
                  <Button
                    onClick={() => window.open('tel:0598366822', '_blank')}
                    variant="outline"
                    className="border-blue-600 text-blue-600 hover:bg-blue-50"
                  >
                    <Phone className="h-4 w-4 ml-2" />
                    اتصال: 0599-123-456
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
});

OrderTrackingPage.displayName = 'OrderTrackingPage';

export { OrderTrackingPage };