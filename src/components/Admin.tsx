import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductList from "@/components/admin/ProductList";
import BrandList from "@/components/admin/BrandList";
import OrdersTable from "@/components/admin/OrdersTable";
import PromoCodeList from "@/components/admin/promo/PromoCodeList";
import RepairCodeList from "@/components/admin/repair/RepairCodeList";
import DeviceRepairRequestsSection from "@/components/admin/repair/DeviceRepairRequestsSection";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Home, Plus, ArrowLeft, Users, Lock, Phone, Activity, MessagesSquare, Package as PackageIcon, Image } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ProductForm from "@/components/admin/ProductForm";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { EmailBroadcastList } from "@/components/admin/email/EmailBroadcastList";
import JoinRequestList from "@/components/admin/JoinRequestList";
import NewsTickerList from "@/components/admin/news/NewsTickerList";
import FeaturedProducts from "@/components/admin/FeaturedProducts";
import RelatedProductsList from "@/components/admin/RelatedProductsList";
import AnalyticsDashboard from "@/components/admin/analytics/AnalyticsDashboard";
import FAQList from "@/components/admin/faq/FAQList";
import PackageList from "@/components/admin/packages/PackageList";
import PackageDialog from "@/components/admin/packages/PackageDialog";
import { Package as PackageType } from "@/types/package";
import SlidingPhotosList from "@/components/admin/photos/SlidingPhotosList";
import { executeSql } from "@/utils/supabaseHelpers";

