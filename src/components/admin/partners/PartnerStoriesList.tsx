import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Star } from 'lucide-react';
import { PartnerStoryDialog } from './PartnerStoryDialog';
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

export function PartnerStoriesList() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedStory, setSelectedStory] = useState<any>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string | null }>({
    open: false,
    id: null,
  });

  const { data: stories = [], isLoading } = useQuery({
    queryKey: ['partner-success-stories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('partner_success_stories')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false })
        .returns<any[]>();

      if (error) throw error;
      return data ?? [];
    },
  });

  const handleAdd = () => {
    setSelectedStory(null);
    setDialogOpen(true);
  };

  const handleEdit = (story: any) => {
    setSelectedStory(story);
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteDialog.id) return;

    try {
      const { error } = await (supabase as any)
        .from('partner_success_stories')
        .delete()
        .eq('id' as any, deleteDialog.id as any);

      if (error) throw error;

      toast({ title: 'تم حذف قصة النجاح بنجاح!' });
      queryClient.invalidateQueries({ queryKey: ['partner-success-stories'] });
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
    queryClient.invalidateQueries({ queryKey: ['partner-success-stories'] });
  };

  if (isLoading) {
    return <div className="text-center py-8">جاري التحميل...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">قصص نجاح الشركاء</h2>
        <Button onClick={handleAdd}>
          <Plus className="ml-2 h-4 w-4" />
          إضافة قصة نجاح
        </Button>
      </div>

      {stories.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">
          لا توجد قصص نجاح. أضف قصة جديدة للبدء!
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story) => (
            <Card key={story.id} className="overflow-hidden">
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-12 w-12">
                      {story.partner_image && (
                        <AvatarImage src={story.partner_image} alt={story.partner_name} />
                      )}
                      <AvatarFallback>{story.partner_name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{story.partner_name}</h3>
                      <p className="text-sm text-muted-foreground">{story.partner_role}</p>
                    </div>
                  </div>
                  {!story.is_active && (
                    <Badge variant="secondary">غير نشط</Badge>
                  )}
                </div>

                <div className="bg-muted/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-primary">
                    {story.revenue} ₪
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {story.revenue_label}
                  </div>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-3">
                  {story.testimonial}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < story.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  {story.date && (
                    <span className="text-xs text-muted-foreground">{story.date}</span>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(story)}
                    className="flex-1"
                  >
                    <Pencil className="h-4 w-4 ml-2" />
                    تعديل
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeleteDialog({ open: true, id: story.id })}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <PartnerStoryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        story={selectedStory}
        onSuccess={onSuccess}
      />

      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, id: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف قصة النجاح بشكل نهائي ولا يمكن التراجع عن هذا الإجراء.
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