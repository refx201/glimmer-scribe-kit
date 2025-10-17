import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface CartCustomerFormProps {
  customerName: string;
  phoneNumber: string;
  address: string;
  onCustomerNameChange: (value: string) => void;
  onPhoneNumberChange: (value: string) => void;
  onAddressChange: (value: string) => void;
}

const CartCustomerForm = ({
  customerName,
  phoneNumber,
  address,
  onCustomerNameChange,
  onPhoneNumberChange,
  onAddressChange,
}: CartCustomerFormProps) => {
  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <label className="text-xs text-muted-foreground">الاسم الكامل *</label>
        <Input
          placeholder="أدخل اسمك الكامل"
          value={customerName}
          onChange={(e) => onCustomerNameChange(e.target.value)}
          className="h-10"
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-xs text-muted-foreground">رقم الهاتف مع مفتاح الدولة (مثل: 05x) *</label>
        <Input
          placeholder="05xxxxxxxx"
          value={phoneNumber}
          onChange={(e) => onPhoneNumberChange(e.target.value)}
          className="h-10"
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-xs text-muted-foreground">خيارات التوصيل *</label>
        <Textarea
          placeholder="أضف ملاحظاتك حول التوصيل"
          value={address}
          onChange={(e) => onAddressChange(e.target.value)}
          className="min-h-[60px] resize-none"
        />
      </div>
    </div>
  );
};

export default CartCustomerForm;
