
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit2, Trash2, Copy, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchBar } from "@/components/ui/search-bar";
import BulkProductImport from "./BulkProductImport";

interface ProductListProps {
  onEdit: (product: any) => void;
}

const ProductList = ({ onEdit }: ProductListProps) => {
  const { toast } = useToast();
  const [productType, setProductType] = useState<'device' | 'accessory' | 'both' | 'both_only'>('device');
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [showBulkImport, setShowBulkImport] = useState(false);

  // Fetch brands for the filter
  const { data: brands } = useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("brands")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data;
    },
  });

  const { data: products, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-products", productType, searchQuery, selectedBrand],
    queryFn: async () => {
      console.log("Fetching products of type:", productType);
      console.log("With search query:", searchQuery);
      
      let query = supabase
        .from("products")
        .select(`
          *,
          brands (
            name,
            logo_url
          )
        `);

      // Apply type filter based on selection
      if (productType === 'both_only') {
        query = query.eq('type', 'both');
      } else if (productType !== 'both') {
        query = query.or(`type.eq.${productType},type.eq.both`);
      }

      // Apply search filter if search query exists
      if (searchQuery) {
        query = query.ilike('name', `%${searchQuery}%`);
      }

      // Apply brand filter if a brand is selected
      if (selectedBrand) {
        const brand = brands?.find(b => b.name === selectedBrand);
        if (brand) {
          query = query.eq('brand_id', brand.id);
        }
      }

      // Apply sorting
      const { data, error } = await query
        .order('is_featured', { ascending: false })
        .order('featured_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      console.log("Fetched products:", data);
      return data;
    },
    staleTime: 1000 * 60, // Cache for 1 minute
  });

  const handleDelete = async (id: string) => {
    try {
      // With CASCADE DELETE, we can delete the product directly
      // All related records (cart_items, wishes, etc.) will be deleted automatically
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Product deleted successfully",
      });

      refetch();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleDuplicate = async (product: any) => {
    try {
      // Create a copy of the product with new ID and modified name
      const duplicatedProduct = {
        name: `${product.name} (Copy)`,
        image: product.image,
        original_price: product.original_price,
        sale_price: product.sale_price,
        discount: product.discount,
        specifications: product.specifications,
        type: product.type,
        brand_id: product.brand_id,
        colors: product.colors,
        additional_photos: product.additional_photos,
        is_hot_sale: false,
        is_featured: false,
        featured_order: null
      };

      // Insert the duplicated product
      const { data: newProduct, error: productError } = await supabase
        .from("products")
        .insert(duplicatedProduct)
        .select()
        .single();

      if (productError) throw productError;

      // Copy additional photos from product_photos table
      const { data: additionalPhotos } = await supabase
        .from("product_photos")
        .select("photo_url")
        .eq("product_id", product.id);

      if (additionalPhotos && additionalPhotos.length > 0) {
        const photosToInsert = additionalPhotos.map(photo => ({
          product_id: newProduct.id,
          photo_url: photo.photo_url
        }));

        await supabase
          .from("product_photos")
          .insert(photosToInsert);
      }

      toast({
        title: "Success",
        description: `Product "${product.name}" duplicated successfully`,
      });

      refetch();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleTypeChange = (value: string) => {
    if (value === 'device' || value === 'accessory' || value === 'both' || value === 'both_only') {
      setProductType(value);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-4">
        Error loading products. Please try again later.
      </div>
    );
  }

  const getTypeDisplayText = () => {
    const count = products?.length || 0;
    let categoryText = "";
    
    switch (productType) {
      case 'device':
        categoryText = "أجهزة";
        break;
      case 'accessory':
        categoryText = "اكسسوارات";
        break;
      case 'both_only':
        categoryText = "منتجات مختلطة";
        break;
      default:
        categoryText = "منتجات";
    }
    
    return `يوجد لديك ${count} ${categoryText}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-center">Products Management</h2>
          <p className="text-lg text-muted-foreground mt-2 text-center">{getTypeDisplayText()}</p>
        </div>
        <div className="flex flex-col items-end gap-3">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setShowBulkImport(true)}
              className="flex items-center gap-2"
              variant="outline"
            >
              <Upload className="h-4 w-4" />
              Bulk Import
            </Button>
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search products..."
              className="w-[300px]"
            />
            <Select value={productType} onValueChange={handleTypeChange}>
              <SelectTrigger className="w-[180px] bg-white border-2 border-gray-200 hover:bg-gray-50 z-10">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-gray-200 shadow-lg z-50">
                <SelectItem value="device" className="cursor-pointer hover:bg-gray-100">Devices</SelectItem>
                <SelectItem value="accessory" className="cursor-pointer hover:bg-gray-100">Accessories</SelectItem>
                <SelectItem value="both" className="cursor-pointer hover:bg-gray-100">All Products</SelectItem>
                <SelectItem value="both_only" className="cursor-pointer hover:bg-gray-100">Both Type Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {brands && (
            <Select value={selectedBrand || "all"} onValueChange={(value) => setSelectedBrand(value === "all" ? null : value)}>
              <SelectTrigger className="w-[200px] bg-white border-2 border-gray-200 hover:bg-gray-50 z-10">
                <SelectValue placeholder="Filter by brand" />
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-gray-200 shadow-lg z-50">
                <SelectItem value="all" className="cursor-pointer hover:bg-gray-100">All Brands</SelectItem>
                {brands
                  .filter(brand => {
                    if (productType === 'both' || productType === 'both_only') return true;
                    return brand.type === productType || brand.type === 'both';
                  })
                  .map((brand) => (
                    <SelectItem key={brand.id} value={brand.name} className="cursor-pointer hover:bg-gray-100">
                      {brand.name}
                    </SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Brand</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Sale Price</TableHead>
            <TableHead className="text-right">Discount</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products?.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded"
                />
              </TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.brands?.name || "No Brand"}</TableCell>
              <TableCell>{product.type}</TableCell>
              <TableCell>₪{product.original_price}</TableCell>
              <TableCell>₪{product.sale_price}</TableCell>
              <TableCell className="text-right">{product.discount}%</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onEdit(product)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDuplicate(product)}
                    className="text-blue-500 hover:text-blue-600"
                    title="Duplicate Product"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(product.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <BulkProductImport
        open={showBulkImport}
        onOpenChange={setShowBulkImport}
        onSuccess={() => {
          refetch();
          setShowBulkImport(false);
        }}
      />
    </div>
  );
};

export default ProductList;
