import { memo } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Users, Percent, TrendingUp, Headphones, ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type PageType = 'home' | 'offers' | 'partners' | 'contact' | 'maintenance' | 'trade-in' | 'purchase' | 'about' | 'faq' | 'product' | 'terms' | 'privacy' | 'refund';

interface PartnershipSuccessProgramProps {
  onNavigate: (page: PageType) => void;
}

const iconMap = {
  Users,
  Percent,
  TrendingUp,
  Headphones
};

const PartnershipSuccessProgram = memo(({ onNavigate }: PartnershipSuccessProgramProps) => {
  // Fetch stat boxes from Supabase (home-only)
  const { data: stats = [], isLoading } = useQuery({
    queryKey: ['partner-stat-boxes-home'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stat_boxes')
        .select('*')
        .eq('is_active', true as any)
        .eq('page', 'home')
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data || [];
    }
  });

  return (
    <section className="py-16 bg-gradient-to-br from-gradient-deep-start via-gradient-blue-mid to-gradient-blue-end relative overflow-hidden">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-300 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-400 rounded-full blur-3xl opacity-50"></div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-10 right-10 text-white/20 text-6xl">💰</div>
      <div className="absolute bottom-10 left-10 text-white/20 text-4xl">📱</div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Enhanced Program Badge */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-full text-sm font-medium mb-4 border border-white/30 shadow-xl">
            <Users className="h-5 w-5 ml-2" />
            💎 برنامج شركاء النجاح المميز
          </div>
        </div>

        {/* Enhanced Main Content */}
        <div className="text-center text-white mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            🚀 انضم لشبكة
          </h2>
          <div className="text-3xl md:text-4xl font-bold text-transparent bg-gradient-to-r from-cyan-300 to-green-400 bg-clip-text mb-6">
            شركاء النجاح الذهبيين
          </div>
          <div className="text-2xl md:text-3xl font-semibold mb-8 text-yellow-300">
            واربح حتى 15% عمولة ذهبية
          </div>
          
          <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            🎯 ابدأ رحلتك في عالم التسويق بالعمولة مع ProCell واحصل على دخل إضافي مميز
            <br />
            من خلال بيع أفضل الهواتف الذكية وأحدث التقنيات في فلسطين
          </p>
        </div>

        {/* Statistics Cards - from DB */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="bg-white/10 backdrop-blur-sm border border-white/20 text-center p-6">
                <div className="h-16 bg-white/20 animate-pulse rounded" />
              </Card>
            ))
          ) : (
            stats.map((stat: any, index: number) => {
              const IconComponent = (iconMap as any)[stat.icon] || Users;
              const colorClass = stat.color || 'text-white';
              return (
                <Card key={index} className="bg-white/10 backdrop-blur-sm border border-white/20 text-center p-4 md:p-6 hover:bg-white/15 transition-all duration-300">
                  <div className={`mx-auto w-12 h-12 ${colorClass} rounded-full flex items-center justify-center mb-3`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <div className={`text-2xl md:text-3xl font-bold ${colorClass} mb-1`}>
                    {stat.number}
                  </div>
                  <p className="text-white/90 text-sm font-medium">
                    {stat.label}
                  </p>
                </Card>
              );
            })
          )}
        </div>

        {/* Enhanced CTA Button */}
        <div className="text-center">
          <Button 
            onClick={() => onNavigate('partners')}
            className="bg-gradient-to-r from-white to-cyan-100 text-blue-800 hover:from-cyan-100 hover:to-white hover:text-blue-900 font-bold text-xl px-12 py-6 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 border-2 border-white/50 transform hover:-translate-y-1"
          >
            🚀 ابدأ رحلتك الذهبية الآن
            <ArrowRight className="h-6 w-6 mr-3" />
          </Button>
        </div>
      </div>
    </section>
  );
});

PartnershipSuccessProgram.displayName = 'PartnershipSuccessProgram';

export { PartnershipSuccessProgram };