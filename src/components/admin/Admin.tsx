import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminSections } from "./AdminSections";
import ProductList from "@/components/admin/ProductList";
import BrandList from "@/components/admin/BrandList";
import OrdersTable from "@/components/admin/OrdersTable";
import PromoCodeList from "@/components/admin/promo/PromoCodeList";
import RepairCodeList from "@/components/admin/repair/RepairCodeList";
import DeviceRepairRequestsSection from "@/components/admin/repair/DeviceRepairRequestsSection";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Home, Plus, ArrowLeft, Users, Lock, Phone, Activity, MessagesSquare, Package, Image } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import ProductForm from "@/components/admin/ProductForm";
import PackageList from "@/components/admin/packages/PackageList";
import PackageDialog from "@/components/admin/packages/PackageDialog";
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
import SlidingPhotosList from "@/components/admin/photos/SlidingPhotosList";
import { ReviewsList } from "@/components/admin/reviews/ReviewsList";
import { executeSql } from "@/utils/supabaseHelpers";
import { Package as PackageType } from "@/types/package";

const Admin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("sections");
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddPackage, setShowAddPackage] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [editingPackage, setEditingPackage] = useState<PackageType | null>(null);
  const [isUsersUnlocked, setIsUsersUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
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
      
      const { data, error } = await supabase
        .from("orders")
        .select("*, promo_codes(profit_percentage, discount_percentage)")
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching orders:", error);
        throw error;
      }
      
      // Process orders to handle both old and new formats
      const ordersWithProducts = await Promise.all(
        data.map(async (order) => {
          // New format: items array exists
          if (order.items && Array.isArray(order.items) && order.items.length > 0) {
            return { ...order, products: null }; // Items are in the items array
          }
          
          // Old format: single product_id
          if (order.product_id) {
            let productData = null;
            const { data: productResult } = await supabase
              .from("products")
              .select("id, name, image, original_price")
              .eq("id", order.product_id)
              .single();
              
            if (productResult) {
              productData = productResult;
            } else {
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
    staleTime: 1000 * 60 * 5,
  });

  const handleProductEdit = (product: any) => {
    console.log("Editing product:", product);
    setEditingProduct(product);
    setShowAddProduct(true);
  };

  const handlePackageEdit = (pkg: PackageType) => {
    console.log("Editing package:", pkg);
    setEditingPackage(pkg);
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
    <div className="min-h-screen bg-secondary dark:bg-gray-900 p-4 md:p-8">
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
        {activeTab === "products" && (
          <Drawer open={showAddProduct} onOpenChange={setShowAddProduct}>
            <DrawerTrigger asChild>
              <Button onClick={() => setShowAddProduct(true)} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Product
              </Button>
            </DrawerTrigger>
            <DrawerContent className="max-h-[85vh]">
              <div className="mx-auto w-full max-w-4xl">
                <DrawerHeader className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                  <DrawerTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DrawerTitle>
                </DrawerHeader>
                <div className="p-4 pb-0 overflow-y-auto max-h-[calc(85vh-80px)]">
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
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        )}
        {activeTab === "packages" && (
          <Drawer open={showAddPackage} onOpenChange={setShowAddPackage}>
            <DrawerTrigger asChild>
              <Button onClick={() => setShowAddPackage(true)} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Package
              </Button>
            </DrawerTrigger>
            <DrawerContent className="max-h-[85vh]">
              <div className="mx-auto w-full max-w-4xl">
                <DrawerHeader className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                  <DrawerTitle>{editingPackage ? 'Edit Package' : 'Add New Package'}</DrawerTitle>
                </DrawerHeader>
                <div className="p-4 pb-0 overflow-y-auto max-h-[calc(85vh-80px)]">
                  <PackageDialog
                    packageData={editingPackage}
                    onSuccess={() => {
                      // Close drawer
                      setShowAddPackage(false);
                      setEditingPackage(null);
                      // Refresh packages list
                      queryClient.invalidateQueries({ queryKey: ["admin-packages"] });
                    }}
                    onCancel={() => {
                      setShowAddPackage(false);
                      setEditingPackage(null);
                    }}
                  />
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="space-y-6">
            <TabsList className="w-full h-auto flex-wrap gap-x-2 gap-y-4 p-3">
              <TabsTrigger value="analytics" className="gap-2">
                <Activity className="h-4 w-4" />
                التحليلات
              </TabsTrigger>
              <TabsTrigger value="sections" className="gap-2">
                <Package className="h-4 w-4" />
                إدارة الطلبات والخدمات
              </TabsTrigger>
              <TabsTrigger value="users" className="gap-2">
                <Users className="h-4 w-4" />
                المستخدمين المسجلين
              </TabsTrigger>
              <TabsTrigger value="products">المنتجات</TabsTrigger>
              <TabsTrigger value="packages" className="gap-2">
                <Package className="h-4 w-4" />
                الباقات
              </TabsTrigger>
              <TabsTrigger value="featured-products">المنتجات المميزة</TabsTrigger>
              <TabsTrigger value="related-products">المنتجات المرتبطة</TabsTrigger>
              <TabsTrigger value="brands">البراندات</TabsTrigger>
              <TabsTrigger value="orders">الطلبات</TabsTrigger>
              <TabsTrigger value="reviews" className="gap-2">
                <MessagesSquare className="h-4 w-4" />
                التقييمات
              </TabsTrigger>
            </TabsList>

            <TabsList className="w-full h-auto flex-wrap gap-x-2 gap-y-4 p-3">
              <TabsTrigger value="device-repairs">طلبات الصيانة</TabsTrigger>
              <TabsTrigger value="promo-codes">رموز المسوقين</TabsTrigger>
              <TabsTrigger value="repair-codes">رموز الصيانة</TabsTrigger>
              <TabsTrigger value="sliding-photos" className="gap-2">
                <Image className="h-4 w-4" />
                الصور المتحركة
              </TabsTrigger>
              <TabsTrigger value="faqs" className="gap-2">
                <MessagesSquare className="h-4 w-4" />
                الأسئلة الشائعة
              </TabsTrigger>
              <TabsTrigger value="email-broadcasts">بث رسالة ايميل (قريبا لا يعمل)</TabsTrigger>
              <TabsTrigger value="join-requests">طلبات الانضمام للفريق</TabsTrigger>
              <TabsTrigger value="news-ticker">الأخبار</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="analytics">
            <AnalyticsDashboard />
          </TabsContent>

          <TabsContent value="sections">
            <AdminSections />
          </TabsContent>

          <TabsContent value="users">
            {renderUsersContent()}
          </TabsContent>

          <TabsContent value="products">
            <ProductList onEdit={handleProductEdit} />
          </TabsContent>

          <TabsContent value="packages">
            <PackageList onEdit={handlePackageEdit} />
          </TabsContent>

          <TabsContent value="featured-products">
            <FeaturedProducts />
          </TabsContent>

          <TabsContent value="related-products">
            <RelatedProductsList />
          </TabsContent>

          <TabsContent value="brands">
            <BrandList />
          </TabsContent>

          <TabsContent value="orders">
            <OrdersTable orders={orders || []} isLoading={ordersLoading} />
          </TabsContent>

          <TabsContent value="reviews">
            <ReviewsList />
          </TabsContent>

          <TabsContent value="device-repairs">
            <DeviceRepairRequestsSection />
          </TabsContent>

          <TabsContent value="promo-codes">
            <PromoCodeList />
          </TabsContent>

          <TabsContent value="repair-codes">
            <RepairCodeList />
          </TabsContent>

          <TabsContent value="sliding-photos">
            <SlidingPhotosList />
          </TabsContent>

          <TabsContent value="faqs">
            <FAQList />
          </TabsContent>

          <TabsContent value="email-broadcasts">
            <EmailBroadcastList />
          </TabsContent>

          <TabsContent value="join-requests">
            <JoinRequestList />
          </TabsContent>

          <TabsContent value="news-ticker">
            <NewsTickerList />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;