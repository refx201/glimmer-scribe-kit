import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Plus, Percent, RefreshCw } from "lucide-react";
import BrandPromoCodeDialog from "./BrandPromoCodeDialog";
import PromoCodeRow from "./PromoCodeRow";
import PromoSetupInstructions from "./PromoSetupInstructions";

const PromoCodeList = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPromoCode, setEditingPromoCode] = useState<any>(null);
  const [showSetup, setShowSetup] = useState(false);
  const queryClient = useQueryClient();

  const { data: promoCodes, isLoading, refetch, error } = useQuery({
    queryKey: ["admin-promo-codes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("promo_codes")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Check if table exists by looking at error
  const tableNotExists = error?.message?.includes('relation "promo_codes" does not exist');

  const handleEdit = (promoCode: any) => {
    setEditingPromoCode(promoCode);
    setIsDialogOpen(true);
  };

  if (tableNotExists || showSetup) {
    return <PromoSetupInstructions onComplete={() => {
      setShowSetup(false);
      refetch();
    }} />;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Percent className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Promo Codes</h2>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            className="hidden sm:flex"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => {
              setEditingPromoCode(null);
              setIsDialogOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Code
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-4">Loading...</div>
      ) : !promoCodes?.length ? (
        <div className="text-center py-8 text-muted-foreground">
          No promo codes found. Create one to get started.
        </div>
      ) : (
        <div className="grid gap-4">
          {promoCodes.map((promoCode) => (
            <PromoCodeRow
              key={promoCode.id}
              promoCode={promoCode}
              onEdit={() => handleEdit(promoCode)}
            />
          ))}
        </div>
      )}

      <BrandPromoCodeDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingPromoCode={editingPromoCode}
      />
    </div>
  );
};

export default PromoCodeList;