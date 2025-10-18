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

interface FilterCategoryDialogProps {
  category: any;
  type: 'device' | 'accessory';
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const deviceIcons = ['Smartphone', 'Tablet', 'Laptop', 'Monitor', 'Cpu'];
const accessoryIcons = ['Headphones', 'Battery', 'Watch', 'Cable', 'UsbPort', 'Speaker'];

export function FilterCategoryDialog({ category, type, open, onOpenChange }: FilterCategoryDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    type: type,
    icon: 'Smartphone',
    display_order: 0,
    is_active: true,
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (category) {
      setFormData(category);
    } else {
      setFormData({ 
        name: '', 
        type: type, 
        icon: type === 'device' ? 'Smartphone' : 'Headphones', 
        display_order: 0, 
        is_active: true 
      });
    }
  }, [category, type]);

  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (category) {
        const { error } = await supabase
          .from('product_filter_categories')
          .update(data)
          .eq('id', category.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('product_filter_categories')
          .insert([data]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['filter-categories'] });
      toast({ title: category ? 'تم تحديث الفئة' : 'تم إضافة الفئة' });
      onOpenChange(false);
    },
    onError: () => {
      toast({ title: 'خطأ في حفظ البيانات', variant: 'destructive' });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  const iconOptions = type === 'device' ? deviceIcons : accessoryIcons;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {category ? 'تعديل الفئة' : `إضافة فئة ${type === 'device' ? 'جهاز' : 'إكسسوار'}`}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>الاسم</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="مثال: الهواتف الذكية"
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
            <Label>الترتيب</Label>
            <Input
              type="number"
              value={formData.display_order}
              onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
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