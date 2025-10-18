import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { OrdersTableWrapper } from './OrdersTableWrapper';
import JoinRequestList from './JoinRequestList';
import DeviceRepairRequestsSection from './repair/DeviceRepairRequestsSection';
import { TradeInRequestsList } from './TradeInRequestsList';
import { PurchaseRequestsList } from './PurchaseRequestsList';
import { 
  ShoppingCart, 
  Users, 
  Wrench, 
  RefreshCw, 
  MessageSquare,
  Star,
  CreditCard,
  Package,
  Coins,
  Building
} from 'lucide-react';
import { UserPointsManager } from './UserPointsManager';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ServiceRequestsList } from './ServiceRequestsList';
import { MaintenanceServicesList } from './maintenance/MaintenanceServicesList';
import { PartnerStoriesList } from './partners/PartnerStoriesList';
import { CommissionLevelsList } from './partners/CommissionLevelsList';
import { SuppliersList } from './suppliers/SuppliersList';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  inquiry_type: string;
  message: string;
  status: string;
  created_at: string;
}

export function AdminSections() {
  const [activeTab, setActiveTab] = useState('points');
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchContactMessages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContactMessages(data as any || []);
    } catch (error: any) {
      console.error('Error fetching contact messages:', error);
      toast.error('فشل تحميل رسائل التواصل');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'contact') {
      fetchContactMessages();
    }
  }, [activeTab]);

  const updateMessageStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ status: newStatus } as any)
        .eq('id', id as any);

      if (error) throw error;
      
      toast.success('تم تحديث حالة الرسالة');
      fetchContactMessages();
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast.error('فشل تحديث الحالة');
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      new: { label: 'جديد', variant: 'default' },
      in_progress: { label: 'قيد المعالجة', variant: 'default' },
      resolved: { label: 'تم الحل', variant: 'default' },
      archived: { label: 'مؤرشف', variant: 'secondary' }
    };
    
    const { label, variant } = variants[status] || { label: status, variant: 'default' };
    return <Badge variant={variant}>{label}</Badge>;
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">إدارة الطلبات والخدمات</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-2 w-full p-2">
          <TabsTrigger 
            value="points" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500/20 data-[state=active]:to-amber-500/20 data-[state=active]:border-yellow-500/40"
          >
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <Coins className="h-4 w-4" />
            النقاط
          </TabsTrigger>
          <TabsTrigger
            value="contact" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500/20 data-[state=active]:to-orange-500/20 data-[state=active]:border-yellow-500/40"
          >
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <MessageSquare className="h-4 w-4" />
            رسائل التواصل
          </TabsTrigger>
          <TabsTrigger 
            value="orders" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500/20 data-[state=active]:to-emerald-500/20 data-[state=active]:border-green-500/40"
          >
            <Star className="h-4 w-4 text-green-500 fill-green-500" />
            <ShoppingCart className="h-4 w-4" />
            الطلبات 
          </TabsTrigger>
          <TabsTrigger 
            value="purchase" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20 data-[state=active]:to-pink-500/20 data-[state=active]:border-purple-500/40"
          >
            <Star className="h-4 w-4 text-purple-500 fill-purple-500" />
            <CreditCard className="h-4 w-4" />
            طلبات Purchase
          </TabsTrigger>
          <TabsTrigger 
            value="trade-in" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/20 data-[state=active]:to-cyan-500/20 data-[state=active]:border-blue-500/40"
          >
            <Star className="h-4 w-4 text-blue-500 fill-blue-500" />
            <RefreshCw className="h-4 w-4" />
            استبدال الهاتف
          </TabsTrigger>
          <TabsTrigger value="repairs" className="flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            الصيانة
          </TabsTrigger>
          <TabsTrigger value="join" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            الانضمام
          </TabsTrigger>
          <TabsTrigger 
            value="services" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500/20 data-[state=active]:to-violet-500/20 data-[state=active]:border-indigo-500/40"
          >
            <Star className="h-4 w-4 text-indigo-500 fill-indigo-500" />
            <Package className="h-4 w-4" />
            طلبات الخدمات
          </TabsTrigger>
          <TabsTrigger 
            value="maintenance-services" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500/20 data-[state=active]:to-orange-500/20 data-[state=active]:border-red-500/40"
          >
            <Star className="h-4 w-4 text-red-500 fill-red-500" />
            <Wrench className="h-4 w-4" />
            خدمات الصيانة
          </TabsTrigger>
          <TabsTrigger 
            value="partner-stories" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500/20 data-[state=active]:to-cyan-500/20 data-[state=active]:border-teal-500/40"
          >
            <Star className="h-4 w-4 text-teal-500 fill-teal-500" />
            <Users className="h-4 w-4" />
            قصص الشركاء
          </TabsTrigger>
          <TabsTrigger 
            value="commission-levels" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500/20 data-[state=active]:to-yellow-500/20 data-[state=active]:border-amber-500/40"
          >
            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
            <Coins className="h-4 w-4" />
            مستويات العمولة
          </TabsTrigger>
          <TabsTrigger 
            value="suppliers" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500/20 data-[state=active]:to-teal-500/20 data-[state=active]:border-green-500/40"
          >
            <Star className="h-4 w-4 text-green-500 fill-green-500" />
            <Building className="h-4 w-4" />
            الموردين والوكلاء
          </TabsTrigger>
        </TabsList>

        <TabsContent value="points" className="mt-6">
          <UserPointsManager />
        </TabsContent>

        <TabsContent value="contact" className="mt-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">رسائل التواصل</h2>
            
            {loading ? (
              <div className="text-center py-8">جاري التحميل...</div>
            ) : contactMessages.length === 0 ? (
              <Card>
                <div className="p-8 text-center text-muted-foreground">
                  لا توجد رسائل تواصل حالياً
                </div>
              </Card>
            ) : (
              contactMessages.map((message) => (
                <Card key={message.id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{message.name}</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="outline">{message.email}</Badge>
                        <Badge variant="outline">{message.phone}</Badge>
                      </div>
                    </div>
                    {getStatusBadge(message.status)}
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">الموضوع:</span> {message.subject}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">نوع الاستفسار:</span> {message.inquiry_type}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">الرسالة:</span>
                    </p>
                    <p className="text-sm bg-muted p-3 rounded">{message.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(message.created_at).toLocaleString('ar-EG')}
                    </p>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button
                      size="sm"
                      onClick={() => updateMessageStatus(message.id, 'in_progress')}
                      disabled={message.status === 'in_progress'}
                    >
                      قيد المعالجة
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateMessageStatus(message.id, 'resolved')}
                      disabled={message.status === 'resolved'}
                    >
                      تم الحل
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => updateMessageStatus(message.id, 'archived')}
                      disabled={message.status === 'archived'}
                    >
                      أرشفة
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="orders" className="mt-6">
          <OrdersTableWrapper />
        </TabsContent>

        <TabsContent value="purchase" className="mt-6">
          <PurchaseRequestsList />
        </TabsContent>

        <TabsContent value="trade-in" className="mt-6">
          <TradeInRequestsList />
        </TabsContent>

        <TabsContent value="repairs" className="mt-6">
          <DeviceRepairRequestsSection />
        </TabsContent>

        <TabsContent value="join" className="mt-6">
          <JoinRequestList />
        </TabsContent>

        <TabsContent value="services" className="mt-6">
          <ServiceRequestsList />
        </TabsContent>

        <TabsContent value="maintenance-services" className="mt-6">
          <MaintenanceServicesList />
        </TabsContent>

        <TabsContent value="partner-stories" className="mt-6">
          <PartnerStoriesList />
        </TabsContent>

        <TabsContent value="commission-levels" className="mt-6">
          <CommissionLevelsList />
        </TabsContent>

        <TabsContent value="suppliers" className="mt-6">
          <SuppliersList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
