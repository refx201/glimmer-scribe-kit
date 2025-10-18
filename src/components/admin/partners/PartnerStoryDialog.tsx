import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface PartnerStoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  story: any | null;
  onSuccess: () => void;
}

export function PartnerStoryDialog({
  open,
  onOpenChange,
  story,
  onSuccess,
}: PartnerStoryDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    partner_name: '',
    partner_role: '',
    partner_image: '',
    revenue: '',
    revenue_label: '',
    testimonial: '',
    rating: 5,
    date: '',
    display_order: 0,
    is_active: true,
  });

  useEffect(() => {
    if (story) {
      setFormData({
        partner_name: story.partner_name || '',
        partner_role: story.partner_role || '',
        partner_image: story.partner_image || '',
        revenue: story.revenue || '',
        revenue_label: story.revenue_label || '',
        testimonial: story.testimonial || '',
        rating: story.rating || 5,
        date: story.date || '',
        display_order: story.display_order || 0,
        is_active: story.is_active !== undefined ? story.is_active : true,
      });
    } else {
      setFormData({
        partner_name: '',
        partner_role: '',
        partner_image: '',
        revenue: '',
        revenue_label: '',
        testimonial: '',
        rating: 5,
        date: '',
        display_order: 0,
        is_active: true,
      });
    }
  }, [story, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        ...formData,
        rating: parseInt(formData.rating.toString()),
      };

      if (story) {
        const { error } = await (supabase as any)
          .from('partner_success_stories')
          .update(data as any)
          .eq('id' as any, story.id as any);

        if (error) throw error;
        toast({ title: 'تم تحديث قصة النجاح بنجاح!' });
      } else {
        const { error } = await (supabase as any)
          .from('partner_success_stories')
          .insert([data] as any[]);

        if (error) throw error;
        toast({ title: 'تم إضافة قصة النجاح بنجاح!' });
      }

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: 'حدث خطأ',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {story ? 'تعديل قصة نجاح الشريك' : 'إضافة قصة نجاح جديدة'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="partner_name">اسم الشريك *</Label>
              <Input
                id="partner_name"
                value={formData.partner_name}
                onChange={(e) => setFormData({ ...formData, partner_name: e.target.value })}
                required
                placeholder="خالد عمر"
              />
            </div>

            <div>
              <Label htmlFor="partner_role">الدور / الفئة *</Label>
              <Input
                id="partner_role"
                value={formData.partner_role}
                onChange={(e) => setFormData({ ...formData, partner_role: e.target.value })}
                required
                placeholder="صاحب متجر"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="partner_image">رابط صورة الشريك</Label>
            <Input
              id="partner_image"
              value={formData.partner_image}
              onChange={(e) => setFormData({ ...formData, partner_image: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="revenue">الإيرادات (بالأرقام فقط) *</Label>
              <Input
                id="revenue"
                type="number"
                min="0"
                value={formData.revenue}
                onChange={(e) => setFormData({ ...formData, revenue: e.target.value })}
                required
                placeholder="2500"
              />
              <p className="text-xs text-muted-foreground mt-1">سيتم إضافة ₪ تلقائياً</p>
            </div>

            <div>
              <Label htmlFor="revenue_label">وصف الإيرادات *</Label>
              <Input
                id="revenue_label"
                value={formData.revenue_label}
                onChange={(e) => setFormData({ ...formData, revenue_label: e.target.value })}
                required
                placeholder="دخل شهري"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="testimonial">الشهادة / التعليق *</Label>
            <Textarea
              id="testimonial"
              value={formData.testimonial}
              onChange={(e) => setFormData({ ...formData, testimonial: e.target.value })}
              required
              rows={4}
              placeholder="قصة نجاح الشريك وتجربته مع البرنامج..."
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="rating">التقييم (1-5) *</Label>
              <Input
                id="rating"
                type="number"
                min="1"
                max="5"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                required
              />
            </div>

            <div>
              <Label htmlFor="date">التاريخ</Label>
              <Input
                id="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                placeholder="ديسمبر 2023"
              />
            </div>

            <div>
              <Label htmlFor="display_order">ترتيب العرض</Label>
              <Input
                id="display_order"
                type="number"
                min="0"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 space-x-reverse">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
            />
            <Label htmlFor="is_active">نشط</Label>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              إلغاء
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
              {story ? 'تحديث' : 'إضافة'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}