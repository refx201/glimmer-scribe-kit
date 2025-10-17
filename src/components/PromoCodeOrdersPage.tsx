import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import OrdersTable from "./admin/OrdersTable";
import { Button } from "./ui/button";
import { ArrowLeft, Percent } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PromoCodeOrdersPage = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();

  const { data: orders, isLoading, error } = useQuery({
    queryKey: ["promo-code-orders", code],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          promo_codes (
            profit_percentage,
            discount_percentage
          )
        `)
        .eq("promo_code", code)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching promo code orders:", error);
        throw error;
      }
      
      console.log("Promo code orders fetched:", data);
      return data || [];
    },
    enabled: !!code,
  });

  const promoCodeStats = orders?.reduce(
    (acc, order) => {
      acc.totalOrders += 1;
      acc.totalRevenue += order.total_price || 0;
      
      // Calculate profit from items
      if (order.promo_codes && order.items && Array.isArray(order.items)) {
        const profitPercentage = order.promo_codes.profit_percentage || 0;
        order.items.forEach((item: any) => {
          const itemTotal = (item.price || 0) * (item.quantity || 1);
          const profit = itemTotal * (profitPercentage / 100);
          acc.totalProfit += profit;
        });
      }
      return acc;
    },
    { totalOrders: 0, totalRevenue: 0, totalProfit: 0 }
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/admin")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Admin
          </Button>

          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <Percent className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Promo Code: {code}
                </h1>
                <p className="text-gray-600">All orders using this promo code</p>
              </div>
            </div>

            {promoCodeStats && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {promoCodeStats.totalOrders}
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-600">
                    ₪{Math.round(promoCodeStats.totalRevenue).toLocaleString()}
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Total Profit</p>
                  <p className="text-2xl font-bold text-purple-600">
                    ₪{Math.round(promoCodeStats.totalProfit).toLocaleString()}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading orders...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-red-600">Error loading orders: {error.message}</p>
          </div>
        ) : !orders || orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-gray-600">No orders found for this promo code.</p>
          </div>
        ) : (
          <OrdersTable 
            orders={orders} 
            isLoading={isLoading}
            viewOnlyMode={true}
          />
        )}
      </div>
    </div>
  );
};

export default PromoCodeOrdersPage;
