import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Shield, Lock, Eye, Database, UserCheck, Globe, Bell, Home } from 'lucide-react';
import { Footer } from '../components/Footer';
import { PageType } from '../App';

interface PrivacyPolicyProps {
  onNavigate: (page: PageType) => void;
}

export function PrivacyPolicy({ onNavigate }: PrivacyPolicyProps) {
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
          سياسة الخصوصية
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold text-procell-dark mb-4">
          سياسة الخصوصية وحماية البيانات
        </h1>
        <p className="text-lg text-muted-foreground">
          نحن ملتزمون بحماية خصوصيتكم وأمان بياناتكم الشخصية
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
              <Shield className="h-5 w-5" />
              مقدمة
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              في Procell، نتعامل مع خصوصيتكم بجدية تامة. تشرح هذه السياسة كيفية جمعنا واستخدامنا وحمايتنا للمعلومات الشخصية التي تقدمونها لنا عند استخدام موقعنا الإلكتروني أو خدماتنا.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              باستخدامكم لخدماتنا، فإنكم توافقون على ممارسات جمع واستخدام المعلومات الموضحة في هذه السياسة.
            </p>
          </CardContent>
        </Card>

        {/* Data Collection */}
        <Card className="border-procell-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-procell-primary">
              <Database className="h-5 w-5" />
              البيانات التي نجمعها
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-procell-dark">البيانات الشخصية:</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• الاسم الكامل</li>
                  <li>• البريد الإلكتروني</li>
                  <li>• رقم الهاتف</li>
                  <li>• العنوان</li>
                  <li>• تاريخ الميلاد</li>
                  <li>• معلومات الدفع (مشفرة)</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-procell-dark">البيانات التقنية:</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• عنوان IP</li>
                  <li>• نوع المتصفح</li>
                  <li>• نظام التشغيل</li>
                  <li>• سجل الزيارات</li>
                  <li>• ملفات تعريف الارتباط (Cookies)</li>
                  <li>• تفضيلات الموقع</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Usage */}
        <Card className="border-procell-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-procell-primary">
              <UserCheck className="h-5 w-5" />
              كيف نستخدم بياناتكم
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-procell-primary/5 rounded-lg">
                <h4 className="font-semibold text-procell-dark mb-2">الخدمات الأساسية:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• معالجة الطلبات</li>
                  <li>• إدارة الحسابات</li>
                  <li>• تقديم الدعم الفني</li>
                  <li>• إرسال الفواتير</li>
                </ul>
              </div>
              <div className="p-4 bg-procell-secondary/5 rounded-lg">
                <h4 className="font-semibold text-procell-dark mb-2">التحسين والتطوير:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• تحليل استخدام الموقع</li>
                  <li>• تحسين تجربة المستخدم</li>
                  <li>• تطوير منتجات جديدة</li>
                  <li>• أبحاث السوق</li>
                </ul>
              </div>
              <div className="p-4 bg-procell-accent/5 rounded-lg">
                <h4 className="font-semibold text-procell-dark mb-2">التسويق:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• عروض مخصصة</li>
                  <li>• نشرات إخبارية</li>
                  <li>• إعلانات مستهدفة</li>
                  <li>• استطلاعات الرأي</li>
                </ul>
              </div>
              <div className="p-4 bg-gradient-to-r from-procell-primary/5 to-procell-secondary/5 rounded-lg">
                <h4 className="font-semibold text-procell-dark mb-2">الأمان والامتثال:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• منع الاحتيال</li>
                  <li>• حماية الحسابات</li>
                  <li>• الامتثال القانوني</li>
                  <li>• تسوية النزاعات</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Protection */}
        <Card className="border-procell-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-procell-primary">
              <Lock className="h-5 w-5" />
              حماية البيانات
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gradient-to-b from-procell-primary/10 to-procell-primary/5 rounded-lg">
                <Lock className="h-8 w-8 text-procell-primary mx-auto mb-2" />
                <h4 className="font-semibold text-procell-dark mb-1">التشفير</h4>
                <p className="text-xs text-muted-foreground">تشفير SSL/TLS لجميع البيانات</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-b from-procell-secondary/10 to-procell-secondary/5 rounded-lg">
                <Shield className="h-8 w-8 text-procell-secondary mx-auto mb-2" />
                <h4 className="font-semibold text-procell-dark mb-1">الحماية</h4>
                <p className="text-xs text-muted-foreground">جدران حماية متقدمة</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-b from-procell-accent/10 to-procell-accent/5 rounded-lg">
                <Eye className="h-8 w-8 text-procell-accent mx-auto mb-2" />
                <h4 className="font-semibold text-procell-dark mb-1">المراقبة</h4>
                <p className="text-xs text-muted-foreground">مراقبة أمنية على مدار الساعة</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Sharing */}
        <Card className="border-procell-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-procell-primary">
              <Globe className="h-5 w-5" />
              مشاركة البيانات
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              نحن لا نبيع أو نؤجر بياناتكم الشخصية لأطراف ثالثة. قد نشارك معلوماتكم في الحالات التالية:
            </p>
            <div className="space-y-3">
              <div className="flex gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
                <div>
                  <h5 className="font-medium text-blue-900">شركاء الخدمات</h5>
                  <p className="text-sm text-blue-700">لمعالجة المدفوعات وتسليم الطلبات</p>
                </div>
              </div>
              <div className="flex gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
                <div>
                  <h5 className="font-medium text-green-900">المتطلبات القانونية</h5>
                  <p className="text-sm text-green-700">عند الطلب من السلطات المختصة</p>
                </div>
              </div>
              <div className="flex gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                <div className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
                <div>
                  <h5 className="font-medium text-purple-900">حماية الحقوق</h5>
                  <p className="text-sm text-purple-700">لحماية حقوقنا أو حقوق الآخرين</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Rights */}
        <Card className="border-procell-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-procell-primary">
              <UserCheck className="h-5 w-5" />
              حقوقكم
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-semibold text-procell-dark">حقوق الوصول والتحكم:</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• الوصول إلى بياناتكم الشخصية</li>
                  <li>• تصحيح المعلومات غير الدقيقة</li>
                  <li>• حذف البيانات الشخصية</li>
                  <li>• تقييد المعالجة</li>
                  <li>• نقل البيانات</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-procell-dark">حقوق الاعتراض:</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• الاعتراض على المعالجة</li>
                  <li>• إلغاء الاشتراك في التسويق</li>
                  <li>• رفض ملفات الكوكيز</li>
                  <li>• تقديم شكوى للسلطات</li>
                  <li>• طلب تقرير عن البيانات</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact and Changes */}
        <Card className="border-procell-primary/20 bg-gradient-to-r from-procell-primary/5 to-procell-secondary/5">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-procell-dark mb-3 flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  تغييرات السياسة
                </h3>
                <p className="text-muted-foreground text-sm mb-2">
                  قد نقوم بتحديث هذه السياسة من وقت لآخر. سنقوم بإشعاركم بأي تغييرات مهمة عبر:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• البريد الإلكتروني</li>
                  <li>• إشعار على الموقع</li>
                  <li>• تطبيق الهاتف المحمول</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-procell-dark mb-3">تواصل معنا</h3>
                <p className="text-muted-foreground text-sm mb-3">
                  لأي استفسارات حول سياسة الخصوصية أو لممارسة حقوقكم:
                </p>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">البريد الإلكتروني:</span>
                    <span className="text-procell-primary"> privacy@procell.ps</span>
                  </div>
                  <div>
                    <span className="font-medium">الهاتف:</span>
                    <span className="text-procell-primary"> 02-234-5678</span>
                  </div>
                  <div>
                    <span className="font-medium">العنوان:</span>
                    <span className="text-muted-foreground"> رام الله، فلسطين</span>
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

export default PrivacyPolicy;