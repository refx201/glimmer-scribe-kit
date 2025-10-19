import { memo } from 'react';
import { ShieldCheck, Lock, Verified, Heart } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const SecurePaymentMethods = memo(() => {
  const { data: paymentMethods = [] } = useQuery({
    queryKey: ['payment-methods-public'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payment_method_images')
        .select('*')
        .eq('is_active', true)
        .order('display_order');
      if (error) throw error;
      return data || [];
    },
  });

  return (
    <section className="py-8 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center">
          <h3 className="text-xl md:text-2xl font-bold text-procell-dark mb-6">
            🔒 طرق الدفع الآمنة المدعومة
          </h3>
          
          <div className="flex flex-wrap items-center justify-center gap-6 mb-8">
            {paymentMethods.map((method) => (
              <div key={method.id} className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-blue-100 hover:shadow-md transition-shadow w-32 h-20 flex items-center justify-center">
                {method.image_url ? (
                  <ImageWithFallback
                    src={method.image_url}
                    alt={method.name}
                    className="max-h-12 max-w-full object-contain"
                  />
                ) : (
                  <div className="font-bold text-base text-blue-600">{method.name}</div>
                )}
              </div>
            ))}
          </div>

          {/* Security Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-2 rounded-lg">
              <ShieldCheck className="h-4 w-4" />
              <span className="font-medium">SSL محمي</span>
            </div>
            <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
              <Lock className="h-4 w-4" />
              <span className="font-medium">تشفير 256-bit</span>
            </div>
            <div className="flex items-center gap-2 text-purple-600 bg-purple-50 px-3 py-2 rounded-lg">
              <Verified className="h-4 w-4" />
              <span className="font-medium">موثوق ومعتمد</span>
            </div>
            <div className="flex items-center gap-2 text-red-600 bg-red-50 px-3 py-2 rounded-lg">
              <Heart className="h-4 w-4" />
              <span className="font-medium">صنع بحب في فلسطين</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

SecurePaymentMethods.displayName = 'SecurePaymentMethods';

export { SecurePaymentMethods };