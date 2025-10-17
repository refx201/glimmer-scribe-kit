import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ServicesSection } from './ServicesSection';

import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageCircle, 
  Send, 
  CheckCircle2,
  Star,
  Award,
  Headphones,
  Globe,
  Zap,
  Shield,
  Users,
  Heart,
  ArrowRight,
  ExternalLink,
  Wrench
} from 'lucide-react';
import { toast } from 'sonner'

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    inquiryType: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contactMethods = [
    {
      icon: <Phone className="h-6 w-6" />,
      title: 'اتصل بنا مباشرة',
      description: 'متاحون للرد على استفساراتك',
      contact: '+972-598-366-822',
      availability: '24/7',
      color: 'from-procell-primary to-blue-600',
      action: 'اتصل الآن',
      link: 'tel:+972598366822'
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: 'دردشة واتساب',
      description: 'تواصل سريع عبر واتساب',
      contact: '+972-598-366-822',
      availability: 'فوري',
      color: 'from-green-500 to-green-600',
      action: 'دردشة واتساب',
      link: 'https://wa.me/972598366822'
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: 'البريد الإلكتروني',
      description: 'للاستفسارات التفصيلية',
      contact: 'info@procell.app',
      availability: 'خلال 24 ساعة',
      color: 'from-procell-secondary to-orange-600',
      action: 'أرسل إيميل',
      link: 'mailto:info@procell.app'
    }
  ];

  const locationInfo = [
    {
      city: 'نابلس',
      address: 'بيتا - بالقرب من صرح الشهيد',
      phone: '+970 09 XXX XXXX',
      hours: 'السبت - الخميس: 9:00 - 18:00'
    }
  ];

  const inquiryTypes = [
    { value: 'general', label: 'استفسار عام', icon: <MessageCircle className="h-4 w-4" /> },
    { value: 'sales', label: 'مبيعات وعروض', icon: <Star className="h-4 w-4" /> },
    { value: 'support', label: 'دعم فني', icon: <Headphones className="h-4 w-4" /> },
    { value: 'partnership', label: 'شراكة تجارية', icon: <Users className="h-4 w-4" /> },
    { value: 'complaint', label: 'شكوى أو اقتراح', icon: <Heart className="h-4 w-4" /> }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      // Insert contact message
      const { data, error } = await supabase
        .from('contact_messages')
        .insert([{
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message,
          status: 'new',
          inquiry_type: formData.inquiryType
        }])
        .select()
        .single();

      if (error) throw error;

      // Send Telegram notification
      try {
        await supabase.functions.invoke('send-telegram-notification', {
          body: {
            type: 'contact',
            data: {
              ...data,
              created_at: new Date(data.created_at).toISOString()
            }
          }
        });
      } catch (telegramError) {
        console.error('Telegram notification error:', telegramError);
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('تم إرسال رسالتك بنجاح! 🎉', {
        description: 'شكراً لتواصلك معنا، فريقنا سيرد عليك خلال 24 ساعة.',
        duration: 5000,
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        inquiryType: 'general'
      });
    } catch (error) {
      toast.error('حدث خطأ في إرسال الرسالة', {
        description: 'يرجى المحاولة مرة أخرى أو الاتصال بنا مباشرة.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-procell-light/20 to-white">
      {/* Hero Section */}
      <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-r from-procell-primary to-procell-secondary text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-procell-accent rounded-full mix-blend-overlay filter blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <Badge className="bg-white/20 text-white px-4 py-2 text-sm">
                تواصل معنا
              </Badge>
              <MessageCircle className="h-6 w-6 animate-bounce" />
            </div>
            
            <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-6">
              <span className="block mb-2">📞 نحن هنا</span>
              <span className="block text-procell-accent">لمساعدتك دائماً</span>
            </h1>
            
            <p className="text-sm md:text-base lg:text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              فريقنا المتخصص جاهز لخدمتك في أي وقت. تواصل معنا للحصول على أفضل الحلول والعروض المناسبة لك
            </p>

            {/* Quick Contact Stats */}
            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="text-center bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold text-procell-accent">98%</div>
                <div className="text-xs text-white/80">رضا العملاء</div>
              </div>
              <div className="text-center bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold text-white">24/7</div>
                <div className="text-xs text-white/80">دعم متواصل</div>
              </div>
              <div className="text-center bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold text-procell-accent">&lt;2h</div>
                <div className="text-xs text-white/80">وقت الرد</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* Quick Contact Methods */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-procell-dark mb-4">
              🚀 طرق التواصل السريع
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              اختر الطريقة الأنسب لك للحصول على مساعدة فورية
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12">
            {contactMethods.map((method, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm overflow-hidden group">
                <CardContent className="p-6 md:p-8">
                  <div className={`mx-auto w-fit p-4 rounded-full bg-gradient-to-r ${method.color} text-white mb-4 group-hover:scale-110 transition-transform`}>
                    {method.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-procell-dark mb-2">{method.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{method.description}</p>
                  <div className="space-y-2 mb-4">
                    <p className="font-medium text-procell-primary">{method.contact}</p>
                    <Badge className="bg-procell-accent/10 text-procell-accent">
                      متاح {method.availability}
                    </Badge>
                  </div>
                  <Button 
                    onClick={() => window.open(method.link, '_blank')}
                    className={`w-full bg-gradient-to-r ${method.color} hover:opacity-90 text-white transform hover:scale-105 transition-all`}
                  >
                    {method.action}
                    <ExternalLink className="h-4 w-4 mr-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Services Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-procell-dark mb-4 flex items-center justify-center">
              <Wrench className="h-6 w-6 text-procell-secondary ml-2" />
              🔧 خدماتنا المتميزة
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              نقدم مجموعة شاملة من الخدمات التقنية عالية الجودة
            </p>
          </div>
          
          <ServicesSection />
        </section>

        {/* Main Contact Form & Info */}
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 mb-16">
          {/* Contact Form */}
          <div>
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl md:text-2xl text-procell-dark flex items-center justify-center">
                  <Send className="h-6 w-6 text-procell-primary ml-3" />
                  📝 أرسل رسالة
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  املأ النموذج وسنرد عليك خلال 24 ساعة
                </p>
              </CardHeader>
              <CardContent className="space-y-4 md:space-y-6">
                <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                  {/* Inquiry Type */}
                  <div>
                    <label className="block text-sm font-medium text-procell-dark mb-2">نوع الاستفسار</label>
                    <div className="grid grid-cols-1 gap-2">
                      {inquiryTypes.map((type) => (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, inquiryType: type.value }))}
                          className={`flex items-center space-x-3 p-3 rounded-lg border text-xs md:text-sm transition-all ${
                            formData.inquiryType === type.value
                              ? 'border-procell-primary bg-procell-primary/10 text-procell-primary'
                              : 'border-gray-200 hover:border-procell-primary/50 hover:bg-procell-primary/5'
                          }`}
                        >
                          {type.icon}
                          <span>{type.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Personal Information */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-procell-dark mb-2">
                        الاسم الكامل *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="اكتب اسمك الكامل"
                        className="border-procell-primary/20 focus:border-procell-primary"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-procell-dark mb-2">
                        رقم الهاتف *
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+970 5X XXX XXXX"
                        className="border-procell-primary/20 focus:border-procell-primary direction-ltr"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-procell-dark mb-2">
                      البريد الإلكتروني *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="example@email.com"
                      className="border-procell-primary/20 focus:border-procell-primary direction-ltr"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-procell-dark mb-2">
                      موضوع الرسالة *
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="موضوع رسالتك باختصار"
                      className="border-procell-primary/20 focus:border-procell-primary"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-procell-dark mb-2">
                      تفاصيل الرسالة *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="اشرح لنا كيف يمكننا مساعدتك..."
                      rows={5}
                      className="border-procell-primary/20 focus:border-procell-primary resize-none"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-procell-primary to-procell-secondary hover:from-procell-primary/90 hover:to-procell-secondary/90 text-white shadow-lg transform hover:scale-105 transition-all duration-200 py-3 md:py-4"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                        جاري الإرسال...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Send className="h-4 w-4 ml-2" />
                        إرسال الرسالة
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                      </div>
                    )}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    بإرسال هذه الرسالة، أنت توافق على سياسة الخصوصية وشروط الاستخدام
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Locations & Additional Info */}
          <div className="space-y-6">
            <Card className="border-procell-primary/10">
              <CardHeader>
                <CardTitle className="text-xl text-procell-dark flex items-center">
                  <MapPin className="h-6 w-6 text-procell-primary ml-3" />
                  📍 موقعنا في فلسطين
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {locationInfo.map((location, index) => (
                  <div 
                    key={index} 
                    className="p-4 rounded-lg border transition-all duration-300 bg-procell-light/30 border-transparent hover:shadow-md"
                  >
                    <div className="flex items-center mb-2">
                      <h4 className="font-semibold text-procell-dark flex items-center">
                        <MapPin className="h-4 w-4 text-procell-primary ml-2" />
                        {location.city}
                      </h4>
                    </div>
                    
                    <p className="text-sm mb-2 text-muted-foreground">
                      {location.address}
                    </p>
                    
                    <div className="flex items-center text-sm mb-1">
                      <Phone className="h-4 w-4 text-procell-secondary ml-2" />
                      <span className="direction-ltr">{location.phone}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 ml-2" />
                      <span>{location.hours}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Features */}
            <Card className="border-procell-accent/20 bg-gradient-to-br from-procell-accent/5 to-procell-secondary/5">
              <CardContent className="p-6">
                <h4 className="font-semibold text-procell-dark mb-4 flex items-center">
                  <Shield className="h-5 w-5 text-procell-accent ml-2" />
                  لماذا تختار ProCell؟
                </h4>
                <div className="space-y-3">
                  {[
                    { icon: <Zap className="h-4 w-4" />, text: 'رد سريع خلال ساعتين', color: 'text-yellow-600' },
                    { icon: <Shield className="h-4 w-4" />, text: 'أمان البيانات 100%', color: 'text-green-600' },
                    { icon: <Award className="h-4 w-4" />, text: 'خدمة عملاء متميزة', color: 'text-blue-600' },
                    { icon: <Globe className="h-4 w-4" />, text: 'دعم شامل في فلسطين', color: 'text-purple-600' }
                  ].map((feature, idx) => (
                    <div key={idx} className="flex items-center text-sm">
                      <div className={`${feature.color} ml-3`}>{feature.icon}</div>
                      <span>{feature.text}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>


          </div>
        </div>

        {/* Bottom CTA */}
        <section>
          <Card className="max-w-3xl mx-auto bg-gradient-to-r from-procell-primary/10 to-procell-secondary/10 border-procell-primary/20">
            <CardContent className="p-6 md:p-8 text-center">
              <h3 className="text-xl md:text-2xl font-bold text-procell-dark mb-4">
                💡 هل تحتاج مساعدة فورية؟
              </h3>
              <p className="text-sm md:text-base text-muted-foreground mb-6">
                فريقنا متاح الآن للرد على استفساراتك وتقديم أفضل الحلول
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-procell-primary hover:bg-procell-primary/90 transform hover:scale-105 transition-all">
                  <Phone className="h-4 w-4 ml-2" />
                  اتصل الآن
                  <ArrowRight className="h-4 w-4 mr-2" />
                </Button>
                <Button variant="outline" className="border-procell-secondary text-procell-secondary hover:bg-procell-secondary hover:text-white transform hover:scale-105 transition-all">
                  <MessageCircle className="h-4 w-4 ml-2" />
                  دردشة مباشرة
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}