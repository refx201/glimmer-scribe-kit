import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface RelatedProductsFieldProps {
  selectedProducts: string[];
  onChange: (products: string[]) => void;
  currentProductId?: string;
}

const RelatedProductsField = ({ selectedProducts, onChange, currentProductId }: RelatedProductsFieldProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all products for search
  const { data: products } = useQuery({
    queryKey: ["products-search", searchQuery],
    queryFn: async () => {
      console.log("Fetching products for search with query:", searchQuery);
      const { data, error } = await supabase
        .from("products")
        .select(`
          id,
          name,
          image,
          brands (
            name
          )
        `)
        .ilike('name', `%${searchQuery}%`)
        .limit(10);

      if (error) {
        console.error("Error fetching products:", error);
        throw error;
      }
      
      console.log("Found products:", data);
      return data;
    },
    enabled: searchQuery.length > 2
  });

  // Fetch selected products details
  const { data: selectedProductsDetails } = useQuery({
    queryKey: ["selected-products", selectedProducts],
    queryFn: async () => {
      if (!selectedProducts.length) return [];
      
      console.log("Fetching details for selected products:", selectedProducts);
      const { data, error } = await supabase
        .from("products")
        .select(`
          id,
          name,
          image,
          brands (
            name
          )
        `)
        .in('id', selectedProducts);

      if (error) {
        console.error("Error fetching selected products:", error);
        throw error;
      }
      
      console.log("Found selected product details:", data);
      return data;
    },
    enabled: selectedProducts.length > 0
  });

  const handleSelectProduct = (productId: string) => {
    console.log("Selecting product:", productId);
    if (selectedProducts.length < 4 && !selectedProducts.includes(productId)) {
      onChange([...selectedProducts, productId]);
    }
  };

  const handleRemoveProduct = (productId: string) => {
    console.log("Removing product:", productId);
    onChange(selectedProducts.filter(id => id !== productId));
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Related Products</h3>
        <p className="text-sm text-gray-500 mb-4">Select up to 4 related products</p>
      </div>

      <Input
        placeholder="Search products..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4"
      />

      {searchQuery.length > 2 && products && products.length > 0 && (
        <ScrollArea className="h-48 border rounded-md p-2">
          {products
            .filter(p => p.id !== currentProductId && !selectedProducts.includes(p.id))
            .map(product => (
              <div
                key={product.id}
                className="flex items-center justify-between p-2 hover:bg-gray-100 rounded cursor-pointer"
                onClick={() => handleSelectProduct(product.id)}
              >
                <div className="flex items-center gap-2">
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-8 h-8 object-contain rounded"
                    />
                  )}
                  <span className="font-medium">{product.name}</span>
                </div>
                <span className="text-sm text-gray-500">{(product as any).brands?.name || 'Unknown'}</span>
              </div>
            ))}
        </ScrollArea>
      )}

      {selectedProductsDetails && selectedProductsDetails.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">Selected Products:</h4>
          <div className="flex flex-wrap gap-2">
            {selectedProductsDetails.map(product => (
              <div
                key={product.id}
                className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1"
              >
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-4 h-4 object-contain rounded-full"
                  />
                )}
                <span className="text-sm">{product.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0"
                  onClick={() => handleRemoveProduct(product.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RelatedProductsField;