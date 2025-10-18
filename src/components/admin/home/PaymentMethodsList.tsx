import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PaymentMethodDialog } from './PaymentMethodDialog';

export function PaymentMethodsList() {
  const [editingMethod, setEditingMethod] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: methods, isLoading } = useQuery({
    queryKey: ['payment-methods'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payment_method_images')
        .select('*')
        .order('display_order');
      if (error) throw error;
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('payment_method_images')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-methods'] });
      toast({ title: 'تم حذف طريقة الدفع بنجاح' });
    },
    onError: () => {
      toast({ title: 'خطأ في حذف طريقة الدفع', variant: 'destructive' });
    },
  });

  const handleEdit = (method: any) => {
    setEditingMethod(method);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingMethod(null);
    setIsDialogOpen(true);
  };

  if (isLoading) return <div>جاري التحميل...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">طرق الدفع الآمنة</h3>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 ml-2" />
          إضافة طريقة دفع
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>الاسم</TableHead>
            <TableHead>الصورة</TableHead>
            <TableHead>الترتيب</TableHead>
            <TableHead>الحالة</TableHead>
            <TableHead>الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {methods?.map((method) => (
            <TableRow key={method.id}>
              <TableCell>{method.name}</TableCell>
              <TableCell>
                {method.image_url ? (
                  <img src={method.image_url} alt={method.name} className="h-8 w-auto" />
                ) : (
                  <ImageIcon className="h-8 w-8 text-gray-400" />
                )}
              </TableCell>
              <TableCell>{method.display_order}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded text-xs ${method.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {method.is_active ? 'نشط' : 'معطل'}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(method)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteMutation.mutate(method.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <PaymentMethodDialog
        method={editingMethod}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
}