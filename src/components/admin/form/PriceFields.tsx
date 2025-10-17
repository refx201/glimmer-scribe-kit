import { Input } from "@/components/ui/input";

interface PriceFieldsProps {
  originalPrice: string;
  salePrice: string;
  discount: string;
  onChange: (values: { 
    original_price?: string;
    sale_price?: string;
    discount?: string;
  }) => void;
}

const PriceFields = ({ originalPrice, salePrice, discount, onChange }: PriceFieldsProps) => {
  const calculateDiscount = (original: string, sale: string) => {
    const originalNum = parseFloat(original);
    const saleNum = parseFloat(sale);
    
    if (originalNum > 0 && saleNum > 0 && originalNum >= saleNum) {
      const discountPercent = Math.round(((originalNum - saleNum) / originalNum) * 100);
      onChange({ discount: discountPercent.toString() });
    }
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="Original Price *"
        type="number"
        value={originalPrice}
        onChange={(e) => {
          onChange({ original_price: e.target.value });
          if (salePrice) {
            calculateDiscount(e.target.value, salePrice);
          }
        }}
      />
      <Input
        placeholder="Sale Price *"
        type="number"
        value={salePrice}
        onChange={(e) => {
          onChange({ sale_price: e.target.value });
          if (originalPrice) {
            calculateDiscount(originalPrice, e.target.value);
          }
        }}
      />
      <Input
        placeholder="Discount % (Auto-calculated)"
        type="number"
        value={discount}
        readOnly
        className="bg-gray-50"
      />
    </div>
  );
};

export default PriceFields;