const Admin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("users");
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddPackage, setShowAddPackage] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [editingPackage, setEditingPackage] = useState<PackageType | null>(null);
  const [isUsersUnlocked, setIsUsersUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const USERS_PASSWORD = "admin123";

  const { data: users, isLoading: usersLoading, error: usersError } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      console.log("Fetching registered users...");
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("*")
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching users:", error);
        throw error;
      }
      
      console.log("Fetched users with profiles:", profiles);
      return profiles;
    },
    enabled: isUsersUnlocked,
    retry: 3,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const { data: orders, isLoading: ordersLoading, error: ordersError } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      console.log("Fetching orders...");
      
      // Using a simpler query that doesn't rely on foreign key relationships
      const { data, error } = await supabase
        .from("orders")
        .select("*, promo_codes(profit_percentage, discount_percentage)")
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching orders:", error);
        throw error;
      }
      
      // Get product details separately if needed
      const ordersWithProducts = await Promise.all(
        data.map(async (order) => {
          if (order.product_id) {
            // Try to get from products table
            let productData = null;
            const { data: productResult } = await supabase
              .from("products")
              .select("id, name, image, original_price")
              .eq("id", order.product_id)
              .single();
              
            if (productResult) {
              productData = productResult;
            } else {
              // Use executeSql to safely query the packages table
              const { data: packageResult, error: packageError } = await executeSql(`
                SELECT id, name, image, original_price 
                FROM packages 
                WHERE id = '${order.product_id}'
                LIMIT 1
              `);
              
              if (!packageError && packageResult && packageResult.length > 0) {
                productData = packageResult[0];
              }
            }
            
            return { ...order, products: productData };
          }
          return order;
        })
      );
      
      console.log("Fetched orders with products:", ordersWithProducts);
      return ordersWithProducts;
    },
    retry: 3,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const handleProductEdit = (product: any) => {
    console.log("Editing product:", product);
    setEditingProduct(product);
    setShowAddProduct(true);
  };

  const handlePackageEdit = (packageItem: PackageType) => {
    console.log("Editing package:", packageItem);
    setEditingPackage(packageItem);
    setShowAddPackage(true);
  };

  const handleDialogClose = () => {
    setShowAddProduct(false);
    setEditingProduct(null);
  };

  const handlePackageDialogClose = () => {
    setShowAddPackage(false);
    setEditingPackage(null);
  };

  const handleUnlockUsers = () => {
    if (password === USERS_PASSWORD) {
      setIsUsersUnlocked(true);
      setPassword("");
      toast({
        title: "Access Granted",
        description: "You can now view registered users.",
      });
    } else {
      toast({
        title: "Access Denied",
        description: "Incorrect password. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderUsersContent = () => {
    if (!isUsersUnlocked) {
      return (
        <div className="bg-white rounded-lg p-6">
          <div className="max-w-md mx-auto space-y-4">
            <div className="text-center space-y-2">
              <Lock className="h-12 w-12 mx-auto text-gray-400" />
              <h2 className="text-xl font-bold">Protected Section</h2>
              <p className="text-sm text-gray-500">
                Please enter the password to view registered users
              </p>
            </div>
            <div className="flex gap-2">
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleUnlockUsers()}
              />
              <Button onClick={handleUnlockUsers}>Unlock</Button>
            </div>
          </div>
        </div>
      );
    }

    if (usersLoading) {
      return (
        <div className="bg-white rounded-lg p-6 flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      );
    }

    if (usersError) {
      return (
        <div className="bg-white rounded-lg p-6 flex items-center justify-center h-64 text-red-500">
          Error loading users. Please try again later.
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Users className="h-5 w-5" />
            Registered Users ({users?.length || 0})
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsUsersUnlocked(false)}
            className="gap-2"
          >
            <Lock className="h-4 w-4" />
            Lock Section
          </Button>
        </div>
        {users?.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            No registered users found
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Registration Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.email}</TableCell>
                  <TableCell className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    {user.phone_number || 'Not provided'}
                  </TableCell>
                  <TableCell>
                    {new Date(user.created_at).toLocaleDateString()} at{' '}
                    {new Date(user.created_at).toLocaleTimeString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-secondary dark:bg-gray-900 p-4 md:p-8 pt-20">
      <div className="flex justify-between items-center mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>
        <h1 className="text-3xl font-bold text-primary dark:text-white">
          Admin Dashboard
        </h1>
        <div className="flex gap-2 mt-10">
          {activeTab === "products" && (
            <Dialog open={showAddProduct} onOpenChange={setShowAddProduct}>
              <DialogTrigger asChild>
                <Button onClick={() => setShowAddProduct(true)} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                </DialogHeader>
                <ProductForm
                  onSuccess={() => {
                    setShowAddProduct(false);
                    setEditingProduct(null);
                  }}
                  onCancel={() => {
                    setShowAddProduct(false);
                    setEditingProduct(null);
                  }}
                  editingProduct={editingProduct}
                />
              </DialogContent>
            </Dialog>
          )}
          {activeTab === "packages" && (
            <Dialog open={showAddPackage} onOpenChange={setShowAddPackage}>
              <DialogTrigger asChild>
                <Button onClick={() => setShowAddPackage(true)} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Package
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>{editingPackage ? 'Edit Package' : 'Add New Package'}</DialogTitle>
                </DialogHeader>
                <PackageDialog
                  packageData={editingPackage}
                  onSuccess={() => {
                    setShowAddPackage(false);
                    setEditingPackage(null);
                  }}
                  onCancel={() => {
                    setShowAddPackage(false);
                    setEditingPackage(null);
                  }}
                />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="border-b p-4">
            <div className="space-y-2">
              <TabsList className="w-full h-auto flex-wrap">
                <TabsTrigger value="analytics" className="gap-2">
                  <Activity className="h-4 w-4" />
                  التحليلات
                </TabsTrigger>
                <TabsTrigger value="users" className="gap-2">
                  <Users className="h-4 w-4" />
                  المستخدمين المسجلين
                </TabsTrigger>
                <TabsTrigger value="products">المنتجات</TabsTrigger>
                <TabsTrigger value="packages" className="gap-2">
                  <PackageIcon className="h-4 w-4" />
                  الباقات
                </TabsTrigger>
                <TabsTrigger value="featured-products">المنتجات المميزة</TabsTrigger>
                <TabsTrigger value="related-products">المنتجات المرتبطة</TabsTrigger>
                <TabsTrigger value="brands">البراندات</TabsTrigger>
                <TabsTrigger value="orders">الطلبات</TabsTrigger>
              </TabsList>

              <TabsList className="w-full h-auto flex-wrap">
                <TabsTrigger value="device-repairs">طلبات الصيانة</TabsTrigger>
                <TabsTrigger value="promo-codes">رموز المسوقين</TabsTrigger>
                <TabsTrigger value="repair-codes">رموز الصيانة</TabsTrigger>
                <TabsTrigger value="faqs" className="gap-2">
                  <MessagesSquare className="h-4 w-4" />
                  الأسئلة الشائعة
                </TabsTrigger>
                <TabsTrigger value="email-broadcasts">بث رسالة ايميل (قريبا لا يعمل)</TabsTrigger>
                <TabsTrigger value="join-requests">طلبات الانضمام للفريق</TabsTrigger>
                <TabsTrigger value="news-ticker">الأخبار</TabsTrigger>
                <TabsTrigger value="sliding-photos" className="gap-2">
                  <Image className="h-4 w-4" />
                  الصور المتحركة
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          <TabsContent value="analytics" className="p-6">
            <AnalyticsDashboard />
          </TabsContent>

          <TabsContent value="users" className="p-6">
            {renderUsersContent()}
          </TabsContent>

          <TabsContent value="products" className="p-6">
            <ProductList onEdit={handleProductEdit} />
          </TabsContent>

          <TabsContent value="packages" className="p-6">
            <PackageList onEdit={handlePackageEdit} />
          </TabsContent>

          <TabsContent value="featured-products" className="p-6">
            <FeaturedProducts />
          </TabsContent>

          <TabsContent value="related-products" className="p-6">
            <RelatedProductsList />
          </TabsContent>

          <TabsContent value="brands" className="p-6">
            <BrandList />
          </TabsContent>

          <TabsContent value="orders" className="p-6">
            <OrdersTable orders={orders || []} isLoading={ordersLoading} />
          </TabsContent>

          <TabsContent value="device-repairs" className="p-6">
            <DeviceRepairRequestsSection />
          </TabsContent>

          <TabsContent value="promo-codes" className="p-6">
            <PromoCodeList />
          </TabsContent>

          <TabsContent value="repair-codes" className="p-6">
            <RepairCodeList />
          </TabsContent>

          <TabsContent value="email-broadcasts" className="p-6">
            <EmailBroadcastList />
          </TabsContent>

          <TabsContent value="join-requests" className="p-6">
            <JoinRequestList />
          </TabsContent>

          <TabsContent value="news-ticker" className="p-6">
            <NewsTickerList />
          </TabsContent>

          <TabsContent value="faqs" className="p-6">
            <FAQList />
          </TabsContent>

          <TabsContent value="sliding-photos" className="p-6">
            <SlidingPhotosList />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;