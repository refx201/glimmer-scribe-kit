import { Card, CardContent } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import * as Icons from 'lucide-react';

export function StatBoxesSection() {
  const { data: stats = [], isLoading } = useQuery({
    queryKey: ['home-stat-boxes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stat_boxes')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching stat boxes:', error);
        throw error;
      }
      
      return data || [];
    },
  });

  const getIconComponent = (iconName: string, color: string) => {
    const IconComponent = (Icons as any)[iconName] || Icons.Users;
    return <IconComponent className={`h-5 w-5 ${color}`} />;
  };

  if (isLoading) {
    return (
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="text-center">
                <CardContent className="p-6">
                  <div className="h-20 bg-gray-200 animate-pulse rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (stats.length === 0) return null;

  return (
    <section className="py-12 bg-gradient-to-br from-procell-primary/5 to-procell-secondary/5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card 
              key={stat.id} 
              className="text-center border-procell-primary/20 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <CardContent className="p-6 space-y-3">
                <div className="mx-auto w-fit">
                  {getIconComponent(stat.icon, stat.color || 'text-procell-primary')}
                </div>
                <div className="text-2xl md:text-3xl font-bold text-procell-primary">
                  {stat.number}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
