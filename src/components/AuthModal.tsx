import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useAuth } from '../lib/auth-context';
import { toast } from 'sonner';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { signIn, signUp, signInWithApple, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('signin');
  
  // Form states
  const [signInData, setSignInData] = useState({
    email: '',
    password: ''
  });
  
  const [signUpData, setSignUpData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signInData.email || !signInData.password) {
      toast.error('جميع الحقول مطلوبة');
      return;
    }

    try {
      await signIn(signInData.email, signInData.password);
      toast.success('تم تسجيل الدخول بنجاح');
      onClose();
      setSignInData({ email: '', password: '' });
    } catch (error: any) {
      console.error('Sign in error:', error);
      if (error.message?.includes('Invalid login credentials')) {
        toast.error('بيانات الدخول غير صحيحة');
      } else if (error.message?.includes('Email not confirmed')) {
        toast.error('يرجى تأكيد البريد الإلكتروني أولاً');
      } else {
        toast.error('حدثت مشكلة في تسجيل الدخول');
      }
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signUpData.name || !signUpData.email || !signUpData.password || !signUpData.confirmPassword) {
      toast.error('جميع الحقول مطلوبة');
      return;
    }

    if (signUpData.password !== signUpData.confirmPassword) {
      toast.error('كلمات المرور غير متطابقة');
      return;
    }

    if (signUpData.password.length < 6) {
      toast.error('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }

    try {
      await signUp(signUpData.email, signUpData.password, signUpData.name);
      toast.success('تم إنشاء الحساب وتسجيل الدخول بنجاح!');
      onClose();
      setSignUpData({ name: '', email: '', password: '', confirmPassword: '' });
    } catch (error: any) {
      console.error('Sign up error:', error);
      if (error.message?.includes('User already registered')) {
        toast.error('هذا البريد الإلكتروني مسجل مسبقاً');
      } else if (error.message?.includes('Password should be at least 6 characters')) {
        toast.error('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      } else {
        toast.error('حدثت مشكلة في إنشاء الحساب');
      }
    }
  };

  const handleAppleSignIn = async () => {
    try {
      await signInWithApple();
    } catch (error: any) {
      console.error('Apple sign in error:', error);
      toast.error('حدثت مشكلة في تسجيل الدخول عبر Apple');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            مرحباً بك في procell
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            سجل دخولك أو أنشئ حساب جديد للاستمتاع بخدماتنا
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">تسجيل الدخول</TabsTrigger>
            <TabsTrigger value="signup">حساب جديد</TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="space-y-4">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email">البريد الإلكتروني</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="أدخل بريدك الإلكتروني"
                    value={signInData.email}
                    onChange={(e) => setSignInData(prev => ({ ...prev, email: e.target.value }))}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signin-password">كلمة المرور</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="signin-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="أدخل كلمة المرور"
                    value={signInData.password}
                    onChange={(e) => setSignInData(prev => ({ ...prev, password: e.target.value }))}
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name">الاسم الكامل</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="أدخل اسمك الكامل"
                    value={signUpData.name}
                    onChange={(e) => setSignUpData(prev => ({ ...prev, name: e.target.value }))}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-email">البريد الإلكتروني</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="أدخل بريدك الإلكتروني"
                    value={signUpData.email}
                    onChange={(e) => setSignUpData(prev => ({ ...prev, email: e.target.value }))}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password">كلمة المرور</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="أدخل كلمة المرور (6 أحرف على الأقل)"
                    value={signUpData.password}
                    onChange={(e) => setSignUpData(prev => ({ ...prev, password: e.target.value }))}
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-confirm">تأكيد كلمة المرور</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="signup-confirm"
                    type={showPassword ? "text" : "password"}
                    placeholder="أعد إدخال كلمة المرور"
                    value={signUpData.confirmPassword}
                    onChange={(e) => setSignUpData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={loading}
              >
                {loading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب جديد'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}