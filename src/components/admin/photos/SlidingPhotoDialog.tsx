import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { SlidingPhoto } from "@/types/slidingPhotos";
import { executeSql } from "@/utils/supabaseHelpers";

interface SlidingPhotoDialogProps {
  onSuccess: () => void;
  onCancel: () => void;
  editingPhoto?: SlidingPhoto;
}

const SlidingPhotoDialog = ({
  onSuccess,
  onCancel,
  editingPhoto,
}: SlidingPhotoDialogProps) => {
  const [title, setTitle] = useState(editingPhoto?.title || "");
  const [description, setDescription] = useState(editingPhoto?.description || "");
  const [isActive, setIsActive] = useState(
    editingPhoto ? editingPhoto.is_active : true
  );
  const [imageUrl, setImageUrl] = useState(editingPhoto?.image_url || "");
  const [link, setLink] = useState(editingPhoto?.link || "");
  const [button1Text, setButton1Text] = useState(editingPhoto?.button1_text || "تسوق الآن");
  const [button1Link, setButton1Link] = useState(editingPhoto?.button1_link || "/products");
  const [button2Text, setButton2Text] = useState(editingPhoto?.button2_text || "تواصل معنا");
  const [button2Link, setButton2Link] = useState(editingPhoto?.button2_link || "/contact");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!imageUrl) {
        throw new Error("Image URL is required");
      }
      
      const safeTitle = (title || "").replace(/'/g, "''");
      const safeDescription = (description || "").replace(/'/g, "''");
      const safeImageUrl = imageUrl.replace(/'/g, "''");
      const safeLink = (link || "").replace(/'/g, "''");
      const safeButton1Text = (button1Text || "").replace(/'/g, "''");
      const safeButton1Link = (button1Link || "").replace(/'/g, "''");
      const safeButton2Text = (button2Text || "").replace(/'/g, "''");
      const safeButton2Link = (button2Link || "").replace(/'/g, "''");
      
      if (editingPhoto) {
        const query = `SELECT update_sliding_photo('${editingPhoto.id}', '${safeTitle}', '${safeImageUrl}', ${isActive}, '${safeLink}', '${safeDescription}', '${safeButton1Text}', '${safeButton1Link}', '${safeButton2Text}', '${safeButton2Link}')`;
        console.log("Executing update query:", query);
        
        const { error, data } = await executeSql(query);
        console.log("Update response:", { error, data });

        if (error) {
          console.error("Update error:", error);
          throw error;
        }
        
        return { id: editingPhoto.id, action: 'update' };
      } else {
        console.log("Inserting new photo with data:", {
          title: safeTitle,
          description: safeDescription,
          image_url: safeImageUrl,
          is_active: isActive,
          link: safeLink,
          button1_text: safeButton1Text,
          button1_link: safeButton1Link,
          button2_text: safeButton2Text,
          button2_link: safeButton2Link
        });
        
        const query = `SELECT insert_sliding_photo('${safeTitle}', '${safeImageUrl}', ${isActive}, '${safeLink}', '${safeDescription}', '${safeButton1Text}', '${safeButton1Link}', '${safeButton2Text}', '${safeButton2Link}')`;
        console.log("Executing insert query:", query);
        
        const { error, data } = await executeSql(query);
        console.log("Insert response:", { error, data });

        if (error) {
          console.error("Insert error:", error);
          throw error;
        }
        
        return { id: data?.[0]?.insert_sliding_photo || null, action: 'create' };
      }
    },
    onSuccess: (result) => {
      toast({
        title: "Success",
        description: result.action === 'update' 
          ? "Photo updated successfully!" 
          : "Photo added successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["sliding-photos"] });
      queryClient.invalidateQueries({ queryKey: ["hero-sliding-photos"] });
      onSuccess();
    },
    onError: (error: any) => {
      let errorMessage = error.message || "Failed to save photo";
      
      if (error.message?.includes("row-level security") || error.message?.includes("policy")) {
        errorMessage = "Row-level security policy error. Please contact the administrator to update the database permissions.";
      }
      
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
      console.error("Full error:", error);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">العنوان</Label>
          <Input
            id="title"
            placeholder="أدخل عنوان الصورة"
            value={title || ""}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">الوصف</Label>
          <Input
            id="description"
            placeholder="أدخل وصف الصورة"
            value={description || ""}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="imageUrl">رابط الصورة</Label>
          <Input
            id="imageUrl"
            placeholder="أدخل رابط الصورة"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            required
          />
          {imageUrl && (
            <div className="mt-2">
              <p className="text-sm text-gray-500 mb-1">معاينة:</p>
              <img
                src={imageUrl}
                alt="Preview"
                className="h-24 object-cover rounded-md"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://placehold.co/600x400?text=Invalid+Image";
                }}
              />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="link">رابط التوجيه (اختياري)</Label>
          <Input
            id="link"
            placeholder="أدخل رابط الصفحة (مثال: /products أو https://example.com)"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            عند الضغط على الصورة، سيتم التوجيه إلى هذا الرابط
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="button1Text">نص الزر الأول</Label>
            <Input
              id="button1Text"
              placeholder="تسوق الآن"
              value={button1Text}
              onChange={(e) => setButton1Text(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="button1Link">رابط الزر الأول</Label>
            <Input
              id="button1Link"
              placeholder="/products"
              value={button1Link}
              onChange={(e) => setButton1Link(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="button2Text">نص الزر الثاني</Label>
            <Input
              id="button2Text"
              placeholder="تواصل معنا"
              value={button2Text}
              onChange={(e) => setButton2Text(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="button2Link">رابط الزر الثاني</Label>
            <Input
              id="button2Link"
              placeholder="/contact"
              value={button2Link}
              onChange={(e) => setButton2Link(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="is-active"
            checked={isActive}
            onCheckedChange={setIsActive}
          />
          <Label htmlFor="is-active">نشط</Label>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          إلغاء
        </Button>
        <Button type="submit" disabled={saveMutation.isPending}>
          {saveMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {editingPhoto ? "تحديث" : "إضافة"}
        </Button>
      </div>
    </form>
  );
};

export default SlidingPhotoDialog;