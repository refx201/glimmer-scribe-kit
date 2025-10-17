import { memo } from 'react';
import { Card } from './ui/card';
import { Truck, Shield, Package, Phone } from 'lucide-react';

const FEATURES_CONFIG = [
  {
    icon: Truck,
    title: 'توصيل سريع',
    description: 'توصيل خلال 24 ساعة لجميع أنحاء فلسطين',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    icon: Shield,
    title: 'ضمان لمدة سنة',
    description: 'ضمان شامل على جميع المنتجات',
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    icon: Package,
    title: 'إرجاع مجاني',
    description: 'إرجاع مجاني ضمن سياسة الإرجاع الخاصة بنا',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  },
  {
    icon: Phone,
    title: 'دعم فني مختص',
    description: 'الدعم الفني متاح للعملاء بعد الشراء',
    color: 'text-red-600',
    bgColor: 'bg-red-50'
  }
];

const CompactFeatures = memo(() => {
  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {FEATURES_CONFIG.map((feature, index) => (
            <Card key={index} className={`${feature.bgColor} border-0 text-center p-4 hover:shadow-md transition-all duration-300`}>
              <div className={`mx-auto w-12 h-12 bg-white ${feature.color} rounded-full flex items-center justify-center mb-3 shadow-sm`}>
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-sm text-gray-900 mb-1">{feature.title}</h3>
              <p className="text-xs text-gray-600 leading-relaxed">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
});

CompactFeatures.displayName = 'CompactFeatures';

export { CompactFeatures };