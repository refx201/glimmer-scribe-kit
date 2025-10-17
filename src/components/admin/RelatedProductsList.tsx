import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { RelatedProductsSection } from "@/components/product/RelatedProductsSection";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import RelatedProductsDialog from "./RelatedProductsDialog";

const RelatedProductsList = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [productType, setProductType] = useState<'device' | 'accessory'>('device');
  const [selectedProduct, setSelectedProduct] = useState<{id: string; name: string} | null>(null);

  const { data: products, isLoading } = useQuery({
    queryKey: ["products-for-relations", searchQuery, productType],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select('*')
        .eq('type', productType);

      if (searchQuery) {
        query = query.ilike('name', `%${searchQuery}%`);
      }

      const { data: products, error } = await query;
      if (error) throw error;

      // For each product, fetch its related products count
      const productsWithRelatedCount = await Promise.all(
        products.map(async (product) => {
          const { data: relatedProducts, error: relatedError } = await supabase
            .from('related_products')
            .select('related_product_id')
            .eq('product_id', product.id);

          if (relatedError) throw relatedError;

          return {
            ...product,
            relatedCount: relatedProducts.length
          };
        })
      );

      return productsWithRelatedCount;
    }
  });

  const handleManageRelated = (productId: string, productName: string) => {
    setSelectedProduct({ id: productId, name: productName });
  };

  const handleUpdate = () => {
    queryClient.invalidateQueries({ queryKey: ["products-for-relations"] });
    setSelectedProduct(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 mb-6">
        <Input
          placeholder="ابحث عن منتج..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <Select value={productType} onValueChange={(value: 'device' | 'accessory') => setProductType(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="نوع المنتج" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="device">أجهزة</SelectItem>
            <SelectItem value="accessory">إكسسوارات</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {!products?.length ? (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">لم يتم العثور على منتجات</p>
        </div>
      ) : (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">إدارة المنتجات المرتبطة</h2>
          <div className="grid gap-4">
            {products.map((product) => (
              <div key={product.id} className="bg-white p-6 rounded-lg shadow border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-16 h-16 object-contain rounded"
                    />
                    <div>
                      <h3 className="text-lg font-semibold">{product.name}</h3>
                      <p className="text-gray-500">منتجات مرتبطة: {product.relatedCount}</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleManageRelated(product.id, product.name)}
                    variant="outline"
                  >
                    إدارة المنتجات المرتبطة
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedProduct && (
        <RelatedProductsDialog
          open={!!selectedProduct}
          onOpenChange={(open) => {
            if (!open) {
              handleUpdate();
            }
          }}
          productId={selectedProduct.id}
          productName={selectedProduct.name}
        />
      )}
    </div>
  );
};

export default RelatedProductsList;