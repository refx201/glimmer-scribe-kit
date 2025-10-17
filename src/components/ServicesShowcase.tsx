import { Card, CardContent } from './ui/card';
import { AdditionalServicesDialog, RepairServicesDialog } from './ServiceRequestDialogs';
import { Wrench, Package, Shield, Zap } from 'lucide-react';

export function ServicesShowcase() {
  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Package className="h-8 w-8 text-purple-600" />
            <Wrench className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            🛠️ خدمات إضافية مميزة
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            خدمات متنوعة للحفاظ على جهازك في أفضل حالة
          </p>
        </div>

        {/* Service Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8">
          {/* Additional Services Card */}
          <Card className="group hover:shadow-2xl transition-all duration-300 border-2 border-purple-100 hover:border-purple-300">
            <CardContent className="p-8">
              <div className="text-center space-y-4">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                  <Package className="h-10 w-10 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900">
                  خدمات إضافية
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  نوفر لك مجموعة متنوعة من الخدمات الإضافية للحفاظ على جهازك
                </p>

                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex items-center justify-center gap-2">
                    <Shield className="h-4 w-4 text-purple-600" />
                    <span>حماية الشاشة والأجهزة</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Zap className="h-4 w-4 text-purple-600" />
                    <span>خدمات سريعة ومضمونة</span>
                  </div>
                </div>

                <div className="pt-4">
                  <AdditionalServicesDialog />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Repair Services Card */}
          <Card className="group hover:shadow-2xl transition-all duration-300 border-2 border-green-100 hover:border-green-300">
            <CardContent className="p-8">
              <div className="text-center space-y-4">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                  <Wrench className="h-10 w-10 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900">
                  خدمات الإصلاح
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  إصلاح احترافي لجميع أنواع الأعطال مع ضمان الجودة
                </p>

                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex items-center justify-center gap-2">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span>فنيون متخصصون</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Zap className="h-4 w-4 text-green-600" />
                    <span>إصلاح سريع في نفس اليوم</span>
                  </div>
                </div>

                <div className="pt-4">
                  <RepairServicesDialog />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <p className="text-gray-600 text-lg">
            💬 اطلب الخدمة الآن وسنتواصل معك في أسرع وقت
          </p>
        </div>
      </div>
    </section>
  );
}
