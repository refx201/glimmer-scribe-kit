
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { PackageItem } from "@/types/package";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";
import ImageUploadField from "@/components/admin/form/ImageUploadField";
import PackageProductSelector from "./PackageProductSelector";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PackageDialogProps {
  packageData: PackageItem | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const PackageDialog = ({ packageData, onSuccess, onCancel }: PackageDialogProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [isHotSale, setIsHotSale] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Array<{ 
    product_id: string; 
    selected_color?: string;
  }>>([]);

  useEffect(() => {
    if (packageData) {
      setName(packageData.name);
      setDescription(packageData.description || "");
      setImage(packageData.image);
      setOriginalPrice(packageData.original_price.toString());
      setSalePrice(packageData.sale_price.toString());
      setIsHotSale(packageData.is_hot_sale);
      
      // Fetch package products
      const fetchPackageProducts = async () => {
        const { data, error } = await supabase
          .from("package_products" as any)
          .select("*")
          .eq("package_id", packageData.id);
        
        if (error) {
          console.error("Error fetching package products:", error);
          return;
        }
        
        setSelectedProducts(
          data.map((item: any) => ({
            product_id: item.product_id,
            selected_color: item.selected_color,
          }))
        );
      };
      
      fetchPackageProducts();
    }
  }, [packageData]);

  const calculateDiscount = () => {
    const original = parseFloat(originalPrice);
    const sale = parseFloat(salePrice);
    if (original > 0 && sale > 0 && original >= sale) {
      return Math.round(((original - sale) / original) * 100);
    }
    return 0;
  };

  const handleSubmit = async () => {
    // Basic validations and smart defaults
    if (selectedProducts.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one product for the package",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const packageId = packageData?.id || uuidv4();

      // If some fields are missing, try to auto-fill sensible defaults
      const selectedIds = selectedProducts.map((p) => p.product_id);
      let computedOriginal = parseFloat(originalPrice) || 0;
      let computedSale = parseFloat(salePrice) || 0;
      let computedImage = image;
      let computedName = name?.trim();

      if (!computedOriginal || !computedSale || !computedImage) {
        const { data: prods, error: prodErr } = await supabase
          .from("products" as any)
          .select("id, sale_price, original_price, image")
          .in("id", selectedIds);

        if (prodErr) throw prodErr;

        // Use sums if prices are missing
        if (!computedOriginal) {
          computedOriginal = (prods || []).reduce(
            (sum: number, p: any) => sum + (Number(p.original_price) || Number(p.sale_price) || 0),
            0
          );
        }
        if (!computedSale) {
          computedSale = (prods || []).reduce(
            (sum: number, p: any) => sum + (Number(p.sale_price) || Number(p.original_price) || 0),
            0
          );
        }
        // Image fallback to first product image
        if (!computedImage && prods && prods[0]?.image) {
          computedImage = prods[0].image as string;
        }
      }

      // Final validation after auto-fill
      if (!computedName) {
        const now = new Date();
        computedName = `Package ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
      }
      if (!computedImage || !computedOriginal || !computedSale) {
        toast({
          title: "Error",
          description: "Please provide name, image and prices for the package",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      const discount = Math.max(0, Math.round(((computedOriginal - computedSale) / computedOriginal) * 100));

      // Insert or update the package
      const { error: packageError } = await supabase
        .from("packages" as any)
        .upsert({
          id: packageId,
          name: computedName,
          description,
          image: computedImage,
          original_price: computedOriginal,
          sale_price: computedSale,
          discount,
          is_hot_sale: isHotSale,
          // created_at is handled by DB default; no updated_at column in packages table
        });

      if (packageError) throw packageError;

      // Delete existing products if editing
      if (packageData) {
        const { error: deleteError } = await supabase
          .from("package_products" as any)
          .delete()
          .eq("package_id", packageId);
        if (deleteError) throw deleteError;
      }

      // Insert package products
      const packageProducts = selectedProducts.map((product) => ({
        id: uuidv4(),
        package_id: packageId,
        product_id: product.product_id,
        selected_color: product.selected_color,
      }));

      const { error: productsError } = await supabase
        .from("package_products" as any)
        .insert(packageProducts);
      if (productsError) throw productsError;

      toast({
        title: "Success",
        description: packageData ? "Package updated successfully" : "Package created successfully",
      });

      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to save package",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollArea className="h-[70vh]">
      <div className="space-y-6 py-4 pr-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Package Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter package name"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter package description"
                className="h-32"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="originalPrice">Original Price *</Label>
                <Input
                  id="originalPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>
              <div>
                <Label htmlFor="salePrice">Sale Price *</Label>
                <Input
                  id="salePrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={salePrice}
                  onChange={(e) => setSalePrice(e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isHotSale"
                checked={isHotSale}
                onCheckedChange={setIsHotSale}
              />
              <Label htmlFor="isHotSale">Mark as Hot Sale</Label>
            </div>

            {originalPrice && salePrice && (
            <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                <p className="text-primary font-semibold text-lg">
                  Discount: {calculateDiscount()}%
                </p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <Label>Package Image *</Label>
            <ImageUploadField
              image={image}
              onChange={(url) => setImage(url)}
            />
          </div>
        </div>

        <div className="border-t pt-6">
          <Label className="text-lg font-bold mb-4">Select Products for Package</Label>
          <PackageProductSelector
            selectedProducts={selectedProducts}
            onChange={setSelectedProducts}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t sticky bottom-0 bg-background pb-2">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            size="lg"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            size="lg"
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Saving...
              </>
            ) : packageData ? (
              "Update Package"
            ) : (
              "Create Package"
            )}
          </Button>
        </div>
      </div>
    </ScrollArea>
  );
};

export default PackageDialog;