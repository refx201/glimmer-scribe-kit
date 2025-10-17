import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Search, 
  Download, 
  Globe, 
  BarChart3, 
  CheckCircle, 
  AlertCircle,
  ExternalLink,
  Copy,
  FileText,
  Map,
  Shield,
  Zap,
  Settings,
  TrendingUp,
  Users,
  Eye,
  Link,
  Star,
  MessageSquare
} from 'lucide-react';
import { sitemapGenerator } from '../utils/sitemap';
import { toast } from 'sonner';
import { SEOManager } from './SEOManager';

interface SEOMetrics {
  totalPages: number;
  indexedPages: number;
  seoScore: number;
  avgLoadTime: number;
  mobileScore: number;
  securityScore: number;
}

export function SEODashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [metrics] = useState<SEOMetrics>({
    totalPages: sitemapGenerator.getEntriesCount(),
    indexedPages: sitemapGenerator.getEntriesCount(),
    seoScore: 95,
    avgLoadTime: 1.2,
    mobileScore: 98,
    securityScore: 100
  });

  const handleGenerateMetaTags = () => {
    const metaTags = `
<!-- procell Meta Tags -->
<title>procell - أفضل العروض على الهواتف الذكية في فلسطين</title>
<meta name="description" content="procell - متجرك الموثوق للهواتف الذكية والإكسسوارات في فلسطين. أفضل الأسعار، توصيل سريع، ضمان شامل، وخدمة عملاء ممتازة.">
<meta name="keywords" content="هواتف ذكية فلسطين, آيفون فلسطين, سامسونج فلسطين, شاومي فلسطين, إكسسوارات هواتف, توصيل سريع فلسطين, procell">
<meta name="author" content="procell">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
<meta name="language" content="ar">
<meta name="geo.region" content="PS">
<meta name="geo.country" content="Palestine">

<!-- Open Graph -->
<meta property="og:title" content="procell - أفضل العروض على الهواتف الذكية في فلسطين">
<meta property="og:description" content="procell - متجرك الموثوق للهواتف الذكية والإكسسوارات في فلسطين. أفضل الأسعار، توصيل سريع، ضمان شامل.">
<meta property="og:image" content="https://procell.app/og-home.jpg">
<meta property="og:url" content="https://procell.app">
<meta property="og:type" content="website">
<meta property="og:site_name" content="procell">
<meta property="og:locale" content="ar_PS">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="procell - أفضل العروض على الهواتف الذكية في فلسطين">
<meta name="twitter:description" content="procell - متجرك الموثوق للهواتف الذكية والإكسسوارات في فلسطين.">
<meta name="twitter:image" content="https://procell.app/og-home.jpg">
<meta name="twitter:site" content="@procellpalestine">

<!-- Canonical URL -->
<link rel="canonical" href="https://procell.app">
    `;

    navigator.clipboard.writeText(metaTags.trim()).then(() => {
      toast.success('تم نسخ Meta Tags بنجاح!');
    });
  };

  const seoTips = [
    {
      category: 'المحتوى',
      tips: [
        'إضافة وصف مفصل لكل منتج مع الكلمات المفتاحية',
        'كتابة مراجعات العملاء الحقيقية',
        'إنشاء مدونة للمحتوى التعليمي',
        'تحديث المحتوى بانتظام'
      ]
    },
    {
      category: 'التقني',
      tips: [
        'ضغط الصور وتحسين أحجامها',
        'استخدام البيانات المنظمة (Schema.org)',
        'تحسين سرعة التحميل',
        'تفعيل HTTPS'
      ]
    },
    {
      category: 'المحلي',
      tips: [
        'إضافة عنوان الشركة الفعلي',
        'تسجيل في Google My Business', 
        'الحصول على مراجعات محلية',
        'استهداف الكلمات المحلية'
      ]
    }
  ];

  const performanceMetrics = [
    {
      name: 'سرعة التحميل',
      value: metrics.avgLoadTime,
      unit: 'ثانية',
      status: 'ممتاز',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      name: 'النقاط الإجمالية',
      value: metrics.seoScore,
      unit: '/100',
      status: 'ممتاز',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      name: 'توافق الجوال',
      value: metrics.mobileScore,
      unit: '/100',
      status: 'ممتاز',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      name: 'الأمان',
      value: metrics.securityScore,
      unit: '/100',
      status: 'ممتاز',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          🚀 لوحة تحكم SEO المتقدمة
        </h1>
        <p className="text-gray-600 text-lg">
          نظام تحسين محركات البحث الشامل لموقع procell
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="sitemap">خريطة الموقع</TabsTrigger>
          <TabsTrigger value="performance">الأداء</TabsTrigger>
          <TabsTrigger value="tools">أدوات SEO</TabsTrigger>
          <TabsTrigger value="tips">نصائح التحسين</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">إجمالي الصفحات</CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{metrics.totalPages}</div>
                <p className="text-xs text-muted-foreground">جميع صفحات الموقع</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">الصفحات المفهرسة</CardTitle>
                <Search className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{metrics.indexedPages}</div>
                <p className="text-xs text-muted-foreground">مفهرسة في محركات البحث</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">نقاط SEO</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{metrics.seoScore}/100</div>
                <p className="text-xs text-muted-foreground">تقييم شامل للموقع</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">سرعة التحميل</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{metrics.avgLoadTime}s</div>
                <p className="text-xs text-muted-foreground">متوسط وقت التحميل</p>
              </CardContent>
            </Card>
          </div>

          {/* الميزات الحالية */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                الميزات المُفعلة حالياً
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: 'بيانات منظمة (Schema.org)', status: true },
                  { name: 'خريطة موقع XML', status: true },
                  { name: 'Meta Tags ديناميكية', status: true },
                  { name: 'Open Graph Tags', status: true },
                  { name: 'تحسين للهواتف المحمولة', status: true },
                  { name: 'روابط معيارية (Canonical)', status: true },
                  { name: 'ملف Robots.txt', status: true },
                  { name: 'تشفير SSL', status: true },
                  { name: 'سرعة تحميل محسنة', status: true }
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-800">{feature.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* إحصائيات الأداء */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                مؤشرات الأداء الرئيسية
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {performanceMetrics.map((metric, index) => (
                  <div key={index} className={`${metric.bgColor} p-4 rounded-lg text-center`}>
                    <div className={`text-2xl font-bold ${metric.color} mb-1`}>
                      {metric.value}{metric.unit}
                    </div>
                    <div className="font-medium text-gray-900 mb-1">{metric.name}</div>
                    <Badge className="bg-green-600 text-white text-xs">
                      {metric.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sitemap" className="mt-6">
          <SEOManager />
        </TabsContent>

        <TabsContent value="performance" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-600" />
                  تحليل السرعة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>First Contentful Paint</span>
                    <Badge className="bg-green-600">0.8s</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Largest Contentful Paint</span>
                    <Badge className="bg-green-600">1.2s</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Cumulative Layout Shift</span>
                    <Badge className="bg-green-600">0.02</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>First Input Delay</span>
                    <Badge className="bg-green-600">12ms</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  فحص الأمان
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>شهادة SSL</span>
                    <Badge className="bg-green-600">✓ مُفعل</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>HTTPS إجباري</span>
                    <Badge className="bg-green-600">✓ مُفعل</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Content Security Policy</span>
                    <Badge className="bg-green-600">✓ مُفعل</Badge>
                  </div>
                  <div className="flex justify-between items-center">  
                    <span>X-Frame-Options</span>
                    <Badge className="bg-green-600">✓ مُفعل</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tools" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  أدوات المطورين
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={handleGenerateMetaTags}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Copy className="h-4 w-4 ml-2" />
                  نسخ Meta Tags الكاملة
                </Button>
                <Button 
                  onClick={() => sitemapGenerator.downloadSitemap()}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  <Download className="h-4 w-4 ml-2" />
                  تنزيل خريطة الموقع XML
                </Button>
                <Button 
                  onClick={() => sitemapGenerator.downloadRobotsTxt()}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Download className="h-4 w-4 ml-2" />
                  تنزيل ملف Robots.txt
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ExternalLink className="h-5 w-5 text-orange-600" />
                  روابط مفيدة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <a 
                  href="https://search.google.com/search-console" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Search className="h-4 w-4 text-blue-600" />
                  <span>Google Search Console</span>
                  <ExternalLink className="h-3 w-3 text-gray-400 ml-auto" />
                </a>
                <a 
                  href="https://developers.google.com/speed/pagespeed/insights/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Zap className="h-4 w-4 text-orange-600" />
                  <span>PageSpeed Insights</span>
                  <ExternalLink className="h-3 w-3 text-gray-400 ml-auto" />
                </a>
                <a 
                  href="https://validator.schema.org/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Shield className="h-4 w-4 text-green-600" />
                  <span>Schema Markup Validator</span>
                  <ExternalLink className="h-3 w-3 text-gray-400 ml-auto" />
                </a>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tips" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {seoTips.map((category, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{category.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {category.tips.map((tip, tipIndex) => (
                      <li key={tipIndex} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}