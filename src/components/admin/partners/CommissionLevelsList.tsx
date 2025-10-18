import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, GripVertical } from 'lucide-react';
import { CommissionLevelDialog } from './CommissionLevelDialog';
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

export function CommissionLevelsList() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<any>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string | null }>({
    open: false,
    id: null,
  });

  const { data: levels = [], isLoading } = useQuery({
    queryKey: ['commission-levels'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('commission_levels')
        .select('*')
        .order('display_order', { ascending: true })
        .returns<any[]>();

      if (error) throw error;
      return data ?? [];
    },
  });

  const handleAdd = () => {
    setSelectedLevel(null);
    setDialogOpen(true);
  };

  const handleEdit = (level: any) => {
    setSelectedLevel(level);
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteDialog.id) return;

    try {
      const { error } = await (supabase as any)
        .from('commission_levels')
        .delete()
        .eq('id' as any, deleteDialog.id as any);

      if (error) throw error;

      toast({ title: 'تم حذف مستوى العمولة بنجاح!' });
      queryClient.invalidateQueries({ queryKey: ['commission-levels'] });
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
    queryClient.invalidateQueries({ queryKey: ['commission-levels'] });
  };

  if (isLoading) {
    return <div className="text-center py-8">جاري التحميل...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">مستويات برنامج العمولة</h2>
        <Button onClick={handleAdd}>
          <Plus className="ml-2 h-4 w-4" />
          إضافة مستوى عمولة
        </Button>
      </div>

      {levels.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">
          لا توجد مستويات عمولة. أضف مستوى جديد للبدء!
        </Card>
      ) : (
        <div className="space-y-4">
          {levels.map((level) => (
            <Card key={level.id} className="p-6">
              <div className="flex items-start gap-4">
                <div className="cursor-grab">
                  <GripVertical className="h-5 w-5 text-muted-foreground" />
                </div>
                
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="text-lg font-semibold">{level.category}</h3>
                      <p className="text-sm text-muted-foreground">{level.examples}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-procell-secondary text-white text-base px-4 py-1">
                        {level.commission}
                      </Badge>
                      {!level.is_active && (
                        <Badge variant="secondary">غير نشط</Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 ${level.color} rounded-full`}></div>
                        <span className="text-xs text-muted-foreground">{level.calculation}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        ترتيب: {level.display_order}
                      </Badge>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(level)}
                      >
                        <Pencil className="h-4 w-4 ml-2" />
                        تعديل
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeleteDialog({ open: true, id: level.id })}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <CommissionLevelDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        level={selectedLevel}
        onSuccess={onSuccess}
      />

      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, id: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف مستوى العمولة بشكل نهائي ولا يمكن التراجع عن هذا الإجراء.
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
