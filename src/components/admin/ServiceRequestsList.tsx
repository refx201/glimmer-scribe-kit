import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Phone, Mail, Package, Wrench, Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface ServiceRequest {
  id: string;
  service_type: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  device_info: string;
  description: string;
  status: string;
  created_at: string;
}

export function ServiceRequestsList() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('service_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error: any) {
      console.error('Error fetching service requests:', error);
      toast.error('فشل تحميل طلبات الخدمات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('service_requests')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      
      toast.success('تم تحديث حالة الطلب');
      fetchRequests();
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast.error('فشل تحديث الحالة');
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      pending: { label: 'قيد الانتظار', variant: 'default' },
      contacted: { label: 'تم التواصل', variant: 'default' },
      in_progress: { label: 'قيد التنفيذ', variant: 'default' },
      completed: { label: 'مكتمل', variant: 'default' },
      cancelled: { label: 'ملغي', variant: 'destructive' }
    };
    
    const { label, variant } = variants[status] || { label: status, variant: 'default' };
    return <Badge variant={variant}>{label}</Badge>;
  };

  const getServiceIcon = (serviceType: string) => {
    return serviceType === 'repair_services' ? (
      <Wrench className="h-5 w-5 text-green-600" />
    ) : (
      <Package className="h-5 w-5 text-purple-600" />
    );
  };

  const getServiceLabel = (serviceType: string) => {
    return serviceType === 'repair_services' ? 'خدمات الإصلاح' : 'خدمات إضافية';
  };

  if (loading) {
    return <div className="text-center py-8">جاري التحميل...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">طلبات الخدمات</h2>
      
      {requests.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            لا توجد طلبات خدمات حالياً
          </CardContent>
        </Card>
      ) : (
        requests.map((request) => (
          <Card key={request.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {getServiceIcon(request.service_type)}
                    <CardTitle className="text-lg">{request.customer_name}</CardTitle>
                  </div>
                  <Badge variant="outline" className="mb-2">
                    {getServiceLabel(request.service_type)}
                  </Badge>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="outline">
                      <Phone className="h-3 w-3 ml-1" />
                      {request.customer_phone}
                    </Badge>
                    {request.customer_email && (
                      <Badge variant="outline">
                        <Mail className="h-3 w-3 ml-1" />
                        {request.customer_email}
                      </Badge>
                    )}
                  </div>
                </div>
                {getStatusBadge(request.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {request.device_info && (
                <div>
                  <p className="text-sm text-muted-foreground">معلومات الجهاز:</p>
                  <p className="font-medium">{request.device_info}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-muted-foreground">التفاصيل:</p>
                <p className="text-sm mt-1 bg-muted/50 p-3 rounded">{request.description}</p>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {new Date(request.created_at).toLocaleString('ar-EG')}
              </div>

              <div className="flex flex-wrap gap-2 pt-4 border-t">
                <Button
                  size="sm"
                  onClick={() => updateStatus(request.id, 'contacted')}
                  disabled={request.status === 'contacted'}
                >
                  تم التواصل
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateStatus(request.id, 'in_progress')}
                  disabled={request.status === 'in_progress'}
                >
                  قيد التنفيذ
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateStatus(request.id, 'completed')}
                  disabled={request.status === 'completed'}
                >
                  مكتمل
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => updateStatus(request.id, 'cancelled')}
                  disabled={request.status === 'cancelled'}
                >
                  إلغاء
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
