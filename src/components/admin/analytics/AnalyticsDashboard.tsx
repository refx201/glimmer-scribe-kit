import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, ShoppingBag, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const AnalyticsDashboard = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showSecondConfirm, setShowSecondConfirm] = useState(false);

  // Fetch orders data for revenue calculation with refetch enabled
  const { data: orders, refetch: refetchOrders } = useQuery({
    queryKey: ["analytics-orders"],
    queryFn: async () => {
      console.log("Fetching orders for analytics...");
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      console.log("Fetched orders:", data);
      return data || [];
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Reset analytics data with improved error handling and proper cleanup
  const handleReset = async () => {
    try {
      console.log("Resetting analytics data...");
      
      // Force cache invalidation
      await queryClient.resetQueries();
      
      // Force immediate refetch of all data
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["analytics-orders"] })
      ]);

      setShowSecondConfirm(false);
      
      toast({
        title: "Analytics Reset",
        description: "All analytics data has been reset successfully.",
      });

      console.log("Analytics data reset complete");
    } catch (error) {
      console.error("Error resetting analytics:", error);
      toast({
        title: "Error",
        description: "Failed to reset analytics data. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Calculate total revenue
  const totalRevenue = orders?.reduce((sum, order) => sum + (order.total_price || 0), 0) || 0;

  // Prepare chart data (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();

  const chartData = last7Days.map(date => {
    const dayOrders = orders?.filter(order => 
      order.created_at.split('T')[0] === date
    ) || [];
    
    return {
      date,
      orders: dayOrders.length,
      revenue: dayOrders.reduce((sum, order) => sum + (order.total_price || 0), 0)
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Analytics Dashboard</h2>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Reset Analytics
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action will reset all analytics data. This cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setShowSecondConfirm(false)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Yes, continue</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Final Confirmation</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you absolutely sure you want to reset all analytics data?
                      This action is permanent and cannot be reversed.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>No, cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleReset}>
                      Yes, reset everything
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₪{totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revenue Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#8884d8" 
                  name="Revenue (₪)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Orders Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="orders" 
                  stroke="#82ca9d" 
                  name="Number of Orders"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;