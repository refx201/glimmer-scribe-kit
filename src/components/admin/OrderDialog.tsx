
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import CustomerInfo from "./order/CustomerInfo";
import OrderItems from "./order/OrderItems";
import OrderActions from "./order/OrderActions";
import { useState } from "react";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";

const ORDER_STATUSES = ['pending', 'in_progress', 'completed'] as const;
type OrderStatus = typeof ORDER_STATUSES[number];

interface OrderDialogProps {
  order: any[] | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  viewOnly?: boolean;
}

const OrderDialog = ({ order, open, onOpenChange, viewOnly = false }: OrderDialogProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const updateOrderStatus = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: OrderStatus }) => {
      console.log("Starting status update for order:", orderId);
      console.log("New status will be:", status);

      if (!orderId) {
        throw new Error("Order ID is required");
      }

      if (!ORDER_STATUSES.includes(status)) {
        throw new Error(`Invalid status: ${status}`);
      }

      // Get the current order data first
      const { data: currentOrder, error: fetchError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (fetchError) throw fetchError;

      // Update with all required fields
      const { data, error } = await supabase
        .from('orders')
        .update({ 
          ...currentOrder,
          status 
        })
        .eq('id', orderId)
        .select()
        .single();

      if (error) {
        console.error("Failed to update order status:", error);
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      console.log("Mutation succeeded, invalidating queries");
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["promo-code-orders"] });
      toast({
        title: "Success",
        description: `Order status updated to ${data.status}`,
      });
    },
    onError: (error: any) => {
      console.error("Mutation error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update order status",
      });
    },
  });

  const deleteSelectedItems = useMutation({
    mutationFn: async () => {
      if (selectedItems.length === 0) return;

      const { error } = await supabase
        .from("orders")
        .delete()
        .in("id", selectedItems);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["promo-code-orders"] });
      toast({
        title: "Success",
        description: "Selected items deleted successfully",
      });
      setSelectedItems([]);
      if (order?.length === selectedItems.length) {
        onOpenChange(false);
      }
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete items",
      });
    },
  });

  const deleteOrder = useMutation({
    mutationFn: async (orderId: string) => {
      if (!orderId) {
        throw new Error("Order ID is required");
      }

      const { error } = await supabase
        .from("orders")
        .delete()
        .eq("id", orderId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["promo-code-orders"] });
      toast({
        title: "Success",
        description: "Order deleted successfully",
      });
      onOpenChange(false);
    },
  });

  const handleStatusUpdate = (status: OrderStatus) => {
    if (!order?.[0]?.id) {
      console.error("No order ID available");
      toast({
        variant: "destructive",
        title: "Error",
        description: "Cannot update status: Order ID is missing",
      });
      return;
    }

    console.log("Handling status update:", { orderId: order[0].id, status });
    updateOrderStatus.mutate({ orderId: order[0].id, status });
  };

  const handleDelete = () => {
    if (!order?.[0]?.id) {
      console.error("No order ID available for deletion");
      toast({
        variant: "destructive",
        title: "Error",
        description: "Cannot delete: Order ID is missing",
      });
      return;
    }

    if (window.confirm("Are you sure you want to delete this order?")) {
      deleteOrder.mutate(order[0].id);
    }
  };

  const handleToggleItem = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  if (!order || order.length === 0) {
    return null;
  }

  // Get the first order for customer info (they all share the same customer info)
  const firstOrder = order[0];

  // Calculate totals from items array if available
  const hasItemsArray = firstOrder.items && Array.isArray(firstOrder.items);
  let calculatedTotal = 0;
  let originalTotal = 0;
  
  if (hasItemsArray) {
    firstOrder.items.forEach((item: any) => {
      const itemOriginalPrice = item.originalPrice || item.price || 0;
      const itemFinalPrice = item.price || 0;
      const quantity = item.quantity || 1;
      
      originalTotal += itemOriginalPrice * quantity;
      calculatedTotal += itemFinalPrice * quantity;
    });
  } else {
    // For old format, sum all order totals
    calculatedTotal = order.reduce((sum, o) => sum + (o.total_price || 0), 0);
    originalTotal = calculatedTotal;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[425px] p-4 sm:p-6 max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold mb-4">
            Order Details {viewOnly && "(View Only)"}
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[calc(90vh-140px)] overflow-y-auto">
          <div className="space-y-4 pr-4">
            {!viewOnly && selectedItems.length > 0 && (
              <div className="flex justify-between items-center bg-red-50 p-3 rounded-lg">
                <span className="text-sm text-red-600">
                  {selectedItems.length} items selected
                </span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteSelectedItems.mutate()}
                  disabled={deleteSelectedItems.isPending}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Selected
                </Button>
              </div>
            )}
            
            <OrderItems 
              items={order} 
              selectedItems={viewOnly ? [] : selectedItems}
              onToggleItem={viewOnly ? undefined : handleToggleItem}
              viewOnly={viewOnly}
            />
            
            <CustomerInfo
              customerName={firstOrder.customer_name}
              phoneNumber={firstOrder.phone_number}
              address={firstOrder.address}
              createdAt={firstOrder.created_at}
              status={firstOrder.status}
              additionalDetails={firstOrder.additional_details}
              promoCode={firstOrder.promo_code}
              originalPrice={originalTotal}
              totalPrice={calculatedTotal}
            />

            {!viewOnly && (
              <OrderActions
                status={firstOrder.status}
                onUpdateStatus={handleStatusUpdate}
                onDelete={handleDelete}
                isUpdating={updateOrderStatus.isPending}
                isDeleting={deleteOrder.isPending}
              />
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDialog;