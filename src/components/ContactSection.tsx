import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
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
  Shield
} from 'lucide-react';
import { toast } from 'sonner'

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    inquiryType: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contactInfo = [
    {
      icon: <MapPin className="h-5 w-5 md:h-6 md:w-6" />,
      title: 'موقعنا',
      details: ['نابلس، رام الله، الخليل', 'فلسطين 🇵🇸'],
      color: 'text-procell-primary',
      bgColor: 'bg-procell-primary/10'
    },
    {
      icon: <Phone className="h-5 w-5 md:h-6 md:w-6" />,
      title: 'اتصل بنا',
      details: ['+970 59 XXX XXXX', '+970 56 XXX XXXX'],
      color: 'text-procell-secondary',
      bgColor: 'bg-procell-secondary/10'
    },
    {
      icon: <Mail className="h-5 w-5 md:h-6 md:w-6" />,
      title: 'البريد الإلكتروني',
      details: ['info@procell.app', 'support@procell.app'],
      color: 'text-procell-accent',
      bgColor: 'bg-procell-accent/10'
    },
    {
      icon: <Clock className="h-5 w-5 md:h-6 md:w-6" />,
      title: 'ساعات العمل',
      details: ['الأحد - الخميس', '9:00 صباحاً - 6:00 مساءً'],
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  const inquiryTypes = [
    { value: 'general', label: 'استفسار عام', icon: <MessageCircle className="h-4 w-4" /> },
    { value: 'sales', label: 'مبيعات وعروض', icon: <Star className="h-4 w-4" /> },
    { value: 'support', label: 'دعم فني', icon: <Headphones className="h-4 w-4" /> },
    { value: 'partnership', label: 'شراكة تجارية', icon: <Award className="h-4 w-4" /> }
  ];

  const features = [
    {
      icon: <Zap className="h-5 w-5" />,
      title: 'رد سريع',
      description: 'نرد خلال 24 ساعة'
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: 'أمان البيانات',
      description: 'معلوماتك محمية 100%'
    },
    {
      icon: <Globe className="h-5 w-5" />,
      title: 'دعم شامل',
      description: 'نخدم جميع مناطق فلسطين'
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('تم إرسال رسالتك بنجاح! سنرد عليك قريباً', {
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
    <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-br from-procell-light via-white to-procell-primary/5 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-3">
        <div className="absolute top-10 left-10 w-32 h-32 md:w-64 md:h-64 bg-procell-primary rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 md:w-64 md:h-64 bg-procell-secondary rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-12 space-y-4">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Badge className="bg-procell-secondary text-white px-3 py-1">
              تواصل معنا
            </Badge>
            <MessageCircle className="h-5 w-5 text-procell-secondary animate-bounce" />
          </div>
          
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-procell-dark text-center">
            <span className="block text-procell-primary mb-2">نحن هنا</span>
            <span className="block">لمساعدتك دائماً</span>
          </h2>
          
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            فريقنا المتخصص جاهز لخدمتك في أي وقت. تواصل معنا للحصول على أفضل الحلول والعروض المناسبة لك
          </p>

          {/* Quick Features */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm text-procell-dark bg-white/80 px-4 py-2 rounded-full shadow-sm">
                <div className="text-procell-primary">{feature.icon}</div>
                <span className="font-medium">{feature.title}</span>
                <span className="text-muted-foreground">- {feature.description}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-start">
          {/* Contact Information */}
          <div className="space-y-6 md:space-y-8">
            <div className="space-y-4 md:space-y-6">
              <h3 className="text-xl md:text-2xl font-bold text-procell-dark flex items-center">
                <Phone className="h-6 w-6 text-procell-primary ml-3" />
                معلومات الاتصال
              </h3>
              
              <div className="grid gap-4 md:gap-6">
                {contactInfo.map((info, index) => (
                  <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-all duration-300 bg-white/80 backdrop-blur-sm group">
                    <CardContent className="p-4 md:p-6">
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-full ${info.bgColor} ${info.color} shrink-0 group-hover:scale-110 transition-transform duration-200`}>
                          {info.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-procell-dark mb-2 text-sm md:text-base">{info.title}</h4>
                          {info.details.map((detail, idx) => (
                            <p key={idx} className={`text-xs md:text-sm text-muted-foreground mb-1 ${info.title === 'اتصل بنا' || info.title === 'البريد الإلكتروني' ? 'direction-ltr' : ''}`}>
                              {detail}
                            </p>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Emergency Contact */}
            <Card className="border-2 border-procell-secondary/20 bg-gradient-to-br from-procell-secondary/10 to-procell-accent/10 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center text-procell-dark">
                  <Headphones className="h-5 w-5 text-procell-secondary ml-2" />
                  دعم فوري - طوارئ
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-3">
                  للحالات العاجلة والطوارئ التقنية
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button size="sm" className="bg-procell-secondary hover:bg-procell-secondary/90 text-white">
                    <Phone className="h-4 w-4 ml-2" />
                    <span className="direction-ltr">+970 59 XXX XXXX</span>
                  </Button>
                  <Button size="sm" variant="outline" className="border-procell-accent text-procell-accent hover:bg-procell-accent hover:text-white">
                    <MessageCircle className="h-4 w-4 ml-2" />
                    واتساب فوري
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Statistics */}
            <div className="grid grid-cols-3 gap-3 md:gap-4">
              <div className="text-center p-3 md:p-4 bg-white/70 rounded-lg border border-procell-primary/10 hover:shadow-md transition-shadow">
                <div className="text-lg md:text-xl lg:text-2xl font-bold text-procell-primary">500+</div>
                <div className="text-xs md:text-sm text-muted-foreground">شريك راضي</div>
              </div>
              <div className="text-center p-3 md:p-4 bg-white/70 rounded-lg border border-procell-secondary/10 hover:shadow-md transition-shadow">
                <div className="text-lg md:text-xl lg:text-2xl font-bold text-procell-secondary">24/7</div>
                <div className="text-xs md:text-sm text-muted-foreground">دعم متواصل</div>
              </div>
              <div className="text-center p-3 md:p-4 bg-white/70 rounded-lg border border-procell-accent/10 hover:shadow-md transition-shadow">
                <div className="text-lg md:text-xl lg:text-2xl font-bold text-procell-accent">98%</div>
                <div className="text-xs md:text-sm text-muted-foreground">رضا العملاء</div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl md:text-2xl text-procell-dark flex items-center justify-center">
                <Send className="h-6 w-6 text-procell-primary ml-3" />
                أرسل رسالة
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
                  <div className="grid grid-cols-2 gap-2">
                    {inquiryTypes.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, inquiryType: type.value }))}
                        className={`flex items-center space-x-2 p-3 rounded-lg border text-xs md:text-sm transition-all ${
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
                      className="border-procell-primary/20 focus:border-procell-primary focus:ring-procell-primary/20"
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
                      className="border-procell-primary/20 focus:border-procell-primary focus:ring-procell-primary/20 direction-ltr"
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
                    className="border-procell-primary/20 focus:border-procell-primary focus:ring-procell-primary/20 direction-ltr"
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
                    className="border-procell-primary/20 focus:border-procell-primary focus:ring-procell-primary/20"
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
                    className="border-procell-primary/20 focus:border-procell-primary focus:ring-procell-primary/20 resize-none"
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

        {/* Bottom CTA */}
        <div className="text-center mt-12 md:mt-16">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-procell-primary/10 to-procell-secondary/10 border-procell-primary/20">
            <CardContent className="p-6 md:p-8">
              <h3 className="text-xl md:text-2xl font-bold text-procell-dark mb-4">
                هل تحتاج مساعدة فورية؟
              </h3>
              <p className="text-sm md:text-base text-muted-foreground mb-6">
                فريقنا متاح للرد على استفساراتك وتقديم أفضل الحلول
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-procell-primary hover:bg-procell-primary/90">
                  <Phone className="h-4 w-4 ml-2" />
                  اتصل الآن
                </Button>
                <Button variant="outline" className="border-procell-secondary text-procell-secondary hover:bg-procell-secondary hover:text-white">
                  <MessageCircle className="h-4 w-4 ml-2" />
                  دردشة مباشرة
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}