import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Star, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MaintenanceTestimonialDialog } from "./MaintenanceTestimonialDialog";

interface MaintenanceTestimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  comment: string;
  avatar_url?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export function MaintenanceTestimonialsList() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTestimonial, setSelectedTestimonial] = useState<MaintenanceTestimonial | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: testimonials, isLoading } = useQuery({
    queryKey: ["maintenance-testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("maintenance_testimonials")
        .select("*")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as MaintenanceTestimonial[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("maintenance_testimonials")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenance-testimonials"] });
      toast({
        title: "نجاح",
        description: "تم حذف التقييم بنجاح",
      });
      setDeleteId(null);
    },
    onError: (error) => {
      toast({
        title: "خطأ",
        description: "فشل حذف التقييم",
        variant: "destructive",
      });
      console.error("Delete error:", error);
    },
  });

  const handleAdd = () => {
    setSelectedTestimonial(null);
    setDialogOpen(true);
  };

  const handleEdit = (testimonial: MaintenanceTestimonial) => {
    setSelectedTestimonial(testimonial);
    setDialogOpen(true);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              إدارة تقييمات الصيانة ({testimonials?.length || 0})
            </CardTitle>
            <Button onClick={handleAdd}>
              <Plus className="h-4 w-4 ml-2" />
              إضافة تقييم صيانة
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {!testimonials || testimonials.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64">
              <Wrench className="h-16 w-16 text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">لا توجد تقييمات للصيانة</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الاسم</TableHead>
                  <TableHead>الموقع</TableHead>
                  <TableHead>التقييم</TableHead>
                  <TableHead>التعليق</TableHead>
                  <TableHead>الترتيب</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>التاريخ</TableHead>
                  <TableHead className="text-right">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testimonials.map((testimonial) => (
                  <TableRow key={testimonial.id}>
                    <TableCell className="font-medium">{testimonial.name}</TableCell>
                    <TableCell>{testimonial.location}</TableCell>
                    <TableCell>{renderStars(testimonial.rating)}</TableCell>
                    <TableCell className="max-w-xs">
                      <p className="line-clamp-2 text-sm">{testimonial.comment}</p>
                    </TableCell>
                    <TableCell>{testimonial.display_order}</TableCell>
                    <TableCell>
                      <Badge variant={testimonial.is_active ? "default" : "secondary"}>
                        {testimonial.is_active ? "نشط" : "غير نشط"}
                      </Badge>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm">
                      {new Date(testimonial.created_at).toLocaleDateString('ar')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(testimonial)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <AlertDialog
                          open={deleteId === testimonial.id}
                          onOpenChange={(open) => setDeleteId(open ? testimonial.id : null)}
                        >
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>حذف التقييم</AlertDialogTitle>
                              <AlertDialogDescription>
                                هل أنت متأكد من حذف هذا التقييم؟ لا يمكن التراجع عن هذا الإجراء.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>إلغاء</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteMutation.mutate(testimonial.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                حذف
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <MaintenanceTestimonialDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        testimonial={selectedTestimonial}
      />
    </>
  );
}