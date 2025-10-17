import { memo } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Gift, Crown, CheckSquare } from 'lucide-react';
import { ACCESSORY_BUNDLES } from '../lib/data';

const CompactAccessoryBundles = memo(() => {
  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            🎁 باقات الإكسسوارات
          </h2>
          <p className="text-gray-600">
            وفر أكثر مع الباقات الشاملة
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {ACCESSORY_BUNDLES.map((bundle, index) => (
            <Card 
              key={bundle.id} 
              className={`
                relative overflow-hidden transition-all duration-300 hover:shadow-xl h-full flex flex-col
                ${bundle.popular ? 'ring-2 ring-purple-400 scale-105 transform' : ''}
                ${index === 0 ? 'bg-gradient-to-br from-gray-50 to-blue-50 border-2 border-blue-200' : ''}
                ${index === 1 ? 'bg-gradient-to-br from-purple-500 to-purple-600 text-white border-2 border-purple-400' : ''}
                ${index === 2 ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white border-2 border-orange-400' : ''}
              `}
            >
              {bundle.popular && (
                <div className="absolute top-3 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge className="bg-yellow-500 text-white text-xs px-3 py-1 shadow-lg">
                    <Crown className="h-3 w-3 ml-1" />
                    الأكثر طلباً
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4 pt-8">
                <CardTitle className={`text-xl font-bold ${index === 0 ? 'text-blue-700' : 'text-white'}`}>
                  {bundle.name}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="px-6 flex-1 flex flex-col justify-between">
                {/* Items List */}
                <div className="space-y-3 mb-6">
                  {bundle.items.map((item, itemIndex) => (
                    <div key={itemIndex} className={`flex items-center text-sm ${index === 0 ? 'text-blue-700' : 'text-white/95'}`}>
                      <CheckSquare className="h-4 w-4 ml-2 shrink-0 text-green-500" />
                      <span className="font-medium">{item}</span>
                    </div>
                  ))}
                </div>
                
                {/* Price Section */}
                <div className="text-center mb-6">
                  <div className={`text-3xl font-bold mb-2 ${index === 0 ? 'text-blue-700' : 'text-white'}`}>
                    {bundle.price.toLocaleString()} ₪
                  </div>
                  <div className={`text-lg line-through ${index === 0 ? 'text-blue-400' : 'text-white/70'}`}>
                    {bundle.originalPrice.toLocaleString()} ₪
                  </div>
                  <div className={`text-sm font-semibold mt-2 ${index === 0 ? 'text-green-600' : 'text-green-300'}`}>
                    وفر {bundle.savings} ₪
                  </div>
                </div>
                
                {/* CTA Button */}
                <div className="mt-auto">
                  <Button 
                    className={`
                      w-full font-bold py-3 text-base transition-all duration-300 hover:scale-105 shadow-lg
                      ${index === 0 ? 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-blue-200' : ''}
                      ${index === 1 ? 'bg-white text-purple-600 hover:bg-purple-50 hover:shadow-purple-200' : ''}
                      ${index === 2 ? 'bg-white text-orange-600 hover:bg-orange-50 hover:shadow-orange-200' : ''}
                    `}
                  >
                    <Gift className="h-4 w-4 ml-2" />
                    اطلب الآن
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
});

CompactAccessoryBundles.displayName = 'CompactAccessoryBundles';

export { CompactAccessoryBundles };