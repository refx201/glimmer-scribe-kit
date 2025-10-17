import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Phone, Mail, MapPin, Calendar, Package } from 'lucide-react';
import { toast } from 'sonner';

interface DeviceEvaluationRequest {
  id: string;
  brand: string;
  model: string;
  storage: string;
  condition: string;
  accessories: string[];
  description: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  customer_location: string;
  status: string;
  created_at: string;
}

export function PurchaseRequestsList() {
  const [requests, setRequests] = useState<DeviceEvaluationRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('device_evaluation_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error: any) {
      console.error('Error fetching device evaluation requests:', error);
      toast.error('فشل تحميل طلبات التقييم');
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
        .from('device_evaluation_requests')
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
      evaluated: { label: 'تم التقييم', variant: 'default' },
      completed: { label: 'مكتمل', variant: 'default' },
      cancelled: { label: 'ملغي', variant: 'destructive' }
    };
    
    const { label, variant } = variants[status] || { label: status, variant: 'default' };
    return <Badge variant={variant}>{label}</Badge>;
  };

  if (loading) {
    return <div className="text-center py-8">جاري التحميل...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">طلبات تقييم الأجهزة - Purchase Page</h2>
      
      {requests.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            لا توجد طلبات تقييم حالياً
          </CardContent>
        </Card>
      ) : (
        requests.map((request) => (
          <Card key={request.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{request.customer_name}</CardTitle>
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
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">معلومات الجهاز</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      <span className="font-medium">{request.brand} {request.model}</span>
                    </div>
                    <p className="text-sm">
                      <span className="text-muted-foreground">المساحة:</span> {request.storage}
                    </p>
                    <p className="text-sm">
                      <span className="text-muted-foreground">الحالة:</span> {request.condition}
                    </p>
                    {request.accessories && request.accessories.length > 0 && (
                      <p className="text-sm">
                        <span className="text-muted-foreground">الإكسسوارات:</span> {request.accessories.join(', ')}
                      </p>
                    )}
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-2">معلومات العميل</p>
                  <div className="space-y-1">
                    {request.customer_location && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4" />
                        <span>{request.customer_location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {new Date(request.created_at).toLocaleString('ar-EG')}
                    </div>
                  </div>
                </div>
              </div>

              {request.description && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">الوصف:</p>
                  <p className="text-sm mt-1 bg-muted/50 p-3 rounded">{request.description}</p>
                </div>
              )}

              <div className="flex flex-wrap gap-2 pt-4">
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
                  onClick={() => updateStatus(request.id, 'evaluated')}
                  disabled={request.status === 'evaluated'}
                >
                  تم التقييم
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
