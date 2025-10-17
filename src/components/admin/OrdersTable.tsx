
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import OrderDialog from "./OrderDialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { SearchBar } from "@/components/ui/search-bar";
import { Eye, Trash2, CheckSquare, Square } from "lucide-react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";

interface OrdersTableProps {
  orders: any[];
  isLoading: boolean;
  hideActions?: boolean;
  viewOnlyMode?: boolean;
  onViewOrder?: (orders: any[]) => void;
}

interface Order {
  id: string;
  customer_name: string;
  phone_number: string;
  address: string;
  total_price: number;
  created_at: string;
  status: string;
  quantity: number;
  promo_code?: string;
  items?: Array<{
    id: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
    originalPrice?: number;
    discount?: number;
    color?: any;
    storage?: any;
  }>;
  products?: {
    id: string;
    name: string;
    image: string;
    original_price: number;
  };
  promo_codes?: {
    profit_percentage: number;
    discount_percentage: number;
  };
}

interface CustomerGroup {
  customer_name: string;
  phone_number: string;
  address: string;
  orders: Order[];
  total: number;
  profit: number;
}

type GroupedOrders = Record<string, Record<string, CustomerGroup>>;

const OrdersTable = ({ 
  orders, 
  isLoading, 
  hideActions = false,
  viewOnlyMode = false,
  onViewOrder 
}: OrdersTableProps) => {
  const [selectedCustomerOrders, setSelectedCustomerOrders] = useState<Order[] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const [bulkStatus, setBulkStatus] = useState<string>("");
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  console.log("Orders data:", orders);

  // Group orders by promo code first, then by customer
  const groupedOrders = orders?.reduce<GroupedOrders>((acc, order: Order) => {
    const promoCode = order.promo_code || 'No Promo Code';
    if (!acc[promoCode]) {
      acc[promoCode] = {};
    }
    
    const customerKey = `${order.customer_name}-${order.phone_number}`;
    if (!acc[promoCode][customerKey]) {
      acc[promoCode][customerKey] = {
        customer_name: order.customer_name,
        phone_number: order.phone_number,
        address: order.address || '',
        orders: [],
        total: 0,
        profit: 0
      };
    }
    acc[promoCode][customerKey].orders.push(order);
    
    // Calculate total from items array if available
    let orderTotal = 0;
    if (order.items && Array.isArray(order.items)) {
      orderTotal = order.items.reduce((sum: number, item: any) => {
        return sum + ((item.price || 0) * (item.quantity || 1));
      }, 0);
    } else {
      orderTotal = order.total_price || 0;
    }
    
    acc[promoCode][customerKey].total += Math.round(orderTotal);
    
    // Calculate profit based on the profit_percentage from promo_codes
    if (order.promo_code && order.promo_codes) {
      const profitPercentage = order.promo_codes.profit_percentage || 0;
      
      console.log('Calculating profit for order:', {
        orderTotal,
        profitPercentage,
        items: order.items,
        orderDetails: order
      });
      
      const profit = Math.round(orderTotal * (profitPercentage / 100));
      console.log('Calculated profit:', profit);
      
      acc[promoCode][customerKey].profit += profit;
    }
    
    return acc;
  }, {}) || {};

  const filteredOrders = Object.entries(groupedOrders || {}).reduce<Record<string, CustomerGroup[]>>((acc, [promoCode, customers]) => {
    const filteredCustomers = Object.values(customers).filter((group: CustomerGroup) => 
      group.customer_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    if (filteredCustomers.length > 0) {
      acc[promoCode] = filteredCustomers;
    }
    return acc;
  }, {});

  const grandTotals = Object.values(filteredOrders).reduce((totals, customers) => {
    customers.forEach((customer: CustomerGroup) => {
      totals.total += customer.total;
      totals.profit += customer.profit;
    });
    return totals;
  }, { total: 0, profit: 0 });

  const handleViewOrder = (orders: Order[]) => {
    if (onViewOrder) {
      onViewOrder(orders);
    } else {
      setSelectedCustomerOrders(orders);
    }
  };

  const handleSelectOrder = (customerKey: string, checked: boolean) => {
    const newSelection = new Set(selectedOrders);
    if (checked) {
      newSelection.add(customerKey);
    } else {
      newSelection.delete(customerKey);
    }
    setSelectedOrders(newSelection);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allKeys = Object.entries(filteredOrders).flatMap(([_, customers]) => 
        customers.map((customer: CustomerGroup) => `${customer.customer_name}-${customer.phone_number}`)
      );
      setSelectedOrders(new Set(allKeys));
    } else {
      setSelectedOrders(new Set());
    }
  };

  const handleBulkDelete = async () => {
    try {
      const ordersToDelete = Object.entries(filteredOrders).flatMap(([_, customers]) => 
        customers.filter((customer: CustomerGroup) => 
          selectedOrders.has(`${customer.customer_name}-${customer.phone_number}`)
        ).flatMap(customer => customer.orders.map(order => order.id))
      );

      const { error } = await supabase
        .from("orders")
        .delete()
        .in("id", ordersToDelete);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Deleted ${ordersToDelete.length} orders successfully.`,
      });

      setSelectedOrders(new Set());
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete orders. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleBulkStatusChange = async () => {
    if (!bulkStatus) return;

    try {
      const ordersToUpdate = Object.entries(filteredOrders).flatMap(([_, customers]) => 
        customers.filter((customer: CustomerGroup) => 
          selectedOrders.has(`${customer.customer_name}-${customer.phone_number}`)
        ).flatMap(customer => customer.orders.map(order => order.id))
      );

      console.log("Orders to update:", ordersToUpdate);
      console.log("New status:", bulkStatus);

      if (ordersToUpdate.length === 0) {
        toast({
          title: "Error",
          description: "No orders selected for update.",
          variant: "destructive",
        });
        return;
      }

      // Use a single bulk update for better performance
      const { error, data } = await supabase
        .from("orders")
        .update({ status: bulkStatus })
        .in("id", ordersToUpdate)
        .select();

      if (error) {
        console.error("Bulk update failed:", error);
        throw error;
      }

      console.log("Bulk update successful:", data);

      toast({
        title: "Success",
        description: `Updated status for ${ordersToUpdate.length} orders to ${bulkStatus}.`,
      });

      setSelectedOrders(new Set());
      setBulkStatus("");
      
      // Force a page reload to refresh data
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Bulk status update error:", error);
      toast({
        title: "Error",
        description: "Failed to update order status. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-pulse">Loading orders...</div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="p-4 text-center">
        <p>No orders found.</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
        <div className="mb-4 space-y-4">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search orders by customer..."
          />
          
          {/* Bulk Actions */}
          {!hideActions && !viewOnlyMode && (
            <div className="flex flex-wrap gap-2 items-center bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 p-1">
                  <Checkbox
                    checked={selectedOrders.size > 0 && selectedOrders.size === Object.entries(filteredOrders).flatMap(([_, customers]) => customers).length}
                    onCheckedChange={handleSelectAll}
                    className="h-5 w-5"
                  />
                  <span className="text-sm font-medium select-none">
                    Select all
                  </span>
                </div>
                {selectedOrders.size > 0 && (
                  <div className="bg-primary text-primary-foreground px-3 py-1.5 rounded-full text-sm font-medium">
                    {selectedOrders.size} {selectedOrders.size === 1 ? 'customer' : 'customers'} selected
                  </div>
                )}
              </div>
              
              {selectedOrders.size > 0 && (
                <div className="flex gap-2 ml-auto">
                  <Select value={bulkStatus} onValueChange={setBulkStatus}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Change status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button 
                    onClick={handleBulkStatusChange}
                    disabled={!bulkStatus}
                    size="sm"
                  >
                    Update Status
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete Selected
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete {selectedOrders.size} selected orders? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleBulkDelete}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </div>
          )}
        </div>

        {Object.keys(filteredOrders).length === 0 ? (
          <div className="text-center py-6">
            <p>No orders matching your search criteria.</p>
          </div>
        ) : (
          Object.entries(filteredOrders).map(([promoCode, customers]) => (
            <div key={promoCode} className="mb-8">
              <h3 className="text-lg font-semibold mb-4 bg-primary/5 p-3 rounded-lg">
                {promoCode}
              </h3>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    {!hideActions && !viewOnlyMode && <TableHead className="w-12"></TableHead>}
                    <TableHead className={isMobile ? "hidden" : ""}>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Profit</TableHead>
                    {!hideActions && (
                      viewOnlyMode ? (
                        <TableHead>Actions</TableHead>
                      ) : (
                        <TableHead>Status</TableHead>
                      )
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((group: CustomerGroup) => {
                    const customerKey = `${group.customer_name}-${group.phone_number}`;
                    return (
                      <TableRow
                        key={customerKey}
                        className={(!hideActions && !viewOnlyMode) ? "cursor-pointer hover:bg-gray-50" : ""}
                        onClick={(e) => {
                          if (!hideActions && !viewOnlyMode && !(e.target as HTMLElement).closest('.checkbox-cell')) {
                            handleViewOrder(group.orders);
                          }
                        }}
                      >
                        {!hideActions && !viewOnlyMode && (
                          <TableCell className="checkbox-cell">
                            <div className="flex items-center justify-center p-2">
                              <Checkbox
                                checked={selectedOrders.has(customerKey)}
                                onCheckedChange={(checked) => handleSelectOrder(customerKey, checked as boolean)}
                                onClick={(e) => e.stopPropagation()}
                                className="h-5 w-5"
                              />
                            </div>
                          </TableCell>
                        )}
                       <TableCell className={`whitespace-nowrap ${isMobile ? "hidden" : ""}`}>
                          {formatDate(group.orders[0].created_at)}
                        </TableCell>
                      <TableCell className="whitespace-nowrap">{group.customer_name}</TableCell>
                       <TableCell className="whitespace-nowrap">
                         {/* Show items count from items array or orders count */}
                         {group.orders[0].items && Array.isArray(group.orders[0].items)
                           ? `${group.orders[0].items.length} items`
                           : `${group.orders.length} items`}
                       </TableCell>
                      <TableCell className="whitespace-nowrap">₪{group.total.toLocaleString()}</TableCell>
                      <TableCell className="whitespace-nowrap">₪{group.profit.toLocaleString()}</TableCell>
                      {!hideActions && (
                        viewOnlyMode ? (
                          <TableCell>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex items-center gap-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewOrder(group.orders);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                              View Details
                            </Button>
                          </TableCell>
                        ) : (
                          <TableCell>
                            <span
                              className={`inline-block px-2 py-1 rounded-full text-xs sm:text-sm ${
                                group.orders[0].status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : group.orders[0].status === "in_progress"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {group.orders[0].status}
                            </span>
                          </TableCell>
                        )
                      )}
                    </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ))
        )}

        {/* Grand Totals */}
        <div className="mt-8 border-t pt-4">
          <div className="flex justify-end space-x-8">
            <div className="text-lg">
              <span className="font-semibold">Total Orders:</span>{" "}
              <span className="text-primary">₪{grandTotals.total.toLocaleString()}</span>
            </div>
            <div className="text-lg">
              <span className="font-semibold">Total Profit:</span>{" "}
              <span className="text-primary">₪{grandTotals.profit.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {!onViewOrder && !hideActions && (
        <OrderDialog
          order={selectedCustomerOrders}
          open={!!selectedCustomerOrders}
          onOpenChange={(open) => !open && setSelectedCustomerOrders(null)}
          viewOnly={viewOnlyMode}
        />
      )}
    </>
  );
};

export default OrdersTable;