
import { ColorPicker } from "@/components/admin/form/ColorPicker";

interface ColorFieldsProps {
  selectedColors: string[];
  onColorSelect: (colors: string[]) => void;
}

const ColorFields = ({ selectedColors, onColorSelect }: ColorFieldsProps) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium">ألوان المنتج</h3>
      <ColorPicker
        selectedColors={selectedColors}
        onColorSelect={onColorSelect}
      />
    </div>
  );
};

export default ColorFields;
