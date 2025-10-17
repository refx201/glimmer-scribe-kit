import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { removeBackground, loadImage } from "@/utils/imageProcessing";
import { useState } from "react";

interface ImageUploadFieldProps {
  image: string;
  onChange: (image: string) => void;
}

const ImageUploadField = ({ image, onChange }: ImageUploadFieldProps) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [removeBackgroundEnabled, setRemoveBackgroundEnabled] = useState(false);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const imageUrl = e.target.value;
    if (!imageUrl) {
      onChange("");
      return;
    }

    if (!removeBackgroundEnabled) {
      onChange(imageUrl);
      return;
    }

    try {
      setIsProcessing(true);
      toast({
        title: "Processing Image",
        description: "Removing background... This may take a few moments.",
      });

      const img = await loadImage(imageUrl);
      const processedBlob = await removeBackground(img as any);
      const processedUrl = URL.createObjectURL(processedBlob);
      
      onChange(processedUrl);
      toast({
        title: "Success",
        description: "Background removed successfully!",
      });
    } catch (error: any) {
      console.error("Error processing image:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to process image. Using original image instead.",
      });
      onChange(imageUrl);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-2 border rounded-lg p-4 bg-white shadow-sm">
      <Input
        placeholder="Image URL (Optional)"
        value={image}
        onChange={handleImageChange}
        disabled={isProcessing}
      />
      <div className="flex items-center space-x-2">
        <Switch
          checked={removeBackgroundEnabled}
          onCheckedChange={setRemoveBackgroundEnabled}
        />
        <label className="text-sm text-gray-600">
          Remove image background
        </label>
      </div>
    </div>
  );
};

export default ImageUploadField;