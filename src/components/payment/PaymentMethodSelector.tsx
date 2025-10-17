import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface PaymentMethodSelectorProps {
  selectedMethodId: string | null;
  onSelect: (id: string) => void;
}

const PaymentMethodSelector = ({ selectedMethodId, onSelect }: PaymentMethodSelectorProps) => {
  const [methods, setMethods] = useState<any[]>([]);

  useEffect(() => {
    const fetchMethods = async () => {
      const { data } = await supabase
        .from("payment_methods")
        .select("*")
        .eq("is_active", true);
      
      if (data) setMethods(data);
    };
    fetchMethods();
  }, []);

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">طريقة الدفع</label>
      <RadioGroup value={selectedMethodId || ""} onValueChange={onSelect}>
        {methods.map((method) => (
          <div key={method.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
            <RadioGroupItem value={method.id} id={method.id} />
            <Label htmlFor={method.id} className="flex-1 cursor-pointer">
              <div className="font-medium">{method.name}</div>
              {method.description && (
                <div className="text-xs text-muted-foreground mt-0.5">{method.description}</div>
              )}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default PaymentMethodSelector;
