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

interface PaymentMethodDialogProps {
  method: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PaymentMethodDialog({ method, open, onOpenChange }: PaymentMethodDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    image_url: '',
    display_order: 0,
    is_active: true,
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (method) {
      setFormData(method);
    } else {
      setFormData({ name: '', image_url: '', display_order: 0, is_active: true });
    }
  }, [method]);

  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (method) {
        const { error } = await supabase
          .from('payment_method_images')
          .update(data)
          .eq('id', method.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('payment_method_images')
          .insert([data]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-methods'] });
      toast({ title: method ? 'تم تحديث طريقة الدفع' : 'تم إضافة طريقة الدفع' });
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{method ? 'تعديل طريقة الدفع' : 'إضافة طريقة دفع'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>الاسم</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div>
            <Label>رابط الصورة</Label>
            <Input
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              placeholder="اترك فارغاً لعرض النص فقط"
            />
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