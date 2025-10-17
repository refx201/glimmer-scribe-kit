import { useState } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface PromoCodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingPromoCode?: any;
}

const PromoCodeDialog = ({
  open,
  onOpenChange,
  editingPromoCode,
}: PromoCodeDialogProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    code: editingPromoCode?.code || "",
    discount_percentage: editingPromoCode?.discount_percentage?.toString() || "",
    profit_percentage: editingPromoCode?.profit_percentage?.toString() || "",
    is_active: editingPromoCode?.is_active ?? true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.code || !formData.discount_percentage || !formData.profit_percentage) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all fields",
      });
      return;
    }

    const discount = parseInt(formData.discount_percentage);
    const profit = parseInt(formData.profit_percentage);
    
    if (isNaN(discount) || discount <= 0 || discount > 100) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Discount must be between 1 and 100",
      });
      return;
    }

    if (isNaN(profit) || profit < 0 || profit > 100) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Profit percentage must be between 0 and 100",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (editingPromoCode) {
        const { error } = await supabase
          .from("promo_codes")
          .update({
            discount_percentage: discount,
            profit_percentage: profit,
            is_active: formData.is_active,
          })
          .eq("id", editingPromoCode.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Promo code updated successfully!",
        });
      } else {
        // Generate a UUID for the new promo code
        const id = crypto.randomUUID();
        
        const { error } = await supabase
          .from("promo_codes")
          .insert({
            id,
            code: formData.code.toUpperCase(),
            discount_percentage: discount,
            profit_percentage: profit,
            is_active: formData.is_active,
          });

        if (error) {
          if (error.code === "23505") {
            toast({
              variant: "destructive",
              title: "Error",
              description: "This promo code already exists",
            });
            return;
          }
          throw error;
        }

        toast({
          title: "Success",
          description: "Promo code created successfully!",
        });
      }

      await queryClient.invalidateQueries({ queryKey: ["admin-promo-codes"] });
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error saving promo code:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to save promo code",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[85vh]">
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <DrawerTitle>
              {editingPromoCode ? "Edit Promo Code" : "Create Promo Code"}
            </DrawerTitle>
          </DrawerHeader>
          <div className="p-4 pb-0 overflow-y-auto max-h-[calc(85vh-80px)]">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Code</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, code: e.target.value }))
                  }
                  placeholder="SUMMER2024"
                  disabled={!!editingPromoCode}
                  className="uppercase"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discount">Discount Percentage</Label>
                <Input
                  id="discount"
                  type="number"
                  min="1"
                  max="100"
                  value={formData.discount_percentage}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      discount_percentage: e.target.value,
                    }))
                  }
                  placeholder="20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profit">Profit Percentage</Label>
                <Input
                  id="profit"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.profit_percentage}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      profit_percentage: e.target.value,
                    }))
                  }
                  placeholder="10"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, is_active: e.target.checked }))
                  }
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="is_active">Active</Label>
              </div>
              <div className="flex gap-4 pt-4 pb-6">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? editingPromoCode
                      ? "Updating..."
                      : "Creating..."
                    : editingPromoCode
                    ? "Update"
                    : "Create"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default PromoCodeDialog;