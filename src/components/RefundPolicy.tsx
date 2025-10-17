import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { RefreshCw, CreditCard, AlertTriangle, CheckCircle, Clock, FileText, Home } from 'lucide-react';
import { Footer } from '../components/Footer';
import { PageType } from '../App';

interface RefundPolicyProps {
  onNavigate: (page: PageType) => void;
}

export function RefundPolicy({ onNavigate }: RefundPolicyProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back to Home Button */}
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            العودة للرئيسية
          </Button>
        </div>
      {/* Header */}
      <div className="text-center mb-8">
        <Badge className="bg-procell-primary text-white px-4 py-2 mb-4">
          سياسة الإرجاع
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold text-procell-dark mb-4">
          سياسة الإرجاع واسترداد الأموال
        </h1>
        <p className="text-lg text-muted-foreground">
          نلتزم بضمان حقكم في استرداد الأموال وفقاً لشروط واضحة وعادلة
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          آخر تحديث: ديسمبر 2024
        </p>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Overview */}
        <Card className="border-procell-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-procell-primary">
              <RefreshCw className="h-5 w-5" />
              نظرة عامة
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              في Procell، نسعى لضمان رضاكم التام عن مشترياتكم. إذا لم تكونوا راضين عن منتج معين، فيمكنكم طلب إرجاعه واسترداد أموالكم وفقاً للشروط والأحكام الموضحة أدناه.
            </p>
          </CardContent>
        </Card>

        {/* Refund Timeline */}
        <Card className="border-procell-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-procell-primary">
              <Clock className="h-5 w-5" />
              المدة الزمنية للإرجاع
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gradient-to-b from-procell-primary/10 to-procell-primary/5 rounded-lg">
                <div className="text-2xl font-bold text-procell-primary mb-2">14 يوم</div>
                <div className="text-sm text-muted-foreground">الهواتف الذكية</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-b from-procell-secondary/10 to-procell-secondary/5 rounded-lg">
                <div className="text-2xl font-bold text-procell-secondary mb-2">7 أيام</div>
                <div className="text-sm text-muted-foreground">الإكسسوارات</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-b from-procell-accent/10 to-procell-accent/5 rounded-lg">
                <div className="text-2xl font-bold text-procell-accent mb-2">30 يوم</div>
                <div className="text-sm text-muted-foreground">العيوب التصنيعية</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-b from-gray-200 to-gray-100 rounded-lg">
                <div className="text-2xl font-bold text-gray-600 mb-2">∞</div>
                <div className="text-sm text-muted-foreground">مشاكل الضمان</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Refund Methods */}
        <Card className="border-procell-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-procell-primary">
              <CreditCard className="h-5 w-5" />
              طرق استرداد الأموال
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-procell-dark">الطرق المتاحة:</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <div className="font-medium text-green-900">بطاقة ائتمانية</div>
                      <div className="text-sm text-green-700">3-5 أيام عمل</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <CheckCircle className="h-5 w-5 text-blue-500" />
                    <div>
                      <div className="font-medium text-blue-900">تحويل بنكي</div>
                      <div className="text-sm text-blue-700">1-3 أيام عمل</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <CheckCircle className="h-5 w-5 text-purple-500" />
                    <div>
                      <div className="font-medium text-purple-900">رصيد المتجر</div>
                      <div className="text-sm text-purple-700">فوري</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <CheckCircle className="h-5 w-5 text-orange-500" />
                    <div>
                      <div className="font-medium text-orange-900">نقداً في المتجر</div>
                      <div className="text-sm text-orange-700">فوري عند الزيارة</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold text-procell-dark">شروط الاسترداد:</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    المنتج في حالته الأصلية
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    جميع الملحقات والتغليف
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    فاتورة الشراء الأصلية
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    عدم وجود أضرار مستخدم
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    عدم انتهاء فترة الإرجاع
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Refund Process */}
        <Card className="border-procell-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-procell-primary">
              <FileText className="h-5 w-5" />
              خطوات عملية الإرجاع واسترداد الأموال
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4 p-4 bg-gradient-to-r from-procell-primary/5 to-procell-secondary/5 rounded-lg">
                <div className="bg-procell-primary text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">1</div>
                <div>
                  <h4 className="font-semibold text-procell-dark mb-1">طلب الإرجاع</h4>
                  <p className="text-muted-foreground text-sm">تواصل معنا عبر الهاتف أو البريد الإلكتروني أو زيارة المتجر</p>
                </div>
              </div>
              
              <div className="flex gap-4 p-4 bg-gradient-to-r from-procell-secondary/5 to-procell-accent/5 rounded-lg">
                <div className="bg-procell-secondary text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">2</div>
                <div>
                  <h4 className="font-semibold text-procell-dark mb-1">تقييم المنتج</h4>
                  <p className="text-muted-foreground text-sm">فحص المنتج للتأكد من أهليته للإرجاع وحالته العامة</p>
                </div>
              </div>
              
              <div className="flex gap-4 p-4 bg-gradient-to-r from-procell-accent/5 to-procell-primary/5 rounded-lg">
                <div className="bg-procell-accent text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">3</div>
                <div>
                  <h4 className="font-semibold text-procell-dark mb-1">الموافقة والاسترداد</h4>
                  <p className="text-muted-foreground text-sm">بعد الموافقة، نقوم بمعالجة الاسترداد حسب الطريقة المفضلة لديكم</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Partial Refunds */}
        <Card className="border-procell-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-procell-primary">
              <CreditCard className="h-5 w-5" />
              الاسترداد الجزئي
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              في بعض الحالات، قد نقوم بتطبيق استرداد جزئي للأموال:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-semibold text-procell-dark">حالات الاسترداد الجزئي:</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• منتجات مستعملة بشكل واضح</li>
                  <li>• نقص في الملحقات أو التغليف</li>
                  <li>• خدوش أو أضرار طفيفة</li>
                  <li>• تأخير في طلب الإرجاع</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-procell-dark">نسب الخصم المطبقة:</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• 5-10% للاستخدام الطفيف</li>
                  <li>• 10-25% للأضرار الطفيفة</li>
                  <li>• 25-50% للأضرار المتوسطة</li>
                  <li>• رفض الإرجاع للأضرار الجسيمة</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Exceptions */}
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-700">
              <AlertTriangle className="h-5 w-5" />
              حالات عدم الاسترداد
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-yellow-700">
            <p className="font-medium">المنتجات التالية غير مؤهلة لاسترداد الأموال:</p>
            <ul className="space-y-2">
              <li>• منتجات مخصصة أو معدلة حسب الطلب</li>
              <li>• بطاقات الهدايا وبطاقات الشحن الرقمية</li>
              <li>• البرامج المحملة أو المفعلة</li>
              <li>• منتجات تالفة بسبب سوء الاستخدام</li>
              <li>• منتجات خارج فترة الإرجاع المحددة</li>
              <li>• منتجات مشتراة بعروض خاصة (ما لم ينص على خلاف ذلك)</li>
            </ul>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card className="border-procell-primary/20 bg-gradient-to-r from-procell-primary/5 to-procell-secondary/5">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold text-procell-dark mb-2">تحتاج مساعدة في الإرجاع؟</h3>
            <p className="text-muted-foreground mb-4">
              فريق خدمة العملاء متاح لمساعدتكم في عملية الإرجاع واسترداد الأموال
            </p>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium">الهاتف:</span><br />
                <span className="text-procell-primary">02-234-5678</span>
              </div>
              <div>
                <span className="font-medium">البريد الإلكتروني:</span><br />
                <span className="text-procell-primary">refunds@procell.ps</span>
              </div>
              <div>
                <span className="font-medium">ساعات العمل:</span><br />
                <span className="text-muted-foreground">الأحد - الخميس: 9ص - 6م</span>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
      
      {/* Footer */}
      <Footer onNavigate={onNavigate} />
    </div>
  );
}

export default RefundPolicy;