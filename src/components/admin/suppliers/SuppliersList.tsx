import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, GripVertical } from 'lucide-react';
import { SupplierDialog } from './SupplierDialog';
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

export function SuppliersList() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string | null }>({
    open: false,
    id: null,
  });

  const { data: suppliers = [], isLoading } = useQuery({
    queryKey: ['suppliers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  const handleAdd = () => {
    setSelectedSupplier(null);
    setDialogOpen(true);
  };

  const handleEdit = (supplier: any) => {
    setSelectedSupplier(supplier);
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteDialog.id) return;

    try {
      const { error } = await supabase
        .from('suppliers')
        .delete()
        .eq('id', deleteDialog.id);

      if (error) throw error;

      toast({ title: 'تم حذف المورد بنجاح!' });
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      setDeleteDialog({ open: false, id: null });
    } catch (error: any) {
      toast({
        title: 'حدث خطأ',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const onSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['suppliers'] });
  };

  if (isLoading) {
    return <div className="text-center py-8">جاري التحميل...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">الموردين والوكلاء</h2>
        <Button onClick={handleAdd}>
          <Plus className="ml-2 h-4 w-4" />
          إضافة مورد
        </Button>
      </div>

      {suppliers.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">
          لا توجد موردين. أضف مورد جديد للبدء!
        </Card>
      ) : (
        <div className="space-y-4">
          {suppliers.map((supplier) => (
            <Card key={supplier.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="cursor-grab">
                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                  </div>

                  <div
                    className={`${supplier.logo_color} text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg shrink-0`}
                  >
                    {supplier.logo_url ? (
                      <img
                        src={supplier.logo_url}
                        alt={supplier.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      supplier.name_en?.charAt(0) || supplier.name.charAt(0)
                    )}
                  </div>

                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold">{supplier.name}</h3>
                          {supplier.name_en && (
                            <span className="text-sm text-muted-foreground">
                              ({supplier.name_en})
                            </span>
                          )}
                        </div>
                        <Badge variant="outline">{supplier.category}</Badge>
                        <p className="text-sm text-muted-foreground mt-2">
                          {supplier.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {!supplier.is_active && (
                          <Badge variant="secondary">غير نشط</Badge>
                        )}
                      </div>
                    </div>

                    {supplier.brands && Array.isArray(supplier.brands) && supplier.brands.length > 0 && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-2">العلامات التجارية:</p>
                        <div className="flex flex-wrap gap-2">
                          {supplier.brands.map((brand: any, index: number) => {
                            const brandName = typeof brand === 'string' ? brand : brand.name;
                            const brandLogo = typeof brand === 'object' ? brand.logo_url : undefined;
                            
                            return (
                              <Badge key={`${brandName}-${index}`} className="bg-primary/10 text-primary gap-2">
                                {brandLogo && (
                                  <img 
                                    src={brandLogo} 
                                    alt={brandName}
                                    className="h-4 w-4 object-contain"
                                  />
                                )}
                                {brandName}
                              </Badge>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 gap-4">
                      <Badge variant="outline" className="text-xs">
                        ترتيب: {supplier.display_order}
                      </Badge>

                      <div className="flex flex-col gap-2 min-w-[120px]">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(supplier)}
                          className="w-full justify-start"
                        >
                          <Pencil className="h-4 w-4 ml-2" />
                          تعديل
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setDeleteDialog({ open: true, id: supplier.id })}
                          className="w-full justify-start"
                        >
                          <Trash2 className="h-4 w-4 ml-2" />
                          حذف
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <SupplierDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        supplier={selectedSupplier}
        onSuccess={onSuccess}
      />

      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, id: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف المورد بشكل نهائي ولا يمكن التراجع عن هذا الإجراء.
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