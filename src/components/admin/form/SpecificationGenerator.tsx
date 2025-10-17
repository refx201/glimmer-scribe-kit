import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
interface SpecificationGeneratorProps {
  onGenerate: (description: string) => void;
}
const SpecificationGenerator = ({ onGenerate }: SpecificationGeneratorProps) => {
  const { toast } = useToast();
  const [specs, setSpecs] = useState({
    battery: '',
    os: '',
    screen: '',
    processor: '',
    rearCamera: '',
    frontCamera: '',
    ram: '',
    storage: ''
  });
  const handleInputChange = (field: keyof typeof specs) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSpecs(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };
  const generateDescription = () => {
    // Check if all fields are filled
    const emptyFields = Object.entries(specs).filter(([_, value]) => !value);
    if (emptyFields.length > 0) {
      toast({
        variant: "destructive",
        title: "Missing Fields",
        description: "Please fill in all specification fields"
      });
      return;
    }
    const description = `
البطارية: (${specs.battery}mAh)
نظام التشغيل: ${specs.os}
الشاشة: (${specs.screen})
المعالج: ${specs.processor}
الكاميرا الخلفية: (${specs.rearCamera}MP)
الكاميرا الأمامية: (${specs.frontCamera}MP)
الرام: (${specs.ram} جيجابايت)
التخزين: (${specs.storage} جيجابايت)
`.trim();
    onGenerate(description);
    toast({
      title: "Success",
      description: "Specifications generated successfully"
    });
  };
  return (
    <div className="space-y-4 border rounded-lg p-4 bg-white">
      <h3 className="text-lg font-semibold mb-4">Generate Device Specifications</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="battery">البطارية (mAh)</Label>
          <Input
            id="battery"
            value={specs.battery}
            onChange={handleInputChange('battery')}
            placeholder="e.g., 5000"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="os">نظام التشغيل</Label>
          <Input
            id="os"
            value={specs.os}
            onChange={handleInputChange('os')}
            placeholder="e.g., Android 13"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="screen">الشاشة</Label>
          <Input
            id="screen"
            value={specs.screen}
            onChange={handleInputChange('screen')}
            placeholder="e.g., 6.7 inch"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="processor">المعالج</Label>
          <Input
            id="processor"
            value={specs.processor}
            onChange={handleInputChange('processor')}
            placeholder="e.g., Snapdragon 8 Gen 2"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="rearCamera">الكاميرا الخلفية (MP)</Label>
          <Input
            id="rearCamera"
            value={specs.rearCamera}
            onChange={handleInputChange('rearCamera')}
            placeholder="e.g., 108"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="frontCamera">الكاميرا الأمامية (MP)</Label>
          <Input
            id="frontCamera"
            value={specs.frontCamera}
            onChange={handleInputChange('frontCamera')}
            placeholder="e.g., 32"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ram">الرام (GB)</Label>
          <Input
            id="ram"
            value={specs.ram}
            onChange={handleInputChange('ram')}
            placeholder="e.g., 8"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="storage">التخزين (GB)</Label>
          <Input
            id="storage"
            value={specs.storage}
            onChange={handleInputChange('storage')}
            placeholder="e.g., 256"
          />
        </div>
      </div>
      <Button 
        onClick={generateDescription}
        className="w-full mt-4"
      >
        Generate Description
      </Button>
    </div>
  );
};
export default SpecificationGenerator;