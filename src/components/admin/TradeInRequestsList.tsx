import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Phone, Mail, Smartphone, Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface TradeInRequest {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  brand: string;
  model: string;
  condition: string;
  storage: string;
  accessories: string;
  estimated_price: number;
  status: string;
  notes: string;
  created_at: string;
}

export function TradeInRequestsList() {
  const [requests, setRequests] = useState<TradeInRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('trade_in_requests')
        .select('*')
        .order('created_at', { ascending: false })
        .returns<TradeInRequest[]>();

      if (error) throw error;
      setRequests(data ?? []);
    } catch (error: any) {
      console.error('Error fetching trade-in requests:', error);
      toast.error('فشل تحميل طلبات الاستبدال');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await (supabase as any)
        .from('trade_in_requests')
        .update({ status: newStatus } as any)
        .eq('id' as any, id as any);

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
      approved: { label: 'موافق', variant: 'default' },
      rejected: { label: 'مرفوض', variant: 'destructive' },
      completed: { label: 'مكتمل', variant: 'default' }
    };
    
    const { label, variant } = variants[status] || { label: status, variant: 'default' };
    return <Badge variant={variant}>{label}</Badge>;
  };

  if (loading) {
    return <div className="text-center py-8">جاري التحميل...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">طلبات استبدال الأجهزة</h2>
      
      {requests.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            لا توجد طلبات استبدال حالياً
          </CardContent>
        </Card>
      ) : (
        requests.map((request) => (
          <Card key={request.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{request.customer_name || 'غير محدد'}</CardTitle>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {request.customer_phone && (
                      <Badge variant="outline">
                        <Phone className="h-3 w-3 ml-1" />
                        {request.customer_phone}
                      </Badge>
                    )}
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
                  <p className="text-sm text-muted-foreground">معلومات الجهاز</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Smartphone className="h-4 w-4" />
                    <span className="font-medium">{request.brand} {request.model}</span>
                  </div>
                  <p className="text-sm mt-2">
                    <span className="text-muted-foreground">الحالة:</span> {request.condition}
                  </p>
                  {request.storage && (
                    <p className="text-sm">
                      <span className="text-muted-foreground">المساحة:</span> {request.storage}
                    </p>
                  )}
                  {request.accessories && (
                    <p className="text-sm">
                      <span className="text-muted-foreground">الإكسسوارات:</span> {request.accessories}
                    </p>
                  )}
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">التقييم المالي</p>
                  <p className="text-2xl font-bold text-procell-accent">
                    {request.estimated_price ? `₪${request.estimated_price}` : 'لم يتم التقدير'}
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {new Date(request.created_at).toLocaleDateString('ar-EG')}
                  </div>
                </div>
              </div>

              {request.notes && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">ملاحظات:</p>
                  <p className="text-sm mt-1">{request.notes}</p>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button
                  size="sm"
                  onClick={() => updateStatus(request.id, 'approved')}
                  disabled={request.status === 'approved'}
                >
                  موافقة
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => updateStatus(request.id, 'rejected')}
                  disabled={request.status === 'rejected'}
                >
                  رفض
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateStatus(request.id, 'completed')}
                  disabled={request.status === 'completed'}
                >
                  إكمال
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
