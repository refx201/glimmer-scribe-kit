import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

interface Brand {
  id?: string;
  name: string;
  logo_url: string;
  type: string;
}

interface BrandDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  brand: Brand | null;
  onSubmit: (brand: Brand) => Promise<void>;
}

const BrandDialog = ({
  open,
  onOpenChange,
  brand: initialBrand,
  onSubmit,
}: BrandDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [brand, setBrand] = useState<Brand>(() => ({
    name: initialBrand?.name || "",
    logo_url: initialBrand?.logo_url || "",
    type: initialBrand?.type || "",
  }));

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit(brand);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[85vh]">
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <DrawerTitle>{initialBrand ? "Edit Brand" : "Add Brand"}</DrawerTitle>
          </DrawerHeader>
          <div className="p-4 pb-0 overflow-y-auto max-h-[calc(85vh-80px)]">
            <div className="space-y-4">
              <Input
                placeholder="Brand Name *"
                value={brand.name}
                onChange={(e) => setBrand({ ...brand, name: e.target.value })}
              />
              <Input
                placeholder="Logo URL (Optional)"
                value={brand.logo_url}
                onChange={(e) => setBrand({ ...brand, logo_url: e.target.value })}
              />
              <Select
                value={brand.type}
                onValueChange={(value) => setBrand({ ...brand, type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Type *" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="device">Device Only</SelectItem>
                  <SelectItem value="accessory">Accessory Only</SelectItem>
                  <SelectItem value="both">Both Device & Accessory</SelectItem>
                </SelectContent>
              </Select>

              {/* Preview */}
              {brand.logo_url && (
                <div className="pt-4">
                  <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                  <Button
                    variant="outline"
                    className="relative h-20 w-full overflow-hidden"
                    style={{
                      backgroundImage: `url(${brand.logo_url})`,
                      backgroundSize: 'contain',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat'
                    }}
                  >
                    {brand.logo_url && (
                      <div className="absolute inset-0 bg-black/5 dark:bg-white/5" />
                    )}
                  </Button>
                </div>
              )}

              <Button 
                className="w-full"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Brand"}
              </Button>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default BrandDialog;