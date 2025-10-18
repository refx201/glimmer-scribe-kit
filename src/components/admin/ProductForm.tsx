import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import BasicFields from "./form/BasicFields";
import PriceFields from "./form/PriceFields";
import ColorFields from "./form/ColorFields";
import ProductPhotos from "./form/ProductPhotos";
import { Database } from "@/integrations/supabase/types";
import RelatedProductsField from "./form/RelatedProductsField";

type ProductPhoto = Database['public']['Tables']['product_photos']['Row'];

interface ProductFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  editingProduct?: any;
}

const ProductForm = ({ onSuccess, onCancel, editingProduct }: ProductFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: editingProduct?.name || "",
    brand_id: editingProduct?.brand_id || null,
    filter_category_id: editingProduct?.filter_category_id || null,
    original_price: editingProduct?.original_price?.toString() || "",
    sale_price: editingProduct?.sale_price?.toString() || "",
    discount: editingProduct?.discount?.toString() || "0",
    image: editingProduct?.image || "",
    additional_photos: editingProduct?.additional_photos || [],
    type: editingProduct?.type || "device",
    is_hot_sale: editingProduct?.is_hot_sale || false,
    is_featured: editingProduct?.is_featured || false,
    specifications: editingProduct?.specifications || {
      description: "",
      details: {}
    },
    colors: editingProduct?.colors || [],
  });
  const [relatedProducts, setRelatedProducts] = useState<string[]>([]);

  const addExampleProduct = () => {
    setNewProduct({
      name: "iPhone 14 Pro Max",
      brand_id: null,
      filter_category_id: null,
      original_price: "4999",
      sale_price: "4499",
      discount: "10",
      image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=60",
      additional_photos: [
        "https://images.unsplash.com/photo-1695048132784-8bd6779ef0c8?w=800&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1695048133090-8e8f7b71bc11?w=800&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1695048133079-19d43f47933e?w=800&auto=format&fit=crop&q=60"
      ],
      type: "device",
      is_hot_sale: true,
      is_featured: false,
      specifications: {
        description: "The iPhone 14 Pro Max features a stunning 6.7-inch Super Retina XDR display with ProMotion technology and the Always-On display. Powered by the A16 Bionic chip, it offers exceptional performance and efficiency.",
        details: {
          "Display": "6.7-inch Super Retina XDR",
          "Processor": "A16 Bionic chip",
          "Camera": "48MP Main | 12MP Ultra Wide",
          "Storage": "128GB, 256GB, 512GB, 1TB",
          "Battery": "Up to 29 hours video playback"
        }
      },
      colors: ["Space Black", "Silver", "Gold", "Deep Purple"]
    });

    toast({
      title: "Example Product Added",
      description: "You can now review and submit the example product",
    });
  };

  const { data: existingPhotos } = useQuery({
    queryKey: ["product-photos", editingProduct?.id],
    queryFn: async () => {
      if (!editingProduct?.id) return [];
      console.log("Fetching existing photos for product:", editingProduct.id);
      
      const { data, error } = await supabase
        .from('product_photos')
        .select('*')
        .eq('product_id', editingProduct.id)
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error("Error fetching product photos:", error);
        throw error;
      }

      const photos = data?.map(photo => photo.photo_url).filter(Boolean) || [];
      handleFieldChange({ additional_photos: photos });
      
      return photos;
    },
    enabled: !!editingProduct?.id
  });

  const { data: featuredCount } = useQuery({
    queryKey: ["featured-count", newProduct.type],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("products")
        .select("*", { count: 'exact' })
        .eq('type', newProduct.type)
        .is('is_featured', true);

      if (error) throw error;
      return count || 0;
    },
  });

  const { data: brands } = useQuery({
    queryKey: ["admin-brands"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("brands")
        .select("*");
      if (error) throw error;
      return data;
    },
  });

  const handleSubmit = async () => {
    if (!newProduct.name || !newProduct.original_price || !newProduct.sale_price) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required fields",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const productData = {
        name: newProduct.name,
        brand_id: newProduct.brand_id || null,
        filter_category_id: newProduct.filter_category_id || null,
        original_price: parseInt(newProduct.original_price),
        sale_price: parseInt(newProduct.sale_price),
        discount: parseInt(newProduct.discount),
        image: newProduct.image || null,
        type: newProduct.type,
        is_hot_sale: newProduct.is_hot_sale,
        is_featured: newProduct.is_featured,
        featured_order: newProduct.is_featured ? (featuredCount || 0) + 1 : null,
        specifications: newProduct.specifications,
        colors: newProduct.colors
      };
      console.log("Saving product with data:", productData);

      let productId;
      
      if (editingProduct) {
        const { error } = await supabase
          .from("products")
          .update(productData)
          .eq('id', editingProduct.id);

        if (error) throw error;
        productId = editingProduct.id;
      } else {
        const { data, error } = await supabase
          .from("products")
          .insert(productData)
          .select()
          .single();

        if (error) throw error;
        productId = data.id;
      }

      // Handle additional photos
      if (newProduct.additional_photos.length > 0) {
        // First, delete existing photos if we're editing
        if (editingProduct) {
          await supabase
            .from('product_photos')
            .delete()
            .eq('product_id', productId);
        }

        // Then insert new photos
        const photoInserts = newProduct.additional_photos.map(photo_url => ({
          product_id: productId,
          photo_url
        }));

        const { error: photosError } = await supabase
          .from('product_photos')
          .insert(photoInserts);

        if (photosError) throw photosError;
        console.log(`Inserted ${photoInserts.length} photos for product ${productId}`);
      }

      // Save related products with proper typing
      if (relatedProducts.length > 0) {
        const relatedProductsData: Database['public']['Tables']['related_products']['Insert'][] = 
          relatedProducts.map(relatedId => ({
            product_id: productId,
            related_product_id: relatedId
          }));

        const { error: relatedError } = await supabase
          .from('related_products')
          .insert(relatedProductsData);

        if (relatedError) throw relatedError;
      }

      toast({
        title: "Success",
        description: editingProduct ? "Product updated successfully!" : "Product added successfully!",
      });

      await queryClient.invalidateQueries({ queryKey: ["products"] });
      await queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      await queryClient.invalidateQueries({ queryKey: ["product-photos"] });
      await queryClient.invalidateQueries({ queryKey: ["featured-products"] });
      
      onSuccess();
    } catch (error: any) {
      console.error("Error adding/updating product:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to add/update product. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFieldChange = (values: Partial<typeof newProduct>) => {
    setNewProduct(prev => {
      const updated = { ...prev };
      
      if (values.specifications) {
        updated.specifications = {
          description: values.specifications.description || prev.specifications.description,
          details: values.specifications.details || prev.specifications.details
        };
      }
      
      Object.keys(values).forEach(key => {
        if (key !== 'specifications') {
          (updated as any)[key] = values[key as keyof typeof values];
        }
      });
      
      console.log("Updated product state:", updated);
      return updated;
    });
  };

  return (
    <div className="flex flex-col h-[80vh] max-h-[600px]">
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-4 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleFieldChange({ is_featured: !newProduct.is_featured })}
            className={`w-full mb-4 ${newProduct.is_featured ? 'bg-primary text-white hover:bg-primary/90' : ''}`}
          >
            {newProduct.is_featured ? 'Featured Product ✨' : 'Pin to Featured Products'}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={addExampleProduct}
            className="w-full mb-4"
          >
            Add Example Product
          </Button>

          <BasicFields
            name={newProduct.name}
            brandId={newProduct.brand_id}
            filterCategoryId={newProduct.filter_category_id}
            type={newProduct.type}
            image={newProduct.image}
            description={newProduct.specifications.description}
            brands={brands || []}
            onChange={handleFieldChange}
          />
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Additional Photos</h3>
            <ProductPhotos
              photos={newProduct.additional_photos}
              onPhotosChange={(photos) => handleFieldChange({ additional_photos: photos })}
            />
          </div>

          <PriceFields
            originalPrice={newProduct.original_price}
            salePrice={newProduct.sale_price}
            discount={newProduct.discount}
            onChange={handleFieldChange}
          />

          <ColorFields
            selectedColors={newProduct.colors}
            onColorSelect={(colors) => handleFieldChange({ colors })}
          />

          <RelatedProductsField
            selectedProducts={relatedProducts}
            onChange={setRelatedProducts}
            currentProductId={editingProduct?.id}
          />

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="hotSale"
              checked={newProduct.is_hot_sale}
              onChange={(e) => handleFieldChange({ is_hot_sale: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300"
            />
            <label htmlFor="hotSale" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              إضافة للعروض السريعه
            </label>
          </div>
        </div>
      </ScrollArea>

      <div className="flex gap-4 pt-4 px-4 border-t">
        <Button 
          className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (editingProduct ? "Updating..." : "Adding...") : (editingProduct ? "Update Product" : "Add Product")}
        </Button>
        <Button 
          variant="outline"
          className="flex-1"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default ProductForm;