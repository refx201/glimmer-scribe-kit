import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Wrench, Package } from 'lucide-react';

interface ServiceRequestForm {
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  device_info: string;
  description: string;
}

export function AdditionalServicesDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<ServiceRequestForm>({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    device_info: '',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: newRequest, error } = await supabase
        .from('service_requests')
        .insert([{
          service_type: 'additional_services',
          ...form,
          status: 'pending'
        }])
        .select()
        .single();

      if (error) throw error;

      // Send Telegram notification
      try {
        await supabase.functions.invoke('send-telegram-notification', {
          body: {
            type: 'service_request',
            data: { ...newRequest, service_name: 'خدمات إضافية' }
          }
        });
      } catch (notifError) {
        console.error('Failed to send Telegram notification:', notifError);
      }

      toast.success('تم إرسال طلبك بنجاح! سنتواصل معك قريباً');
      setForm({
        customer_name: '',
        customer_phone: '',
        customer_email: '',
        device_info: '',
        description: ''
      });
      setOpen(false);
    } catch (error: any) {
      console.error('Error submitting service request:', error);
      toast.error('فشل إرسال الطلب. يرجى المحاولة مرة أخرى');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold text-lg px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <Package className="h-6 w-6 ml-2" />
          خدمات إضافية
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">📦 طلب خدمات إضافية</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">الاسم الكامل *</Label>
            <Input
              id="name"
              required
              value={form.customer_name}
              onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
              placeholder="أدخل اسمك الكامل"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">رقم الهاتف *</Label>
            <Input
              id="phone"
              type="tel"
              required
              value={form.customer_phone}
              onChange={(e) => setForm({ ...form, customer_phone: e.target.value })}
              placeholder="05xxxxxxxx"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <Input
              id="email"
              type="email"
              value={form.customer_email}
              onChange={(e) => setForm({ ...form, customer_email: e.target.value })}
              placeholder="email@example.com"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="device">معلومات الجهاز</Label>
            <Input
              id="device"
              value={form.device_info}
              onChange={(e) => setForm({ ...form, device_info: e.target.value })}
              placeholder="مثال: iPhone 14 Pro"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">تفاصيل الخدمة المطلوبة *</Label>
            <Textarea
              id="description"
              required
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="اشرح الخدمة التي تحتاجها..."
              rows={4}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'جاري الإرسال...' : 'إرسال الطلب'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function RepairServicesDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<ServiceRequestForm>({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    device_info: '',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: newRequest, error } = await supabase
        .from('service_requests')
        .insert([{
          service_type: 'repair_services',
          ...form,
          status: 'pending'
        }])
        .select()
        .single();

      if (error) throw error;

      // Send Telegram notification
      try {
        await supabase.functions.invoke('send-telegram-notification', {
          body: {
            type: 'service_request',
            data: { ...newRequest, service_name: 'خدمات الإصلاح' }
          }
        });
      } catch (notifError) {
        console.error('Failed to send Telegram notification:', notifError);
      }

      toast.success('تم إرسال طلبك بنجاح! سنتواصل معك قريباً');
      setForm({
        customer_name: '',
        customer_phone: '',
        customer_email: '',
        device_info: '',
        description: ''
      });
      setOpen(false);
    } catch (error: any) {
      console.error('Error submitting service request:', error);
      toast.error('فشل إرسال الطلب. يرجى المحاولة مرة أخرى');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-bold text-lg px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <Wrench className="h-6 w-6 ml-2" />
          خدمات الإصلاح
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">🔧 طلب خدمة إصلاح</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="repair-name">الاسم الكامل *</Label>
            <Input
              id="repair-name"
              required
              value={form.customer_name}
              onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
              placeholder="أدخل اسمك الكامل"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="repair-phone">رقم الهاتف *</Label>
            <Input
              id="repair-phone"
              type="tel"
              required
              value={form.customer_phone}
              onChange={(e) => setForm({ ...form, customer_phone: e.target.value })}
              placeholder="05xxxxxxxx"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="repair-email">البريد الإلكتروني</Label>
            <Input
              id="repair-email"
              type="email"
              value={form.customer_email}
              onChange={(e) => setForm({ ...form, customer_email: e.target.value })}
              placeholder="email@example.com"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="repair-device">نوع الجهاز *</Label>
            <Input
              id="repair-device"
              required
              value={form.device_info}
              onChange={(e) => setForm({ ...form, device_info: e.target.value })}
              placeholder="مثال: iPhone 14 Pro، Samsung Galaxy S23"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="repair-description">وصف المشكلة *</Label>
            <Textarea
              id="repair-description"
              required
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="اشرح المشكلة التي تواجهها مع جهازك..."
              rows={4}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'جاري الإرسال...' : 'إرسال الطلب'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
