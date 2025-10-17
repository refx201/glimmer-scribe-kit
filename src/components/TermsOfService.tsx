import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { FileText, Users, ShieldCheck, Scale, AlertTriangle, Clock, Phone, Mail, Home } from 'lucide-react';
import { Footer } from '../components/Footer';
import { PageType } from '../App';

interface TermsOfServiceProps {
  onNavigate: (page: PageType) => void;
}

export function TermsOfService({ onNavigate }: TermsOfServiceProps) {
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
            شروط الخدمة
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-procell-dark mb-4">
            شروط وأحكام الخدمة
          </h1>
          <p className="text-lg text-muted-foreground">
            قواعد وشروط استخدام منصة procell وخدماتها
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            آخر تحديث: ديسمبر 2024
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Introduction */}
          <Card className="border-procell-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-procell-primary">
                <FileText className="h-5 w-5" />
                مقدمة
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                مرحباً بكم في منصة procell. هذه الشروط والأحكام تحكم استخدامكم لموقعنا الإلكتروني وخدماتنا. باستخدام موقعنا أو شراء منتجاتنا، فإنكم توافقون على الالتزام بهذه الشروط.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                يُرجى قراءة هذه الشروط بعناية قبل استخدام خدماتنا. إذا كنتم لا توافقون على أي جزء من هذه الشروط، فلا يجوز لكم استخدام خدماتنا.
              </p>
            </CardContent>
          </Card>

          {/* Company Information */}
          <Card className="border-procell-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-procell-primary">
                <Users className="h-5 w-5" />
                معلومات الشركة
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-procell-dark mb-3">بيانات الشركة:</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li><strong>اسم الشركة:</strong> procell</li>
                    <li><strong>نوع النشاط:</strong> تجارة الهواتف والإلكترونيات</li>
                    <li><strong>الموقع:</strong> فلسطين - الضفة الغربية</li>
                    <li><strong>رقم التسجيل:</strong> PC-2024-001</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-procell-dark mb-3">معلومات التواصل:</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li><strong>الهاتف:</strong> +972-598-366-822</li>
                    <li><strong>البريد الإلكتروني:</strong> info@procell.ps</li>
                    <li><strong>موقع الويب:</strong> www.procell.app</li>
                    <li><strong>ساعات العمل:</strong> الأحد - الخميس: 9ص - 6م</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Service Terms */}
          <Card className="border-procell-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-procell-primary">
                <ShieldCheck className="h-5 w-5" />
                شروط الخدمة
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-procell-dark">1. القبول والموافقة:</h4>
                <ul className="space-y-2 text-muted-foreground pr-4">
                  <li>• باستخدام خدماتنا، تؤكدون موافقتكم على جميع الشروط والأحكام</li>
                  <li>• يجب أن تكونوا بعمر 18 سنة على الأقل أو تحت إشراف ولي الأمر</li>
                  <li>• نحتفظ بالحق في تعديل هذه الشروط في أي وقت</li>
                  <li>• سيتم إشعاركم بأي تغييرات جوهرية قبل 30 يوماً من تطبيقها</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-procell-dark">2. استخدام الموقع:</h4>
                <ul className="space-y-2 text-muted-foreground pr-4">
                  <li>• يُسمح لكم بتصفح المنتجات وإجراء عمليات الشراء للاستخدام الشخصي</li>
                  <li>• ممنوع استخدام الموقع لأغراض تجارية دون إذن مسبق</li>
                  <li>• ممنوع محاولة اختراق أو إلحاق الضرر بأنظمة الموقع</li>
                  <li>• نحتفظ بالحق في إنهاء أو تعليق حسابكم في حالة انتهاك الشروط</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-procell-dark">3. الطلبات والدفع:</h4>
                <ul className="space-y-2 text-muted-foreground pr-4">
                  <li>• جميع الطلبات تخضع للتأكيد والموافقة من جانبنا</li>
                  <li>• الأسعار قابلة للتغيير دون إشعار مسبق</li>
                  <li>• يتم قبول طرق الدفع المتاحة على الموقع فقط</li>
                  <li>• في حالة عدم توفر المنتج، سيتم إشعاركم وإعادة المبلغ</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-procell-dark">4. التسليم والشحن:</h4>
                <ul className="space-y-2 text-muted-foreground pr-4">
                  <li>• نسعى لتسليم الطلبات في المواعيد المحددة</li>
                  <li>• رسوم الشحن تختلف حسب الموقع والوزن</li>
                  <li>• العميل مسؤول عن توفير عنوان صحيح وواضح</li>
                  <li>• في حالة فشل التسليم بسبب معلومات خاطئة، العميل يتحمل التكلفة الإضافية</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* User Responsibilities */}
          <Card className="border-procell-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-procell-primary">
                <Users className="h-5 w-5" />
                مسؤوليات المستخدم
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-procell-dark">الالتزامات:</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• تقديم معلومات صحيحة ودقيقة</li>
                    <li>• الحفاظ على سرية بيانات الحساب</li>
                    <li>• إخطارنا بأي استخدام غير مصرح به</li>
                    <li>• احترام حقوق الملكية الفكرية</li>
                    <li>• عدم إساءة استخدام خدماتنا</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-procell-dark">الممنوعات:</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• استخدام الموقع لأنشطة غير قانونية</li>
                    <li>• نشر محتوى مسيء أو مخالف</li>
                    <li>• محاولة اختراق أنظمة الحماية</li>
                    <li>• إرسال فيروسات أو برامج ضارة</li>
                    <li>• انتهاك حقوق المستخدمين الآخرين</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Warranties and Disclaimers */}
          <Card className="border-procell-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-procell-primary">
                <ShieldCheck className="h-5 w-5" />
                الضمانات وإخلاء المسؤولية
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <h4 className="font-semibold text-procell-dark">ضماناتنا:</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h5 className="font-medium text-green-900 mb-2">ضمان المنتجات:</h5>
                    <p className="text-sm text-green-700">نوفر ضمان الشركة المصنعة على جميع المنتجات الأصلية</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h5 className="font-medium text-blue-900 mb-2">ضمان الخدمة:</h5>
                    <p className="text-sm text-blue-700">نضمن تقديم خدمة عملاء متميزة ودعم فني مختص</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-procell-dark">إخلاء المسؤولية:</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• نحن غير مسؤولين عن الأضرار الناتجة عن سوء الاستخدام</li>
                  <li>• المعلومات على الموقع قد تتغير دون إشعار مسبق</li>
                  <li>• لا نضمن توفر الموقع بشكل مستمر 100%</li>
                  <li>• نحن غير مسؤولين عن محتوى المراجعات والتقييمات</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Legal Terms */}
          <Card className="border-procell-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-procell-primary">
                <Scale className="h-5 w-5" />
                الأحكام القانونية
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <h4 className="font-semibold text-procell-dark">القانون المطبق:</h4>
                <p className="text-muted-foreground">
                  تخضع هذه الشروط والأحكام للقوانين الفلسطينية. أي نزاع ينشأ عن استخدام خدماتنا يُحل وفقاً للقانون الفلسطيني وأمام المحاكم المختصة في فلسطين.
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-procell-dark">تسوية النزاعات:</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• نسعى لحل أي خلاف بالطرق الودية أولاً</li>
                  <li>• في حالة عدم التوصل لحل، يتم اللجوء للوساطة</li>
                  <li>• كحل أخير، يتم اللجوء للمحاكم المختصة</li>
                  <li>• جميع الاتصالات القانونية تكون باللغة العربية</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Important Notice */}
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-700">
                <AlertTriangle className="h-5 w-5" />
                تنبيه مهم
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-yellow-700">
              <ul className="space-y-2">
                <li>• هذه الشروط سارية المفعول من تاريخ آخر تحديث</li>
                <li>• استمرار استخدام الموقع يعني قبولكم للشروط المحدثة</li>
                <li>• في حالة عدم الموافقة على التحديثات، يجب التوقف عن استخدام الخدمات</li>
                <li>• نحتفظ بالحق في تعليق أو إنهاء الخدمة في أي وقت</li>
              </ul>
            </CardContent>
          </Card>

          {/* Updates and Changes */}
          <Card className="border-procell-primary/20 bg-gradient-to-r from-procell-primary/5 to-procell-secondary/5">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-procell-dark mb-3 flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    تحديث الشروط
                  </h3>
                  <p className="text-muted-foreground text-sm mb-2">
                    قد نقوم بتحديث هذه الشروط لتتماشى مع:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• التطورات القانونية الجديدة</li>
                    <li>• تحسينات الخدمة</li>
                    <li>• متطلبات الأمان</li>
                    <li>• ملاحظات العملاء</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-procell-dark mb-3">تواصل معنا</h3>
                  <p className="text-muted-foreground text-sm mb-3">
                    لأي استفسارات حول شروط الخدمة:
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3 text-procell-primary" />
                      <span className="font-medium">الهاتف:</span>
                      <span className="text-procell-primary">02-234-5678</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-3 w-3 text-procell-primary" />
                      <span className="font-medium">البريد الإلكتروني:</span>
                      <span className="text-procell-primary">legal@procell.ps</span>
                    </div>
                  </div>
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

export default TermsOfService;