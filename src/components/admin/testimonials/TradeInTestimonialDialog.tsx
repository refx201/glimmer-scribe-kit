import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface TradeInTestimonial {
  id?: string;
  name: string;
  location: string;
  avatar_url?: string;
  comment: string;
  rating: number;
  device_traded?: string;
  device_received?: string;
  is_active: boolean;
  display_order: number;
}

interface TradeInTestimonialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  testimonial?: TradeInTestimonial | null;
  onSuccess: () => void;
}

export function TradeInTestimonialDialog({
  open,
  onOpenChange,
  testimonial,
  onSuccess
}: TradeInTestimonialDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<TradeInTestimonial>({
    name: '',
    location: '',
    avatar_url: '',
    comment: '',
    rating: 5,
    device_traded: '',
    device_received: '',
    is_active: true,
    display_order: 0
  });

  useEffect(() => {
    if (testimonial) {
      setFormData(testimonial);
    } else {
      setFormData({
        name: '',
        location: '',
        avatar_url: '',
        comment: '',
        rating: 5,
        device_traded: '',
        device_received: '',
        is_active: true,
        display_order: 0
      });
    }
  }, [testimonial, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (testimonial?.id) {
        const { error } = await supabase
          .from('trade_in_testimonials')
          .update(formData)
          .eq('id', testimonial.id);

        if (error) throw error;
        toast.success('تم تحديث التقييم بنجاح');
      } else {
        const { error } = await supabase
          .from('trade_in_testimonials')
          .insert([formData]);

        if (error) throw error;
        toast.success('تم إضافة التقييم بنجاح');
      }

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error saving testimonial:', error);
      toast.error('حدث خطأ في حفظ التقييم');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {testimonial ? 'تعديل تقييم الاستبدال' : 'إضافة تقييم استبدال جديد'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">الاسم *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">الموقع *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
                placeholder="نابلس، فلسطين"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="avatar_url">رابط الصورة الشخصية</Label>
            <Input
              id="avatar_url"
              value={formData.avatar_url}
              onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
              placeholder="https://example.com/avatar.jpg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">التعليق *</Label>
            <Textarea
              id="comment"
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              required
              rows={4}
              placeholder="اكتب التعليق هنا..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="device_traded">الجهاز المستبدل</Label>
              <Input
                id="device_traded"
                value={formData.device_traded}
                onChange={(e) => setFormData({ ...formData, device_traded: e.target.value })}
                placeholder="iPhone 13 Pro"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="device_received">الجهاز المستلم</Label>
              <Input
                id="device_received"
                value={formData.device_received}
                onChange={(e) => setFormData({ ...formData, device_received: e.target.value })}
                placeholder="iPhone 15 Pro Max"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rating">التقييم</Label>
              <Select
                value={formData.rating.toString()}
                onValueChange={(value) => setFormData({ ...formData, rating: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">⭐⭐⭐⭐⭐ (5)</SelectItem>
                  <SelectItem value="4">⭐⭐⭐⭐ (4)</SelectItem>
                  <SelectItem value="3">⭐⭐⭐ (3)</SelectItem>
                  <SelectItem value="2">⭐⭐ (2)</SelectItem>
                  <SelectItem value="1">⭐ (1)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="display_order">ترتيب العرض</Label>
              <Input
                id="display_order"
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
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

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              إلغاء
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'جاري الحفظ...' : 'حفظ'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
