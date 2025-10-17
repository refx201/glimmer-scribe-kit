import { useState, useEffect } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Package } from "lucide-react";

interface RelatedProductsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string;
  productName: string;
}

const RelatedProductsDialog = ({ open, onOpenChange, productId, productName }: RelatedProductsDialogProps) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch all products except the current one
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["all-products", productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, image, sale_price")
        .neq("id", productId)
        .order("name");

      if (error) throw error;
      return data;
    },
    enabled: open,
  });

  // Fetch existing related products
  const { data: existingRelated = [] } = useQuery({
    queryKey: ["existing-related", productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("related_products")
        .select("related_product_id")
        .eq("product_id", productId);

      if (error) throw error;
      return data.map(item => item.related_product_id);
    },
    enabled: open,
  });

  useEffect(() => {
    if (existingRelated.length > 0) {
      setSelectedProducts(existingRelated);
    }
  }, [existingRelated]);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleProduct = (productToToggleId: string) => {
    setSelectedProducts(prev =>
      prev.includes(productToToggleId)
        ? prev.filter(id => id !== productToToggleId)
        : [...prev, productToToggleId]
    );
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Delete existing relationships
      await supabase
        .from("related_products")
        .delete()
        .eq("product_id", productId);

      // Insert new relationships
      if (selectedProducts.length > 0) {
        const inserts = selectedProducts.map(relatedId => ({
          product_id: productId,
          related_product_id: relatedId,
        }));

        const { error } = await supabase
          .from("related_products")
          .insert(inserts);

        if (error) throw error;
      }

      toast({
        title: "تم الحفظ بنجاح",
        description: `تم تحديث المنتجات المرتبطة بـ ${productName}`,
      });

      onOpenChange(false);
    } catch (error: any) {
      console.error("Error saving related products:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حفظ المنتجات المرتبطة",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh]">
        <div className="mx-auto w-full max-w-4xl">
          <DrawerHeader className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <DrawerTitle className="text-right">
              إدارة المنتجات المرتبطة - {productName}
            </DrawerTitle>
          </DrawerHeader>
          
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="ابحث عن منتج..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Selected count */}
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-blue-700 font-medium">
                  تم اختيار {selectedProducts.length} منتج مرتبط
                </p>
              </div>

              {/* Products list */}
              <ScrollArea className="h-96">
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredProducts.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer"
                        onClick={() => toggleProduct(product.id)}
                      >
                        <Checkbox
                          checked={selectedProducts.includes(product.id)}
                          onChange={() => toggleProduct(product.id)}
                        />
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1 text-right">
                          <h4 className="font-medium text-gray-900">{product.name}</h4>
                          <p className="text-sm text-gray-500">
                            {product.sale_price?.toLocaleString()} ₪
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t">
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? "جاري الحفظ..." : "حفظ المنتجات المرتبطة"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting}
                >
                  إلغاء
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default RelatedProductsDialog;