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
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface SupplierDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  supplier: any;
  onSuccess: () => void;
}

const colorOptions = [
  { value: 'bg-blue-500', label: 'أزرق', class: 'bg-blue-500' },
  { value: 'bg-teal-500', label: 'أزرق فاتح', class: 'bg-teal-500' },
  { value: 'bg-green-500', label: 'أخضر', class: 'bg-green-500' },
  { value: 'bg-orange-500', label: 'برتقالي', class: 'bg-orange-500' },
  { value: 'bg-purple-500', label: 'بنفسجي', class: 'bg-purple-500' },
  { value: 'bg-red-500', label: 'أحمر', class: 'bg-red-500' },
  { value: 'bg-pink-500', label: 'وردي', class: 'bg-pink-500' },
  { value: 'bg-yellow-500', label: 'أصفر', class: 'bg-yellow-500' },
];

export function SupplierDialog({
  open,
  onOpenChange,
  supplier,
  onSuccess,
}: SupplierDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    name_en: '',
    category: '',
    description: '',
    logo_url: '',
    logo_color: 'bg-blue-500',
    brands: [] as Array<{ name: string; logo_url?: string }>,
    display_order: 0,
    is_active: true,
  });
  const [newBrand, setNewBrand] = useState('');
  const [newBrandLogo, setNewBrandLogo] = useState('');

  useEffect(() => {
    if (supplier) {
      setFormData({
        name: supplier.name || '',
        name_en: supplier.name_en || '',
        category: supplier.category || '',
        description: supplier.description || '',
        logo_url: supplier.logo_url || '',
        logo_color: supplier.logo_color || 'bg-blue-500',
        brands: supplier.brands || [],
        display_order: supplier.display_order || 0,
        is_active: supplier.is_active !== false,
      });
    } else {
      setFormData({
        name: '',
        name_en: '',
        category: '',
        description: '',
        logo_url: '',
        logo_color: 'bg-blue-500',
        brands: [],
        display_order: 0,
        is_active: true,
      });
    }
  }, [supplier, open]);

  const handleAddBrand = () => {
    if (newBrand.trim() && !formData.brands.some(b => b.name === newBrand.trim())) {
      setFormData({
        ...formData,
        brands: [...formData.brands, { name: newBrand.trim(), logo_url: newBrandLogo.trim() || undefined }],
      });
      setNewBrand('');
      setNewBrandLogo('');
    }
  };

  const handleRemoveBrand = (brandName: string) => {
    setFormData({
      ...formData,
      brands: formData.brands.filter((b) => b.name !== brandName),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSubmit = {
        ...formData,
        name_en: formData.name_en || null,
      };

      if (supplier) {
        const { error } = await supabase
          .from('suppliers')
          .update(dataToSubmit)
          .eq('id', supplier.id);

        if (error) throw error;
        toast({ title: 'تم تحديث المورد بنجاح!' });
      } else {
        const { error } = await supabase
          .from('suppliers')
          .insert([dataToSubmit]);

        if (error) throw error;
        toast({ title: 'تم إضافة المورد بنجاح!' });
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
            {supplier ? 'تعديل المورد' : 'إضافة مورد جديد'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">الاسم بالعربي *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="مثال: سوبرلينك"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name_en">الاسم بالإنجليزي</Label>
              <Input
                id="name_en"
                value={formData.name_en}
                onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                placeholder="SUPERLINK"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">الفئة *</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
              placeholder="مثال: الموردين المتخصصين، مورد متعدد العلامات، شريك استراتيجي"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">الوصف *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              placeholder="وصف موجز عن المورد..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="logo_url">رابط اللوجو (اختياري)</Label>
            <Input
              id="logo_url"
              value={formData.logo_url}
              onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
              placeholder="https://example.com/logo.png"
              type="url"
            />
            {formData.logo_url && (
              <div className="mt-2 p-2 border rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground mb-1">معاينة اللوجو:</p>
                <img 
                  src={formData.logo_url} 
                  alt="معاينة اللوجو" 
                  className="h-16 w-auto object-contain mx-auto"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="logo_color">لون الشعار (يستخدم في حال عدم وجود لوجو)</Label>
            <Select
              value={formData.logo_color}
              onValueChange={(value) => setFormData({ ...formData, logo_color: value })}
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
            <Label>العلامات التجارية</Label>
            <div className="space-y-2">
              <Input
                value={newBrand}
                onChange={(e) => setNewBrand(e.target.value)}
                placeholder="اسم العلامة التجارية"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddBrand();
                  }
                }}
              />
              <Input
                value={newBrandLogo}
                onChange={(e) => setNewBrandLogo(e.target.value)}
                placeholder="رابط شعار العلامة التجارية (اختياري)"
                type="url"
              />
              <Button type="button" onClick={handleAddBrand} className="w-full">
                إضافة علامة تجارية
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.brands.map((brand) => (
                <Badge key={brand.name} variant="secondary" className="gap-2 py-2 px-3">
                  {brand.logo_url && (
                    <img 
                      src={brand.logo_url} 
                      alt={brand.name}
                      className="h-4 w-4 object-contain"
                    />
                  )}
                  {brand.name}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleRemoveBrand(brand.name)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
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

            <div className="flex items-center space-x-2 space-x-reverse pt-8">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label htmlFor="is_active">نشط</Label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              إلغاء
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'جاري الحفظ...' : supplier ? 'تحديث' : 'إضافة'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}