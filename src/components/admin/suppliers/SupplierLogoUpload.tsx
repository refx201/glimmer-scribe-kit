import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface SupplierLogoUploadProps {
  currentLogoUrl?: string;
  onLogoChange: (url: string) => void;
}

export function SupplierLogoUpload({ currentLogoUrl, onLogoChange }: SupplierLogoUploadProps) {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentLogoUrl || '');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'نوع ملف غير صالح',
        description: 'يرجى اختيار صورة',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: 'حجم الملف كبير جداً',
        description: 'يرجى اختيار صورة أصغر من 2 ميجابايت',
        variant: 'destructive',
      });
      return;
    }

    try {
      setUploading(true);

      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('suppliers-logos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('suppliers-logos')
        .getPublicUrl(data.path);

      setPreviewUrl(publicUrl);
      onLogoChange(publicUrl);

      toast({
        title: 'تم رفع الشعار بنجاح!',
      });
    } catch (error: any) {
      console.error('Error uploading logo:', error);
      toast({
        title: 'حدث خطأ',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveLogo = () => {
    setPreviewUrl('');
    onLogoChange('');
  };

  const handleUrlChange = (url: string) => {
    setPreviewUrl(url);
    onLogoChange(url);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>شعار المورد</Label>
        
        {/* Preview */}
        {previewUrl && (
          <div className="relative inline-block">
            <img
              src={previewUrl}
              alt="Logo preview"
              className="w-32 h-32 object-contain border rounded-lg bg-white"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 h-6 w-6"
              onClick={handleRemoveLogo}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Upload Button */}
        {!previewUrl && (
          <div className="flex items-center gap-2">
            <Input
              id="logo-upload"
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('logo-upload')?.click()}
              disabled={uploading}
              className="w-full"
            >
              {uploading ? (
                'جاري الرفع...'
              ) : (
                <>
                  <Upload className="h-4 w-4 ml-2" />
                  رفع شعار
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {/* URL Input as alternative */}
      <div className="space-y-2">
        <Label htmlFor="logo_url">أو أدخل رابط الشعار</Label>
        <Input
          id="logo_url"
          value={previewUrl}
          onChange={(e) => handleUrlChange(e.target.value)}
          placeholder="https://..."
          disabled={uploading}
        />
      </div>
    </div>
  );
}
