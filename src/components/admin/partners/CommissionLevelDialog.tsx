import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CommissionLevelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  level: any;
  onSuccess: () => void;
}

const colorOptions = [
  { value: 'bg-green-500', label: 'أخضر', class: 'bg-green-500' },
  { value: 'bg-blue-500', label: 'أزرق', class: 'bg-blue-500' },
  { value: 'bg-purple-500', label: 'بنفسجي', class: 'bg-purple-500' },
  { value: 'bg-orange-500', label: 'برتقالي', class: 'bg-orange-500' },
  { value: 'bg-teal-500', label: 'أزرق فاتح', class: 'bg-teal-500' },
  { value: 'bg-red-500', label: 'أحمر', class: 'bg-red-500' },
  { value: 'bg-yellow-500', label: 'أصفر', class: 'bg-yellow-500' },
  { value: 'bg-pink-500', label: 'وردي', class: 'bg-pink-500' },
  { value: 'bg-procell-accent', label: 'لون المتجر', class: 'bg-procell-accent' },
];

export function CommissionLevelDialog({
  open,
  onOpenChange,
  level,
  onSuccess,
}: CommissionLevelDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    examples: '',
    commission: '',
    calculation: '',
    color: 'bg-blue-500',
    display_order: 0,
    is_active: true,
  });

  useEffect(() => {
    if (level) {
      setFormData({
        category: level.category || '',
        examples: level.examples || '',
        commission: level.commission || '',
        calculation: level.calculation || '',
        color: level.color || 'bg-blue-500',
        display_order: level.display_order || 0,
        is_active: level.is_active !== false,
      });
    } else {
      setFormData({
        category: '',
        examples: '',
        commission: '',
        calculation: '',
        color: 'bg-blue-500',
        display_order: 0,
        is_active: true,
      });
    }
  }, [level, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (level) {
        const { error } = await supabase
          .from('commission_levels')
          .update(formData)
          .eq('id', level.id);

        if (error) throw error;
        toast({ title: 'تم تحديث مستوى العمولة بنجاح!' });
      } else {
        const { error } = await supabase
          .from('commission_levels')
          .insert([formData]);

        if (error) throw error;
        toast({ title: 'تم إضافة مستوى العمولة بنجاح!' });
      }

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
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
            {level ? 'تعديل مستوى العمولة' : 'إضافة مستوى عمولة جديد'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">اسم المستوى *</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
              placeholder="مثال: مبتدئ، متقدم، خبير"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="commission">العمولة *</Label>
              <Input
                id="commission"
                value={formData.commission}
                onChange={(e) => setFormData({ ...formData, commission: e.target.value })}
                required
                placeholder="مثال: 8% أو 12%"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="calculation">المبيعات الشهرية *</Label>
              <Input
                id="calculation"
                value={formData.calculation}
                onChange={(e) => setFormData({ ...formData, calculation: e.target.value })}
                required
                placeholder="مثال: 0 - 10,000 ₪"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="examples">المزايا المتاحة *</Label>
            <Textarea
              id="examples"
              value={formData.examples}
              onChange={(e) => setFormData({ ...formData, examples: e.target.value })}
              required
              placeholder="اكتب كل ميزة في سطر منفصل&#10;مثال:&#10;دعم فني أساسي&#10;مواد تسويقية&#10;تدريب مجاني"
              rows={5}
            />
            <p className="text-xs text-muted-foreground">
              اكتب كل ميزة في سطر منفصل
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="color">اللون</Label>
              <Select
                value={formData.color}
                onValueChange={(value) => setFormData({ ...formData, color: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {colorOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 ${option.class} rounded-full`}></div>
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="display_order">ترتيب العرض</Label>
              <Input
                id="display_order"
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                min={0}
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

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              إلغاء
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'جاري الحفظ...' : level ? 'تحديث' : 'إضافة'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
