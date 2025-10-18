import { useState, useEffect } from 'react';
import { useAuth } from '../lib/auth-context';
import { supabase } from '../lib/supabase';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner';
import { User, Mail, Phone, MapPin, Save, Loader2, Shield } from 'lucide-react';
import type { PageType } from '../App';

interface ProfilePageProps {
  onNavigate: (page: PageType) => void;
}

export function ProfilePage({ onNavigate }: ProfilePageProps) {
  const { user, userProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    full_name: '',
    display_name: '',
    phone: '',
    phone_number: '',
    shipping_address: ''
  });

  useEffect(() => {
    if (!user) {
      // Redirect to home if not authenticated
      onNavigate('home');
      return;
    }

    // Fetch profile data from database
    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        if (data) {
          setProfileData({
            full_name: data.full_name || '',
            display_name: data.display_name || '',
            phone: data.phone || '',
            phone_number: data.phone_number || '',
            shipping_address: data.shipping_address || ''
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [user, onNavigate]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profileData.full_name,
          display_name: profileData.display_name,
          phone: profileData.phone,
          phone_number: profileData.phone_number,
          shipping_address: profileData.shipping_address
        })
        .eq('id', user!.id);

      if (error) throw error;

      toast.success('تم حفظ التغييرات بنجاح');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error('حدثت مشكلة في حفظ التغييرات');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  const isGoogleUser = user.app_metadata?.provider === 'google';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-procell-primary to-procell-secondary rounded-full mb-4">
            <User className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            الملف الشخصي
          </h1>
          <p className="text-gray-600">
            إدارة معلوماتك الشخصية وبيانات التواصل
          </p>
        </div>

        {/* Profile Cards */}
        <div className="grid gap-6">
          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-procell-primary" />
                معلومات الحساب
              </CardTitle>
              <CardDescription>
                البريد الإلكتروني وطريقة تسجيل الدخول
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-procell-primary" />
                  البريد الإلكتروني
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={user.email || ''}
                  disabled
                  className="bg-gray-50"
                />
                <p className="text-sm text-gray-500">
                  {isGoogleUser && '✓ تم تسجيل الدخول عبر Google'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-procell-primary" />
                المعلومات الشخصية
              </CardTitle>
              <CardDescription>
                يمكنك تحديث معلوماتك الشخصية هنا
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">الاسم الكامل</Label>
                  <Input
                    id="full_name"
                    type="text"
                    value={profileData.full_name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, full_name: e.target.value }))}
                    placeholder="أدخل اسمك الكامل"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="display_name">الاسم المعروض</Label>
                  <Input
                    id="display_name"
                    type="text"
                    value={profileData.display_name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, display_name: e.target.value }))}
                    placeholder="الاسم الذي سيظهر للآخرين"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-procell-primary" />
                    رقم الهاتف
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+9705xxxxxxxx"
                    dir="ltr"
                    className="text-left"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shipping_address" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-procell-primary" />
                    عنوان الشحن
                  </Label>
                  <Input
                    id="shipping_address"
                    type="text"
                    value={profileData.shipping_address}
                    onChange={(e) => setProfileData(prev => ({ ...prev, shipping_address: e.target.value }))}
                    placeholder="المدينة، الشارع، رقم المبنى"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-procell-primary to-procell-secondary hover:from-procell-primary/90 hover:to-procell-secondary/90"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      جاري الحفظ...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      حفظ التغييرات
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
