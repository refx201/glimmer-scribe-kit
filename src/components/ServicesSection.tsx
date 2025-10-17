import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Wrench, CheckCircle, MapPin, Clock, Award, ChevronDown, ChevronUp } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { RepairServicesDialog } from './ServiceRequestDialogs';

export function ServicesSection() {
  const [showAllCenters, setShowAllCenters] = useState(false);


  const repairServices = [
    {
      icon: <Wrench className="h-6 w-6" />,
      title: 'إصلاح الشاشات',
      description: 'استبدال شاشات مكسورة بقطع أصلية',
      price: 'من 150 ₪'
    },
    {
      icon: <CheckCircle className="h-6 w-6" />,
      title: 'إصلاح البطاريات',
      description: 'تغيير البطاريات المتضررة',
      price: 'من 80 ₪'
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: 'صيانة شاملة',
      description: 'فحص وإصلاح شامل للجهاز',
      price: 'من 200 ₪'
    }
  ];

  const repairCenters = [
    { city: 'نابلس', partner: 'العودة للالكترونيات', status: 'متاح' },
    { city: 'جنين', partner: 'عتابة للهواتف', status: 'متاح' },
    { city: 'رام الله', partner: 'قريباً', status: 'قريباً' },
    { city: 'الخليل', partner: 'قريباً', status: 'قريباً' },
    { city: 'طولكرم', partner: 'قريباً', status: 'قريباً' },
    { city: 'بيت لحم', partner: 'قريباً', status: 'قريباً' },
    { city: 'طوباس', partner: 'قريباً', status: 'قريباً' },
    { city: 'سلفيت', partner: 'قريباً', status: 'قريباً' }
  ];

  return (
    <div className="space-y-20">

      {/* Repair Services Section */}
      <section id="repair" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <Badge className="w-fit mx-auto">خدمات الصيانة</Badge>
            <h2 className="text-3xl md:text-4xl">صيانة معتمدة وموثوقة</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              فريق متخصص من الفنيين المعتمدين لإصلاح جميع أنواع الهواتف الذكية بضمان الجودة
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {repairServices.map((service, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="text-primary mx-auto w-fit p-3 bg-primary/10 rounded-full">
                    {service.icon}
                  </div>
                  <CardTitle>{service.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{service.description}</p>
                  <div className="text-2xl text-primary">{service.price}</div>
                  <RepairServicesDialog />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Repair Centers */}
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h3 className="text-2xl">مراكز الصيانة المعتمدة</h3>
              <p className="text-muted-foreground">شبكة متنامية من مراكز الصيانة في جميع أنحاء فلسطين</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {repairCenters
                .slice(0, showAllCenters ? repairCenters.length : 4)
                .map((center, index) => {
                const isAvailable = center.status === 'متاح';
                return (
                  <Card 
                    key={index} 
                    className={`text-center transition-all duration-300 hover:shadow-md ${
                      isAvailable 
                        ? 'bg-white border-green-200' 
                        : 'bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200 border-dashed'
                    }`}
                  >
                    <CardContent className="p-4 md:p-6 space-y-3">
                      <MapPin className={`h-6 w-6 mx-auto ${isAvailable ? 'text-primary' : 'text-orange-500'}`} />
                      <h4 className="font-semibold">{center.city}</h4>
                      <p className={`text-sm ${isAvailable ? 'text-muted-foreground' : 'text-orange-600 font-medium'}`}>
                        {center.partner}
                      </p>
                      <Badge 
                        variant={isAvailable ? 'default' : 'secondary'}
                        className={`${
                          isAvailable 
                            ? 'bg-green-600 text-white' 
                            : 'bg-orange-500 text-white'
                        }`}
                      >
                        {center.status}
                      </Badge>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            {/* Show More/Less Button */}
            {repairCenters.length > 4 && (
              <div className="text-center mt-8">
                <Button
                  onClick={() => setShowAllCenters(!showAllCenters)}
                  variant="outline"
                  className="bg-white border-2 border-procell-primary text-procell-primary hover:bg-procell-primary hover:text-white transition-all duration-300 px-8 py-3 font-semibold"
                >
                  {showAllCenters ? (
                    <>
                      <ChevronUp className="h-4 w-4 ml-2" />
                      إخفاء المدن الإضافية
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4 ml-2" />
                      إظهار المزيد ({repairCenters.length - 4} مدن إضافية)
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Service Features */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="text-center space-y-4">
              <Clock className="h-8 w-8 text-primary mx-auto" />
              <h4>إصلاح سريع</h4>
              <p className="text-sm text-muted-foreground">معظم الإصلاحات تتم في نفس اليوم</p>
            </div>
            <div className="text-center space-y-4">
              <Award className="h-8 w-8 text-primary mx-auto" />
              <h4>ضمان الجودة</h4>
              <p className="text-sm text-muted-foreground">ضمان 6 أشهر على جميع الإصلاحات</p>
            </div>
            <div className="text-center space-y-4">
              <CheckCircle className="h-8 w-8 text-primary mx-auto" />
              <h4>قطع أصلية</h4>
              <p className="text-sm text-muted-foreground">نستخدم قطع غيار أصلية فقط</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}