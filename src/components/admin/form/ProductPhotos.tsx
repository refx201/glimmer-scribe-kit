import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Plus, Image } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProductPhotosProps {
  photos: string[];
  onPhotosChange: (photos: string[]) => void;
}

const ProductPhotos = ({ photos, onPhotosChange }: ProductPhotosProps) => {
  const { toast } = useToast();
  const [newPhotoUrl, setNewPhotoUrl] = useState("");
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  const handleAddPhoto = () => {
    if (!newPhotoUrl) {
      toast({
        title: "Error",
        description: "Please enter a photo URL",
        variant: "destructive",
      });
      return;
    }

    if (photos.includes(newPhotoUrl)) {
      toast({
        title: "Duplicate photo",
        description: "This photo has already been added",
        variant: "destructive",
      });
      return;
    }

    onPhotosChange([...photos, newPhotoUrl]);
    setNewPhotoUrl("");
    console.log("Added new photo:", newPhotoUrl);
  };

  const handleRemovePhoto = (indexToRemove: number) => {
    onPhotosChange(photos.filter((_, index) => index !== indexToRemove));
    if (selectedPhotoIndex >= photos.length - 1) {
      setSelectedPhotoIndex(Math.max(0, photos.length - 2));
    }
    console.log("Removed photo at index:", indexToRemove);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Add photo URL"
            value={newPhotoUrl}
            onChange={(e) => setNewPhotoUrl(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <Button 
          onClick={handleAddPhoto}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Photo
        </Button>
      </div>

      {photos.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[200px] border-2 border-dashed rounded-md p-4 text-gray-400">
          <Image className="w-12 h-12 mb-2" />
          <p>No additional photos added yet</p>
          <p className="text-sm">Add photo URLs to enhance product presentation</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Main photo preview */}
          <div className="relative aspect-square w-full max-w-md mx-auto bg-gray-50 rounded-lg overflow-hidden">
            <img
              src={photos[selectedPhotoIndex]}
              alt={`Main preview ${selectedPhotoIndex + 1}`}
              className="w-full h-full object-contain"
            />
            <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
              Photo {selectedPhotoIndex + 1} of {photos.length}
            </div>
          </div>

          {/* Thumbnails */}
          <ScrollArea className="w-full">
            <div className="flex gap-2 pb-4">
              {photos.map((photo, index) => (
                <div key={index} className="relative group flex-shrink-0">
                  <button
                    onClick={() => setSelectedPhotoIndex(index)}
                    className={`relative w-16 h-16 border-2 rounded-md overflow-hidden transition-all ${
                      selectedPhotoIndex === index 
                        ? 'border-primary ring-2 ring-primary ring-offset-2' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={photo}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                  <button
                    onClick={() => handleRemovePhoto(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

export default ProductPhotos;