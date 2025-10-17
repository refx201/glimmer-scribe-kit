import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import SlidingPhotoDialog from "./SlidingPhotoDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { SlidingPhoto } from "@/types/slidingPhotos";
import { executeSql } from "@/utils/supabaseHelpers";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const SlidingPhotosList = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<SlidingPhoto | null>(null);
  const [photoToDelete, setPhotoToDelete] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: photos = [], isLoading } = useQuery<SlidingPhoto[]>({
    queryKey: ["sliding-photos"],
    queryFn: async () => {
      try {
        const { data, error } = await executeSql(
          `SELECT * FROM sliding_photos ORDER BY created_at DESC`
        );

        if (error) {
          console.error("Error fetching sliding photos:", error);
          throw error;
        }
        return (data || []) as SlidingPhoto[];
      } catch (err) {
        console.error("Error in sliding photos list:", err);
        return [];
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log("Attempting to delete photo with ID:", id);
      
      const query = `SELECT delete_sliding_photo('${id}')`;
      console.log("Executing delete query:", query);
      
      const { error, data } = await executeSql(query);
      console.log("Delete response:", { error, data });
      
      if (error) {
        console.error("Delete error:", error);
        throw error;
      }
      return id;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Photo deleted successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["sliding-photos"] });
      queryClient.invalidateQueries({ queryKey: ["hero-sliding-photos"] });
    },
    onError: (error: any) => {
      console.error("Delete error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete photo",
      });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, currentValue }: { id: string; currentValue: boolean }) => {
      const newValue = !currentValue;
      
      const query = `SELECT toggle_sliding_photo_active('${id}', ${newValue})`;
      console.log("Executing toggle active query:", query);
      
      const { error, data } = await executeSql(query);
      console.log("Toggle response:", { error, data });

      if (error) {
        console.error("Toggle active error:", error);
        throw error;
      }
      return { id, newValue };
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: `Photo ${data.newValue ? "activated" : "deactivated"} successfully!`,
      });
      queryClient.invalidateQueries({ queryKey: ["sliding-photos"] });
      queryClient.invalidateQueries({ queryKey: ["hero-sliding-photos"] });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update photo status",
      });
    },
  });

  const seedMutation = useMutation({
    mutationFn: async () => {
      // Default slides collected from existing static hero sections with button fields
      const slides = [
        { title: "عرض خاص", image_url: "/hero-slide-1.png", link: "/products", button1_text: "تسوق الآن", button1_link: "/products", button2_text: "تواصل معنا", button2_link: "/contact" },
        { title: "🔥 عروض حصرية على الهواتف الذكية", image_url: "https://images.unsplash.com/photo-1511227682637-ddb98c43c42c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NTUxOTQ2NTV8MA&ixlib=rb-4.1.0&q=80&w=1080", link: "/offers", button1_text: "شاهد العروض", button1_link: "/offers", button2_text: "تواصل معنا", button2_link: "/contact" },
        { title: "🎁 باقات الإكسسوارات المتكاملة", image_url: "https://images.unsplash.com/photo-1647334864689-e140efbfd51f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaG9uZSUyMGFjY2Vzc29yaWVzJTIwbGlmZXN0eWxlfGVufDF8fHx8MTc1NTE5OTk2M3ww&ixlib=rb-4.1.0&q=80&w=1080", link: "/offers", button1_text: "تسوق الباقات", button1_link: "/offers", button2_text: "المزيد", button2_link: "/products" },
        { title: "🔧 خدمات الصيانة الاحترافية", image_url: "https://images.unsplash.com/photo-1552098904-72d422955307?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaG9uZSUyMHJlcGFpciUyMHNlcnZpY2V8ZW58MXx8fHwxNzU1MTk5OTY2fDA&ixlib=rb-4.1.0&q=80&w=1080", link: "/maintenance", button1_text: "احجز الآن", button1_link: "/contact", button2_text: "اعرف المزيد", button2_link: "/maintenance" },
        { title: "💰 برنامج شركاء النجاح", image_url: "https://images.unsplash.com/photo-1650978810653-112cb6018092?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHBhcnRuZXJzaGlwJTIwc3VjY2Vzc3xlbnwxfHx8fDE3NTUxNTU2ODZ8MA&ixlib=rb-4.1.0&q=80&w=1080", link: "/partners", button1_text: "انضم الآن", button1_link: "/partners", button2_text: "تواصل معنا", button2_link: "/contact" },
        { title: "📱 هواتف بريميوم حصرية", image_url: "https://images.unsplash.com/photo-1646872920793-4434b18747cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwbW9iaWxlJTIwcGhvbmV8ZW58MXx8fHwxNzU1MTk5OTcxfDA&ixlib=rb-4.1.0&q=80&w=1080", link: "/offers", button1_text: "تسوق الآن", button1_link: "/offers", button2_text: "عرض الكل", button2_link: "/products" },
        { title: "أحدث الهواتف الذكية", image_url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&h=800&fit=crop&crop=center", link: "/offers", button1_text: "تسوق الآن", button1_link: "/products", button2_text: "العروض", button2_link: "/offers" },
        { title: "انضم لبرنامج الشراكة", image_url: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&h=800&fit=crop&crop=center", link: "/partners", button1_text: "سجل الآن", button1_link: "/partners", button2_text: "تواصل معنا", button2_link: "/contact" },
        { title: "خدمات الصيانة المتقدمة", image_url: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1200&h=800&fit=crop&crop=center", link: "/contact", button1_text: "احجز موعد", button1_link: "/contact", button2_text: "الخدمات", button2_link: "/maintenance" },
      ];

      const esc = (s: string) => s.replace(/'/g, "''");
      const valuesSql = slides
        .map((s) => `('${esc(s.title)}','${esc(s.image_url)}', true, '${esc(s.link)}', '', '${esc(s.button1_text)}', '${esc(s.button1_link)}', '${esc(s.button2_text)}', '${esc(s.button2_link)}')`)
        .join(',');

      const query = `SELECT insert_sliding_photo(title, image_url, is_active, link, description, button1_text, button1_link, button2_text, button2_link)
        FROM (VALUES ${valuesSql}) AS s(title, image_url, is_active, link, description, button1_text, button1_link, button2_text, button2_link)`;

      const { error, data } = await executeSql(query);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({ title: 'تم الاستيراد', description: 'تمت إضافة الشرائح الافتراضية بنجاح.' });
      queryClient.invalidateQueries({ queryKey: ['sliding-photos'] });
      queryClient.invalidateQueries({ queryKey: ['hero-sliding-photos'] });
    },
    onError: (error: any) => {
      toast({ variant: 'destructive', title: 'فشل الاستيراد', description: error?.message || 'تعذر استيراد الشرائح.' });
    }
  });

  const handleSeedSlides = () => seedMutation.mutate();

  const handleDelete = (id: string) => {
    setPhotoToDelete(id);
  };

  const confirmDelete = () => {
    if (photoToDelete) {
      deleteMutation.mutate(photoToDelete);
      setPhotoToDelete(null);
    }
  };

  const handleToggleActive = (id: string, currentValue: boolean) => {
    toggleActiveMutation.mutate({ id, currentValue });
  };

  const handleEdit = (photo: SlidingPhoto) => {
    setEditingPhoto(photo);
    setShowDialog(true);
  };

  const handleDialogClose = () => {
    setShowDialog(false);
    setEditingPhoto(null);
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading photos...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">الصور المتحركة</h2>
        <div className="flex items-center gap-2">
          <Button onClick={() => setShowDialog(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            إضافة صورة جديدة
          </Button>
          <Button variant="outline" className="gap-2" onClick={handleSeedSlides} disabled={seedMutation.isPending}>
            {!seedMutation.isPending ? 'استيراد الشرائح الافتراضية' : 'جاري الاستيراد...'}
          </Button>
        </div>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingPhoto ? 'تعديل الصورة' : 'إضافة صورة جديدة'}</DialogTitle>
          </DialogHeader>
          <SlidingPhotoDialog
            onSuccess={handleDialogClose}
            onCancel={handleDialogClose}
            editingPhoto={editingPhoto || undefined}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!photoToDelete} onOpenChange={(open) => !open && setPhotoToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد من حذف هذه الصورة؟</AlertDialogTitle>
            <AlertDialogDescription>
              هذا الإجراء لا يمكن التراجع عنه. سيتم حذف الصورة نهائيًا.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {photos.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          لا توجد صور متحركة. أضف صورة للبدء!
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الصورة</TableHead>
              <TableHead>العنوان</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead>تاريخ الإضافة</TableHead>
              <TableHead>إدارة</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {photos.map((photo) => (
              <TableRow key={photo.id}>
                <TableCell>
                  <img 
                    src={photo.image_url} 
                    alt={photo.title || "Sliding photo"} 
                    className="h-12 w-20 object-cover rounded"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://placehold.co/600x400?text=Invalid+Image";
                    }}
                  />
                </TableCell>
                <TableCell className="font-medium">{photo.title || "بدون عنوان"}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={photo.is_active}
                      onCheckedChange={() => handleToggleActive(photo.id, photo.is_active)}
                    />
                    <span>{photo.is_active ? 'نشط' : 'غير نشط'}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(photo.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(photo)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(photo.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default SlidingPhotosList;