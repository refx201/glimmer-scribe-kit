import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import OrdersTable from './OrdersTable';

export function OrdersTableWrapper() {
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  return <OrdersTable orders={orders} isLoading={isLoading} />;
}
