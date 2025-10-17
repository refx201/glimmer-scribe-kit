import { memo } from 'react';
import { ShieldCheck, Lock, Verified, Heart } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

// Import payment method assets
const palpayLogo = '../assets/40bde209c2063617cd7dc0e28a131725d888ae78.png';

const SecurePaymentMethods = memo(() => {
  return (
    <section className="py-8 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center">
          <h3 className="text-xl md:text-2xl font-bold text-procell-dark mb-6">
            🔒 طرق الدفع الآمنة المدعومة
          </h3>
          
          <div className="flex flex-wrap items-center justify-center gap-6 mb-8">
            {/* Payment Method Icons */}
            <div className="flex items-center gap-4 bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-blue-100">
              <div className="text-blue-600 font-bold text-sm">فيزا</div>
              <div className="h-4 w-px bg-blue-200"></div>
              <div className="text-orange-500 font-bold text-sm">ماستركارد</div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-blue-100">
              <ImageWithFallback
                src={palpayLogo}
                alt="PALPAY"
                className="h-6 w-auto object-contain"
              />
            </div>
            
            <div className="text-green-600 font-bold text-sm bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-blue-100">
              تحويل بنكي
            </div>
            
            <div className="text-purple-600 font-bold text-sm bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-blue-100">
              دفع عند الاستلام
            </div>
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