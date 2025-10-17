import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface CartPromoCodeProps {
  promoCode: string;
  isValidatingPromo: boolean;
  appliedPromo: { code: string; discount: number } | null;
  onPromoCodeChange: (code: string) => void;
  onValidatePromo: () => void;
  onRemovePromo: () => void;
}

const CartPromoCode = ({
  promoCode,
  isValidatingPromo,
  appliedPromo,
  onPromoCodeChange,
  onValidatePromo,
  onRemovePromo,
}: CartPromoCodeProps) => {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">هل لديك رمز خصم؟</p>
      {appliedPromo ? (
        <div className="flex items-center gap-2 p-3 bg-success/10 border border-success/20 rounded-lg">
          <span className="flex-1 text-sm text-success-foreground">
            {appliedPromo.code} - {appliedPromo.discount}% off
          </span>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={onRemovePromo}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div className="flex gap-2">
          <Input
            placeholder="ادخل رمز الخصم إن كان لديك"
            value={promoCode}
            onChange={(e) => onPromoCodeChange(e.target.value.toUpperCase())}
            className="flex-1"
          />
          <Button
            onClick={onValidatePromo}
            disabled={isValidatingPromo || !promoCode}
            variant="secondary"
            className="px-6"
          >
            تأكيد
          </Button>
        </div>
      )}
    </div>
  );
};

export default CartPromoCode;
