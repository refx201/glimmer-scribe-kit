import { useState } from 'react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent } from '../ui/dialog';
import { Button } from '../ui/button';

interface ProductImageGalleryProps {
  mainImage: string;
  additionalPhotos?: string[];
  productName: string;
}

export function ProductImageGallery({ 
  mainImage, 
  additionalPhotos = [], 
  productName 
}: ProductImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Combine main image with additional photos
  const allImages = [mainImage, ...additionalPhotos].filter(Boolean);

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => 
      prev === 0 ? allImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => 
      prev === allImages.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <>
      <div className="space-y-4">
        {/* Main Image */}
        <div 
          className="relative aspect-square overflow-hidden rounded-lg bg-gray-50 cursor-pointer group"
          onClick={() => setIsModalOpen(true)}
        >
          <ImageWithFallback
            src={allImages[selectedImageIndex]}
            alt={`${productName} - صورة ${selectedImageIndex + 1}`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Zoom indicator */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 px-3 py-2 rounded-lg text-sm font-medium">
              اضغط للتكبير
            </div>
          </div>

          {/* Navigation arrows for main image */}
          {allImages.length > 1 && (
            <>
              <Button
                variant="secondary"
                size="sm"
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevImage();
                }}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextImage();
                }}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>

        {/* Thumbnail Gallery */}
        {allImages.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {allImages.map((image, index) => (
              <div
                key={index}
                className={`relative aspect-square overflow-hidden rounded-lg bg-gray-50 cursor-pointer border-2 transition-all ${
                  selectedImageIndex === index 
                    ? 'border-primary ring-2 ring-primary/20' 
                    : 'border-transparent hover:border-gray-300'
                }`}
                onClick={() => setSelectedImageIndex(index)}
              >
                <ImageWithFallback
                  src={image}
                  alt={`${productName} - معاينة ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl w-full p-0 overflow-hidden">
          <div className="relative bg-black">
            {/* Close button */}
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 left-2 z-50 bg-white/90 hover:bg-white text-black rounded-full w-8 h-8 p-0"
              onClick={() => setIsModalOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>

            {/* Main fullscreen image */}
            <div className="relative aspect-square max-h-[90vh]">
              <ImageWithFallback
                src={allImages[selectedImageIndex]}
                alt={`${productName} - صورة ${selectedImageIndex + 1}`}
                className="w-full h-full object-contain"
              />

              {/* Navigation in modal */}
              {allImages.length > 1 && (
                <>
                  <Button
                    variant="secondary"
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 p-0 rounded-full bg-white/90 hover:bg-white"
                    onClick={handlePrevImage}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="secondary"
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 p-0 rounded-full bg-white/90 hover:bg-white"
                    onClick={handleNextImage}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </>
              )}

              {/* Image counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                {selectedImageIndex + 1} / {allImages.length}
              </div>
            </div>

            {/* Thumbnail strip in modal */}
            {allImages.length > 1 && (
              <div className="flex gap-2 p-4 bg-black/90 overflow-x-auto">
                {allImages.map((image, index) => (
                  <div
                    key={index}
                    className={`relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                      selectedImageIndex === index 
                        ? 'border-white ring-2 ring-white/50' 
                        : 'border-transparent hover:border-white/50'
                    }`}
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <ImageWithFallback
                      src={image}
                      alt={`معاينة ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
