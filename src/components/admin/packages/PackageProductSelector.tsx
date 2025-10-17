
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, X } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface SelectedProduct {
  product_id: string;
  selected_color?: string;
}

interface ProductType {
  id: string;
  name: string;
  image: string;
  original_price: number;
  sale_price: number;
  colors?: Record<string, string>;
  brands?: { name: string };
}

interface PackageProductSelectorProps {
  selectedProducts: SelectedProduct[];
  onChange: (products: SelectedProduct[]) => void;
}

const PackageProductSelector = ({ 
  selectedProducts,
  onChange
}: PackageProductSelectorProps) => {
  const [search, setSearch] = useState("");
  const [selectedProductColors, setSelectedProductColors] = useState<Record<string, string>>({});

  const { data: products, isLoading } = useQuery({
    queryKey: ["products-for-packages", search],
    queryFn: async () => {
      let query = supabase
        .from("products" as any)
        .select(`
          id,
          name,
          image,
          original_price,
          sale_price,
          colors,
          brands (
            name
          )
        `);
      
      if (search) {
        query = query.ilike("name", `%${search}%`);
      }
      
      const { data, error } = await query
        .order("created_at", { ascending: false })
        .limit(100);
      
      if (error) throw error;
      return data as unknown as ProductType[];
    },
  });

  // Initialize selected colors when products change
  useEffect(() => {
    const initialColors: Record<string, string> = {};
    selectedProducts.forEach((item) => {
      if (item.selected_color) {
        initialColors[item.product_id] = item.selected_color;
      }
    });
    setSelectedProductColors(initialColors);
  }, [selectedProducts]);

  const handleAddProduct = (productId: string) => {
    if (selectedProducts.some(p => p.product_id === productId)) {
      return; // Already added
    }
    
    const product = products?.find(p => p.id === productId) as ProductType | undefined;
    let selectedColor: string | undefined;
    
    if (product?.colors && Object.keys(product.colors).length > 0) {
      selectedColor = Object.keys(product.colors)[0];
      setSelectedProductColors(prev => ({
        ...prev,
        [productId]: selectedColor || ''
      }));
    }
    
    onChange([
      ...selectedProducts,
      {
        product_id: productId,
        selected_color: selectedColor
      }
    ]);
  };

  const handleRemoveProduct = (productId: string) => {
    onChange(selectedProducts.filter(p => p.product_id !== productId));
    
    // Remove from color selection
    const updatedColors = { ...selectedProductColors };
    delete updatedColors[productId];
    setSelectedProductColors(updatedColors);
  };

  const handleColorChange = (productId: string, color: string) => {
    setSelectedProductColors(prev => ({
      ...prev,
      [productId]: color
    }));
    
    onChange(
      selectedProducts.map(p => 
        p.product_id === productId 
          ? { ...p, selected_color: color } 
          : p
      )
    );
  };

  const getProductById = (productId: string): ProductType | undefined => {
    return products?.find(p => p.id === productId) as ProductType | undefined;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border rounded-md p-4">
        <div className="flex mb-4 gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-60 overflow-y-auto p-2">
            {products?.filter(product => 
              !selectedProducts.some(p => p.product_id === product.id)
            ).map((product) => (
              <div 
                key={product.id} 
                className="flex items-center border rounded-md p-2 bg-gray-50 hover:bg-gray-100"
              >
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="h-10 w-10 object-cover rounded mr-2"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{product.name}</p>
                  <p className="text-xs text-gray-500 truncate">
                    {product.brands?.name || 'No brand'} • ₪{product.sale_price}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 ml-2"
                  onClick={() => handleAddProduct(product.id)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {products?.length === 0 && (
              <div className="col-span-full text-center py-2 text-gray-500 text-sm">
                No products found
              </div>
            )}
          </div>
        )}
      </div>

      <div className="border rounded-md">
        <div className="bg-gray-50 p-3 border-b">
          <h3 className="font-medium">Selected Products ({selectedProducts.length})</h3>
        </div>
        <div className="p-4 space-y-4">
          {selectedProducts.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No products selected yet
            </div>
          ) : (
            <div className="space-y-4">
              {selectedProducts.map(({ product_id }) => {
                const product = getProductById(product_id);
                if (!product) return null;
                
                const hasColors = product.colors && 
                  typeof product.colors === 'object' && 
                  Object.keys(product.colors).length > 0;
                
                return (
                  <div key={product_id} className="border rounded-md p-3 bg-white">
                    <div className="flex items-center">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="h-16 w-16 object-contain rounded mr-3"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-500">
                          {product.brands?.name || 'No brand'} • ₪{product.sale_price}
                        </p>
                        
                        {hasColors && (
                          <div className="mt-2">
                            <p className="text-sm font-medium mb-1">Select Color:</p>
                            <RadioGroup 
                              value={selectedProductColors[product_id] || ''}
                              onValueChange={(value) => handleColorChange(product_id, value)}
                              className="flex flex-wrap gap-3"
                            >
                              {Object.entries(product.colors as Record<string, string>).map(([key, color]) => (
                                <div key={key} className="flex items-center space-x-2">
                                  <RadioGroupItem value={key} id={`color-${product_id}-${key}`} />
                                  <Label 
                                    htmlFor={`color-${product_id}-${key}`}
                                    className="flex items-center gap-1 cursor-pointer"
                                  >
                                    <span 
                                      className="w-4 h-4 rounded-full inline-block" 
                                      style={{ backgroundColor: color }}
                                    ></span>
                                    {key}
                                  </Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </div>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-600"
                        onClick={() => handleRemoveProduct(product_id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PackageProductSelector;
