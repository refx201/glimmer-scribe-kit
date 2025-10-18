import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { FilterCategoryDialog } from './FilterCategoryDialog';

export function FilterCategoriesList() {
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [categoryType, setCategoryType] = useState<'device' | 'accessory'>('device');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: categories, isLoading } = useQuery({
    queryKey: ['filter-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_filter_categories')
        .select('*')
        .order('display_order');
      if (error) throw error;
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('product_filter_categories')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['filter-categories'] });
      toast({ title: 'تم حذف الفئة بنجاح' });
    },
    onError: () => {
      toast({ title: 'خطأ في حذف الفئة', variant: 'destructive' });
    },
  });

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setIsDialogOpen(true);
  };

  const handleAdd = (type: 'device' | 'accessory') => {
    setCategoryType(type);
    setEditingCategory(null);
    setIsDialogOpen(true);
  };

  const deviceCategories = categories?.filter(c => c.type === 'device') || [];
  const accessoryCategories = categories?.filter(c => c.type === 'accessory') || [];

  if (isLoading) return <div>جاري التحميل...</div>;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">فئات الفلاتر</h3>
      
      <Tabs defaultValue="devices">
        <TabsList>
          <TabsTrigger value="devices">فئات الأجهزة</TabsTrigger>
          <TabsTrigger value="accessories">فئات الإكسسوارات</TabsTrigger>
        </TabsList>

        <TabsContent value="devices" className="space-y-4">
          <Button onClick={() => handleAdd('device')}>
            <Plus className="h-4 w-4 ml-2" />
            إضافة فئة جهاز
          </Button>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الاسم</TableHead>
                <TableHead>الأيقونة</TableHead>
                <TableHead>الترتيب</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deviceCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{category.icon}</TableCell>
                  <TableCell>{category.display_order}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs ${category.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {category.is_active ? 'نشط' : 'معطل'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(category)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteMutation.mutate(category.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="accessories" className="space-y-4">
          <Button onClick={() => handleAdd('accessory')}>
            <Plus className="h-4 w-4 ml-2" />
            إضافة فئة إكسسوار
          </Button>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الاسم</TableHead>
                <TableHead>الأيقونة</TableHead>
                <TableHead>الترتيب</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accessoryCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{category.icon}</TableCell>
                  <TableCell>{category.display_order}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs ${category.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {category.is_active ? 'نشط' : 'معطل'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(category)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteMutation.mutate(category.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>

      <FilterCategoryDialog
        category={editingCategory}
        type={categoryType}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
}