import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
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
  Zap
} from 'lucide-react';
import { sitemapGenerator, type SitemapEntry } from '../utils/sitemap';
import { toast } from 'sonner';

export function SEOManager() {
  const [sitemapEntries, setSitemapEntries] = useState<SitemapEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [seoScore, setSeoScore] = useState(0);

  useEffect(() => {
    // تحميل بيانات خريطة الموقع
    const entries = sitemapGenerator.getEntries();
    setSitemapEntries(entries);
    
    // حساب نقاط SEO
    calculateSEOScore();
    setLoading(false);
  }, []);

  const calculateSEOScore = () => {
    let score = 0;
    
    // فحص العناصر الأساسية
    const hasTitle = document.title && document.title.length > 0;
    const hasDescription = document.querySelector('meta[name="description"]');
    const hasKeywords = document.querySelector('meta[name="keywords"]');
    const hasOGImage = document.querySelector('meta[property="og:image"]');
    const hasCanonical = document.querySelector('link[rel="canonical"]');
    const hasStructuredData = document.querySelector('script[type="application/ld+json"]');
    
    if (hasTitle) score += 15;
    if (hasDescription) score += 15;
    if (hasKeywords) score += 10;
    if (hasOGImage) score += 15;
    if (hasCanonical) score += 10;
    if (hasStructuredData) score += 20;
    
    // فحص الأداء
    const isHTTPS = window.location.protocol === 'https:';
    const isMobileOptimized = document.querySelector('meta[name="viewport"]');
    
    if (isHTTPS) score += 10;
    if (isMobileOptimized) score += 5;
    
    setSeoScore(score);
  };

  const handleDownloadSitemap = () => {
    sitemapGenerator.downloadSitemap();
    toast.success('تم تنزيل خريطة الموقع بنجاح!');
  };

  const handleDownloadRobots = () => {
    sitemapGenerator.downloadRobotsTxt();
    toast.success('تم تنزيل ملف robots.txt بنجاح!');
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`تم نسخ ${label} بنجاح!`);
    });
  };

  const getSEOScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSEOScoreBadge = (score: number) => {
    if (score >= 80) return { text: 'ممتاز', color: 'bg-green-600' };
    if (score >= 60) return { text: 'جيد', color: 'bg-yellow-600' };
    return { text: 'يحتاج تحسين', color: 'bg-red-600' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل بيانات SEO...</p>
        </div>
      </div>
    );
  }

  const badge = getSEOScoreBadge(seoScore);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🚀 مدير تحسين محركات البحث
        </h1>
        <p className="text-gray-600">
          إدارة شاملة لـ SEO وخريطة الموقع لأفضل ظهور في نتائج البحث
        </p>
      </div>

      {/* نقاط SEO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              نقاط SEO
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-4xl font-bold mb-2 ${getSEOScoreColor(seoScore)}`}>
              {seoScore}/100
            </div>
            <Badge className={`${badge.color} text-white`}>
              {badge.text}
            </Badge>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2">
              <Map className="h-5 w-5 text-green-600" />
              صفحات الموقع
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-green-600 mb-2">
              {sitemapEntries.length}
            </div>
            <Badge className="bg-green-600 text-white">
              مفهرسة
            </Badge>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2">
              <Shield className="h-5 w-5 text-purple-600" />
              الحالة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center gap-2 mb-2">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <span className="text-xl font-bold text-green-600">نشط</span>
            </div>
            <Badge className="bg-purple-600 text-white">
              محسن
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* أدوات التحميل */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            تنزيل ملفات SEO
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg bg-blue-50">
              <div className="flex items-center gap-3 mb-3">
                <Map className="h-6 w-6 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-blue-900">خريطة الموقع XML</h3>
                  <p className="text-sm text-blue-700">للمساعدة في فهرسة المحتوى</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={handleDownloadSitemap}
                  className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
                >
                  <Download className="h-4 w-4 ml-1" />
                  تنزيل Sitemap.xml
                </Button>
                <Button
                  onClick={() => copyToClipboard('https://procell.app/sitemap.xml', 'رابط خريطة الموقع')}
                  variant="outline"
                  size="sm"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="p-4 border rounded-lg bg-green-50">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="h-6 w-6 text-green-600" />
                <div>
                  <h3 className="font-semibold text-green-900">ملف Robots.txt</h3>
                  <p className="text-sm text-green-700">لتوجيه محركات البحث</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={handleDownloadRobots}
                  className="bg-green-600 hover:bg-green-700 text-white flex-1"
                >
                  <Download className="h-4 w-4 ml-1" />
                  تنزيل Robots.txt
                </Button>
                <Button
                  onClick={() => copyToClipboard('https://procell.app/robots.txt', 'رابط ملف robots')}
                  variant="outline"
                  size="sm"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* فحص SEO */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            فحص عناصر SEO
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { 
                check: !!document.title, 
                label: 'عنوان الصفحة', 
                value: document.title,
                points: 15 
              },
              { 
                check: !!document.querySelector('meta[name="description"]'), 
                label: 'وصف الصفحة',
                value: document.querySelector('meta[name="description"]')?.getAttribute('content'),
                points: 15 
              },
              { 
                check: !!document.querySelector('meta[name="keywords"]'), 
                label: 'الكلمات المفتاحية',
                value: document.querySelector('meta[name="keywords"]')?.getAttribute('content'),
                points: 10 
              },
              { 
                check: !!document.querySelector('meta[property="og:image"]'), 
                label: 'صورة Open Graph',
                value: document.querySelector('meta[property="og:image"]')?.getAttribute('content'),
                points: 15 
              },
              { 
                check: !!document.querySelector('link[rel="canonical"]'), 
                label: 'الرابط المعياري',
                value: document.querySelector('link[rel="canonical"]')?.getAttribute('href'),
                points: 10 
              },
              { 
                check: !!document.querySelector('script[type="application/ld+json"]'), 
                label: 'البيانات المنظمة',
                value: 'موجود',
                points: 20 
              }
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                {item.check ? (
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900">{item.label}</span>
                    <Badge 
                      className={`text-xs ${item.check ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                    >
                      {item.points} نقطة
                    </Badge>
                  </div>
                  {item.value && (
                    <p className="text-sm text-gray-600 truncate" title={item.value}>
                      {item.value}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* خريطة الموقع */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            خريطة الموقع ({sitemapEntries.length} صفحة)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {sitemapEntries.map((entry, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 truncate">
                      {entry.url.replace('https://procell.app/', '') || 'الصفحة الرئيسية'}
                    </span>
                    {entry.priority && (
                      <Badge 
                        className={`text-xs ${
                          entry.priority >= 0.8 ? 'bg-green-100 text-green-800' :
                          entry.priority >= 0.6 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}
                      >
                        أولوية {entry.priority}
                      </Badge>
                    )}
                    {entry.changefreq && (
                      <Badge className="bg-blue-100 text-blue-800 text-xs">
                        {entry.changefreq}
                      </Badge>
                    )}
                  </div>
                  {entry.lastmod && (
                    <p className="text-sm text-gray-500 mt-1">
                      آخر تحديث: {entry.lastmod}
                    </p>
                  )}
                </div>
                <Button
                  onClick={() => window.open(entry.url, '_blank')}
                  variant="ghost"
                  size="sm"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* إرشادات التحسين */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            نصائح لتحسين SEO
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-semibold text-green-600">✅ نقاط القوة:</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• بيانات منظمة شاملة (Schema.org)</li>
                <li>• خريطة موقع تلقائية ومحدثة</li>
                <li>• تحسين للهواتف المحمولة</li>
                <li>• صور محسنة مع نصوص بديلة</li>
                <li>• روابط معيارية صحيحة</li>
                <li>• سرعة تحميل ممتازة</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-blue-600">💡 اقتراحات للتحسين:</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• إضافة المزيد من المحتوى التفاعلي</li>
                <li>• تحسين أوصاف المنتجات</li>
                <li>• إضافة مراجعات العملاء</li>
                <li>• تحديث المحتوى بانتظام</li>
                <li>• إضافة مدونة للمحتوى</li>
                <li>• تحسين الروابط الداخلية</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}