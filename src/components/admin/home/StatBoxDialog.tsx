import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface StatBoxDialogProps {
  box: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const iconOptions = [
  'Users', 'Percent', 'TrendingUp', 'HeadphonesIcon', 'DollarSign', 
  'Target', 'Clock', 'Star', 'Award', 'CheckCircle'
];

const colorOptions = [
  { value: 'text-green-600', label: 'أخضر' },
  { value: 'text-orange-500', label: 'برتقالي' },
  { value: 'text-blue-600', label: 'أزرق' },
  { value: 'text-purple-600', label: 'بنفسجي' },
  { value: 'text-red-600', label: 'أحمر' },
];

export function StatBoxDialog({ box, open, onOpenChange }: StatBoxDialogProps) {
  const [formData, setFormData] = useState({
    number: '',
    label: '',
    icon: 'Users',
    color: 'text-green-600',
    display_order: 0,
    is_active: true,
    page: 'home' as 'home' | 'trade_in' | 'purchase' | 'maintenance',
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (box && box.id) {
      setFormData({
        ...box,
        display_order: box.display_order || 0,
        is_active: box.is_active ?? true
      });
    } else {
      setFormData({ 
        number: '', 
        label: '', 
        icon: 'Users', 
        color: 'text-green-600', 
        display_order: 0, 
        is_active: true,
        page: box?.page || 'home'
      });
    }
  }, [box, open]);

  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (box && box.id) {
        const { error } = await supabase
          .from('stat_boxes')
          .update(data)
          .eq('id', box.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('stat_boxes')
          .insert([data]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stat-boxes'] });
      toast({ title: box?.id ? 'تم تحديث الصندوق' : 'تم إضافة الصندوق' });
      onOpenChange(false);
    },
    onError: (error) => {
      console.error('Save error:', error);
      toast({ title: 'خطأ في حفظ البيانات', variant: 'destructive' });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{box ? 'تعديل الصندوق' : 'إضافة صندوق'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>الرقم</Label>
            <Input
              value={formData.number}
              onChange={(e) => setFormData({ ...formData, number: e.target.value })}
              placeholder="مثال: 500+"
              required
            />
          </div>
          <div>
            <Label>النص</Label>
            <Input
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              placeholder="مثال: شراكة نشطة"
              required
            />
          </div>
          <div>
            <Label>الأيقونة</Label>
            <Select value={formData.icon} onValueChange={(value) => setFormData({ ...formData, icon: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {iconOptions.map((icon) => (
                  <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>اللون</Label>
            <Select value={formData.color} onValueChange={(value) => setFormData({ ...formData, color: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {colorOptions.map((color) => (
                  <SelectItem key={color.value} value={color.value}>{color.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>الصفحة</Label>
            <Select value={formData.page} onValueChange={(value) => setFormData({ ...formData, page: value as any })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="home">الصفحة الرئيسية</SelectItem>
                <SelectItem value="trade_in">صفحة الاستبدال</SelectItem>
                <SelectItem value="purchase">صفحة الشراء</SelectItem>
                <SelectItem value="maintenance">صفحة الصيانة</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>الترتيب</Label>
            <Input
              type="number"
              value={formData.display_order}
              onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
            />
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
            />
            <Label>نشط</Label>
          </div>
          <Button type="submit" className="w-full">حفظ</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}