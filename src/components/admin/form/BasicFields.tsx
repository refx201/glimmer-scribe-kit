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

interface BasicFieldsProps {
  name: string;
  brandId: string | null;
  type: string;
  image: string;
  description?: string;
  brands: any[];
  onChange: (values: {
    name?: string;
    brand_id?: string | null;
    type?: string;
    image?: string;
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
  brands, 
  onChange 
}: BasicFieldsProps) => {
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
