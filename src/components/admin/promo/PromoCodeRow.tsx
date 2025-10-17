import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Link } from "react-router-dom";

interface PromoCodeRowProps {
  promoCode: {
    id: string;
    code: string;
    discount_percentage: number;
    profit_percentage: number;
    is_active: boolean;
  };
  onEdit: () => void;
}

const PromoCodeRow = ({ promoCode, onEdit }: PromoCodeRowProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this promo code?")) {
      return;
    }

    setIsDeleting(true);
    try {
      // First try to delete the promo code
      const { error: deleteError } = await supabase
        .from("promo_codes")
        .delete()
        .eq("id", promoCode.id);

      if (deleteError) {
        // If deletion fails due to foreign key constraint, mark it as inactive instead
        if (deleteError.code === '23503') {
          console.log("Promo code is being used in orders, marking as inactive instead");
          const { error: updateError } = await supabase
            .from("promo_codes")
            .update({ is_active: false })
            .eq("id", promoCode.id);

          if (updateError) throw updateError;

          toast({
            title: "Promo Code Deactivated",
            description: "The promo code has been marked as inactive since it's being used in orders.",
          });
        } else {
          throw deleteError;
        }
      } else {
        toast({
          title: "Success",
          description: "Promo code deleted successfully",
        });
      }

      await queryClient.invalidateQueries({ queryKey: ["admin-promo-codes"] });
    } catch (error: any) {
      console.error("Error deleting promo code:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete promo code",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
      <div>
        <h3 className="font-semibold">{promoCode.code}</h3>
        <div className="text-sm text-muted-foreground">
          {promoCode.discount_percentage}% discount ·{" "}
          {promoCode.profit_percentage}% profit ·{" "}
          <span className={promoCode.is_active ? "text-green-600" : "text-red-600"}>
            {promoCode.is_active ? "Active" : "Inactive"}
          </span>
        </div>
      </div>
      <div className="flex gap-2">
        <Link to={`/promo-code-orders/${promoCode.code}`}>
          <Button variant="outline" size="icon">
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
        <Button
          variant="outline"
          size="icon"
          onClick={onEdit}
        >
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button
          variant="destructive"
          size="icon"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PromoCodeRow;