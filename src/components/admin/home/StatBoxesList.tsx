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
import { StatBoxDialog } from './StatBoxDialog';

export function StatBoxesList() {
  const [editingBox, setEditingBox] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<'home' | 'trade_in' | 'purchase' | 'maintenance'>('home');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: boxes, isLoading } = useQuery({
    queryKey: ['stat-boxes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stat_boxes')
        .select('*')
        .order('page')
        .order('display_order');
      if (error) throw error;
      return data;
    },
  });

  // Filter boxes by current page
  const filteredBoxes = boxes?.filter(box => box.page === currentPage) || [];

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('stat_boxes')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stat-boxes'] });
      toast({ title: 'تم حذف الصندوق بنجاح' });
    },
    onError: () => {
      toast({ title: 'خطأ في حذف الصندوق', variant: 'destructive' });
    },
  });

  const handleEdit = (box: any) => {
    setEditingBox(box);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingBox({ page: currentPage });
    setIsDialogOpen(true);
  };

  const getPageName = (page: string) => {
    const names = {
      home: 'الصفحة الرئيسية',
      trade_in: 'صفحة الاستبدال',
      purchase: 'صفحة الشراء',
      maintenance: 'صفحة الصيانة'
    };
    return names[page as keyof typeof names] || page;
  };

  if (isLoading) return <div>جاري التحميل...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">صناديق الإحصائيات</h3>
      </div>

      <Tabs value={currentPage} onValueChange={(v) => setCurrentPage(v as any)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="home">الرئيسية</TabsTrigger>
          <TabsTrigger value="trade_in">الاستبدال</TabsTrigger>
          <TabsTrigger value="purchase">الشراء</TabsTrigger>
          <TabsTrigger value="maintenance">الصيانة</TabsTrigger>
        </TabsList>

        <TabsContent value={currentPage} className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-base font-medium text-muted-foreground">
              {getPageName(currentPage)}
            </h4>
            <Button onClick={handleAdd}>
              <Plus className="h-4 w-4 ml-2" />
              إضافة صندوق
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الرقم</TableHead>
                <TableHead>النص</TableHead>
                <TableHead>الأيقونة</TableHead>
                <TableHead>اللون</TableHead>
                <TableHead>الترتيب</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBoxes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    لا توجد صناديق إحصائيات لهذه الصفحة
                  </TableCell>
                </TableRow>
              ) : (
                filteredBoxes.map((box) => (
                  <TableRow key={box.id}>
                    <TableCell className="font-bold">{box.number}</TableCell>
                    <TableCell>{box.label}</TableCell>
                    <TableCell>{box.icon}</TableCell>
                    <TableCell>
                      <span className={box.color}>{box.color}</span>
                    </TableCell>
                    <TableCell>{box.display_order}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs ${box.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {box.is_active ? 'نشط' : 'معطل'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(box)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteMutation.mutate(box.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>

      <StatBoxDialog
        box={editingBox}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
}