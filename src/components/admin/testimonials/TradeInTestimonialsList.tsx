import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Star } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { TradeInTestimonialDialog } from './TradeInTestimonialDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface TradeInTestimonial {
  id: string;
  name: string;
  location: string;
  avatar_url?: string;
  comment: string;
  rating: number;
  device_traded?: string;
  device_received?: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
}

export function TradeInTestimonialsList() {
  const [testimonials, setTestimonials] = useState<TradeInTestimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<TradeInTestimonial | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [testimonialToDelete, setTestimonialToDelete] = useState<string | null>(null);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('trade_in_testimonials')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTestimonials(data || []);
    } catch (error: any) {
      console.error('Error fetching testimonials:', error);
      toast.error('فشل تحميل التقييمات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleEdit = (testimonial: TradeInTestimonial) => {
    setSelectedTestimonial(testimonial);
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedTestimonial(null);
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!testimonialToDelete) return;

    try {
      const { error } = await supabase
        .from('trade_in_testimonials')
        .delete()
        .eq('id', testimonialToDelete);

      if (error) throw error;
      
      toast.success('تم حذف التقييم بنجاح');
      fetchTestimonials();
    } catch (error: any) {
      console.error('Error deleting testimonial:', error);
      toast.error('فشل حذف التقييم');
    } finally {
      setDeleteDialogOpen(false);
      setTestimonialToDelete(null);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2 text-muted-foreground">جاري التحميل...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">تقييمات صفحة الاستبدال</h2>
          <p className="text-muted-foreground">إدارة تقييمات العملاء لخدمة الاستبدال</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 ml-2" />
          إضافة تقييم
        </Button>
      </div>

      {testimonials.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">
          لا توجد تقييمات حالياً. اضغط "إضافة تقييم" لإضافة أول تقييم.
        </Card>
      ) : (
        <div className="grid gap-4">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  {testimonial.avatar_url && (
                    <img
                      src={testimonial.avatar_url}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  )}
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-lg">{testimonial.name}</h3>
                      <Badge variant="outline">{testimonial.location}</Badge>
                      {testimonial.is_active ? (
                        <Badge className="bg-green-500">نشط</Badge>
                      ) : (
                        <Badge variant="secondary">غير نشط</Badge>
                      )}
                      <Badge variant="outline">ترتيب: {testimonial.display_order}</Badge>
                    </div>
                    
                    {renderStars(testimonial.rating)}
                    
                    <p className="text-muted-foreground">{testimonial.comment}</p>
                    
                    {(testimonial.device_traded || testimonial.device_received) && (
                      <div className="flex gap-4 text-sm">
                        {testimonial.device_traded && (
                          <div>
                            <span className="font-medium">الجهاز المستبدل:</span>{' '}
                            <span className="text-muted-foreground">{testimonial.device_traded}</span>
                          </div>
                        )}
                        {testimonial.device_received && (
                          <div>
                            <span className="font-medium">الجهاز المستلم:</span>{' '}
                            <span className="text-muted-foreground">{testimonial.device_received}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEdit(testimonial)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setTestimonialToDelete(testimonial.id);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <TradeInTestimonialDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        testimonial={selectedTestimonial}
        onSuccess={fetchTestimonials}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف هذا التقييم نهائياً ولن يمكن استرجاعه.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>حذف</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
