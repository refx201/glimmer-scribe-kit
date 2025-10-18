import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ImageUploadField from "./ImageUploadField";
import SpecificationGenerator from "./SpecificationGenerator";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface BasicFieldsProps {
  name: string;
  brandId: string | null;
  type: string;
  image: string;
  description?: string;
  filterCategoryId?: string | null;
  brands: any[];
  onChange: (values: {
    name?: string;
    brand_id?: string | null;
    type?: string;
    image?: string;
    filter_category_id?: string | null;
    specifications?: { 
      description: string; 
      details?: Record<string, string>;
    };
  }) => void;
}

const BasicFields = ({ 
  name, 
  brandId = null, 
  type, 
  image, 
  description = "", 
  filterCategoryId = null,
  brands, 
  onChange 
}: BasicFieldsProps) => {
  const { data: filterCategories } = useQuery({
    queryKey: ['filter-categories', type],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_filter_categories')
        .select('*')
        .eq('type', type === 'both' ? 'device' : type)
        .eq('is_active', true)
        .order('display_order');
      if (error) throw error;
      return data;
    },
    enabled: type === 'device' || type === 'accessory' || type === 'both'
  });

  const handleSpecificationsGenerate = (generatedDescription: string) => {
    onChange({
      specifications: {
        description: generatedDescription,
        details: {}
      }
    });
  };

  const handleBrandSelect = (value: string) => {
    if (value === "null") {
      onChange({ brand_id: null });
    } else {
      onChange({ brand_id: value });
    }
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <div className="grid gap-4">
        <div className="space-y-4 border rounded-lg p-4 bg-white shadow-sm">
          <Input
            placeholder="Product Name *"
            value={name}
            onChange={(e) => onChange({ name: e.target.value })}
          />
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Brand</label>
            <Select
              value={brandId || "null"}
              onValueChange={handleBrandSelect}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a brand" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="null">No Brand</SelectItem>
                {brands?.map((brand) => (
                  <SelectItem key={brand.id} value={brand.id}>
                    {brand.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Select
            value={type}
            onValueChange={(value) => onChange({ type: value })}
          >
            <SelectTrigger className="bg-white border-gray-200 hover:bg-gray-50">
              <SelectValue placeholder="Select Type *" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 shadow-lg">
              <SelectItem value="device" className="hover:bg-blue-50">Device</SelectItem>
              <SelectItem value="accessory" className="hover:bg-blue-50">Accessory</SelectItem>
              <SelectItem value="both" className="hover:bg-blue-50">Both</SelectItem>
            </SelectContent>
          </Select>

          {(type === 'device' || type === 'accessory' || type === 'both') && filterCategories && filterCategories.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">الفئة</label>
              <Select
                value={filterCategoryId || "null"}
                onValueChange={(value) => onChange({ filter_category_id: value === "null" ? null : value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر فئة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="null">بدون فئة</SelectItem>
                  {filterCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <ImageUploadField 
          image={image} 
          onChange={(newImage) => onChange({ image: newImage })} 
        />

        {(type === 'device' || type === 'both') && (
          <SpecificationGenerator onGenerate={handleSpecificationsGenerate} />
        )}

        <div className="border rounded-lg p-4 bg-white shadow-sm">
          <Textarea
            placeholder="Enter product description..."
            value={description}
            onChange={(e) => onChange({ 
              specifications: { 
                description: e.target.value,
                details: {}
              } 
            })}
            className="min-h-[200px] font-medium bg-white"
          />
        </div>
      </div>
    </div>
  );
};

export default BasicFields;
