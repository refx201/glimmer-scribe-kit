import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Plus, X } from 'lucide-react';

interface MaintenanceServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: any | null;
  onSuccess: () => void;
}

export function MaintenanceServiceDialog({
  open,
  onOpenChange,
  service,
  onSuccess,
}: MaintenanceServiceDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    price: '',
    time: '',
    features: [] as string[],
    rating: 4.5,
    reviews: 0,
    is_popular: false,
    is_active: true,
    display_order: 0,
  });
  const [newFeature, setNewFeature] = useState('');

  useEffect(() => {
    if (service) {
      setFormData({
        title: service.title || '',
        description: service.description || '',
        image: service.image || '',
        price: service.price || '',
        time: service.time || '',
        features: service.features || [],
        rating: service.rating || 4.5,
        reviews: service.reviews || 0,
        is_popular: service.is_popular || false,
        is_active: service.is_active !== undefined ? service.is_active : true,
        display_order: service.display_order || 0,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        image: '',
        price: '',
        time: '',
        features: [],
        rating: 4.5,
        reviews: 0,
        is_popular: false,
        is_active: true,
        display_order: 0,
      });
    }
  }, [service, open]);

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        ...formData,
        rating: parseFloat(formData.rating.toString()),
        reviews: parseInt(formData.reviews.toString()),
      };

      if (service) {
        const { error } = await (supabase as any)
          .from('maintenance_services')
          .update(data as any)
          .eq('id' as any, service.id as any);

        if (error) throw error;
        toast({ title: 'تم تحديث الخدمة بنجاح!' });
      } else {
        const { error } = await (supabase as any)
          .from('maintenance_services')
          .insert([data] as any[]);

        if (error) throw error;
        toast({ title: 'تم إضافة الخدمة بنجاح!' });
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
            {service ? 'تعديل خدمة الصيانة' : 'إضافة خدمة صيانة جديدة'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">العنوان *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">الوصف *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="image">رابط الصورة *</Label>
            <Input
              id="image"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              required
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">السعر * (بدون رمز العملة)</Label>
              <Input
                id="price"
                type="number"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                placeholder="150"
              />
              <p className="text-xs text-muted-foreground mt-1">سيتم إضافة ₪ تلقائياً</p>
            </div>

            <div>
              <Label htmlFor="time">الوقت</Label>
              <Input
                id="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                placeholder="30-45 دقيقة"
              />
            </div>
          </div>

          <div>
            <Label>المميزات</Label>
            <div className="space-y-2">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input value={feature} disabled />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFeature(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <div className="flex gap-2">
                <Input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="أضف ميزة جديدة"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addFeature();
                    }
                  }}
                />
                <Button type="button" onClick={addFeature} size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="rating">التقييم</Label>
              <Input
                id="rating"
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
              />
            </div>

            <div>
              <Label htmlFor="reviews">عدد التقييمات</Label>
              <Input
                id="reviews"
                type="number"
                min="0"
                value={formData.reviews}
                onChange={(e) => setFormData({ ...formData, reviews: parseInt(e.target.value) })}
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

          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2 space-x-reverse">
              <Switch
                id="is_popular"
                checked={formData.is_popular}
                onCheckedChange={(checked) => setFormData({ ...formData, is_popular: checked })}
              />
              <Label htmlFor="is_popular">الأكثر طلباً</Label>
            </div>

            <div className="flex items-center space-x-2 space-x-reverse">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label htmlFor="is_active">نشط</Label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              إلغاء
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
              {service ? 'تحديث' : 'إضافة'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}