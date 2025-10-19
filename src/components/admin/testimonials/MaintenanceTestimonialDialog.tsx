import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Star } from "lucide-react";

interface MaintenanceTestimonial {
  id?: string;
  name: string;
  location: string;
  rating: number;
  comment: string;
  avatar_url?: string;
  display_order: number;
  is_active: boolean;
}

interface MaintenanceTestimonialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  testimonial?: MaintenanceTestimonial | null;
}

export function MaintenanceTestimonialDialog({ open, onOpenChange, testimonial }: MaintenanceTestimonialDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<MaintenanceTestimonial>({
    name: "",
    location: "",
    rating: 5,
    comment: "",
    avatar_url: "",
    display_order: 0,
    is_active: true,
  });

  useEffect(() => {
    if (testimonial?.id) {
      setFormData({
        name: testimonial.name || "",
        location: testimonial.location || "",
        rating: testimonial.rating || 5,
        comment: testimonial.comment || "",
        avatar_url: testimonial.avatar_url || "",
        display_order: testimonial.display_order || 0,
        is_active: testimonial.is_active ?? true,
      });
    } else {
      setFormData({
        name: "",
        location: "",
        rating: 5,
        comment: "",
        avatar_url: "",
        display_order: 0,
        is_active: true,
      });
    }
  }, [testimonial, open]);

  const saveMutation = useMutation({
    mutationFn: async (data: MaintenanceTestimonial) => {
      if (testimonial?.id) {
        const { error } = await supabase
          .from("maintenance_testimonials")
          .update(data)
          .eq("id", testimonial.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("maintenance_testimonials")
          .insert([data]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenance-testimonials"] });
      toast({
        title: "نجاح",
        description: testimonial?.id ? "تم تحديث التقييم بنجاح" : "تم إضافة التقييم بنجاح",
      });
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: "خطأ",
        description: "فشل حفظ التقييم",
        variant: "destructive",
      });
      console.error("Save error:", error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {testimonial?.id ? "تعديل تقييم الصيانة" : "إضافة تقييم صيانة جديد"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">اسم العميل *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">الموقع *</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rating">التقييم (1-5)</Label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-6 w-6 cursor-pointer ${
                    star <= formData.rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                  onClick={() => setFormData({ ...formData, rating: star })}
                />
              ))}
              <span className="mr-2 text-sm text-muted-foreground">
                {formData.rating} نجوم
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">التعليق *</Label>
            <Textarea
              id="comment"
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              required
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="avatar_url">رابط الصورة الشخصية</Label>
            <Input
              id="avatar_url"
              type="url"
              value={formData.avatar_url}
              onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
              placeholder="https://example.com/avatar.jpg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="display_order">ترتيب العرض</Label>
            <Input
              id="display_order"
              type="number"
              value={formData.display_order}
              onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
            />
            <Label htmlFor="is_active">نشط</Label>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              إلغاء
            </Button>
            <Button type="submit" disabled={saveMutation.isPending}>
              {saveMutation.isPending ? "جاري الحفظ..." : "حفظ"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}