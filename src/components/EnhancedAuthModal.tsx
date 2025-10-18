import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useAuth } from '../lib/auth-context';
import { toast } from 'sonner';
import { Eye, EyeOff, Mail, Lock, User, Smartphone, Shield, Sparkles } from 'lucide-react';
import procellLogo from '../assets/procell-logo.png';
import { GoogleAuthButton } from './GoogleAuthButton';

interface EnhancedAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EnhancedAuthModal({ isOpen, onClose }: EnhancedAuthModalProps) {
  const { signIn, signUp, signInWithGoogle, loading } = useAuth();
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
    phone: '',
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
    
    if (!signUpData.name || !signUpData.email || !signUpData.phone || !signUpData.password || !signUpData.confirmPassword) {
      toast.error('جميع الحقول مطلوبة');
      return;
    }

    // Validate phone format
    const phoneRegex = /^(\+970|0)?[0-9]{9}$/;
    if (!phoneRegex.test(signUpData.phone.replace(/\s/g, ''))) {
      toast.error('رقم الهاتف غير صحيح. يجب أن يكون بصيغة +9705xxxxxxxx');
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
      await signUp(signUpData.email, signUpData.password, signUpData.name, 'customer', signUpData.phone);
      toast.success('تم إنشاء الحساب وتسجيل الدخول بنجاح!');
      onClose();
      setSignUpData({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg border-0 p-0 overflow-hidden bg-white shadow-2xl">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-gradient-to-br from-procell-primary/10 via-transparent to-procell-secondary/10 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-procell-accent/20 rounded-full blur-3xl animate-pulse pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-procell-primary/20 rounded-full blur-2xl animate-pulse pointer-events-none" style={{ animationDelay: '1s' }}></div>
        
        <div className="relative z-0 p-8">
          <DialogHeader className="text-center mb-6 relative z-10">
            {/* PROCELL Logo */}
            <div className="flex justify-center mb-6">
              <div className="relative animate-scale-in">
                <img 
                  src={procellLogo} 
                  alt="procell" 
                  className="h-12 w-auto object-contain"
                />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-procell-accent rounded-full flex items-center justify-center animate-bounce">
                  <Sparkles className="h-2 w-2 text-white" />
                </div>
              </div>
            </div>
            
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-procell-primary to-procell-secondary bg-clip-text text-transparent animate-fade-in">
              مرحباً بك في procell
            </DialogTitle>
            <DialogDescription className="text-muted-foreground mt-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              انضم إلى عائلة ProCell واستمتع بأفضل الهواتف والخدمات المميزة
            </DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-blue-50 to-indigo-50 backdrop-blur-sm border-2 border-blue-200 rounded-2xl p-1.5 gap-2 shadow-lg animate-scale-in" style={{ animationDelay: '0.3s' }}>
              <TabsTrigger 
                value="signin" 
                className="h-14 px-6 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white data-[state=inactive]:bg-white data-[state=inactive]:text-blue-700 data-[state=inactive]:hover:bg-blue-50 data-[state=inactive]:border-2 data-[state=inactive]:border-blue-300 data-[state=active]:shadow-xl data-[state=active]:shadow-blue-500/30 transition-all duration-300 rounded-xl font-semibold text-base"
              >
                <Shield className="h-5 w-5 ml-2" />
                تسجيل الدخول
              </TabsTrigger>
              <TabsTrigger 
                value="signup"
                className="h-14 px-6 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white data-[state=inactive]:bg-white data-[state=inactive]:text-blue-700 data-[state=inactive]:hover:bg-blue-50 data-[state=inactive]:border-2 data-[state=inactive]:border-blue-300 data-[state=active]:shadow-xl data-[state=active]:shadow-blue-500/30 transition-all duration-300 rounded-xl font-semibold text-base"
              >
                <User className="h-5 w-5 ml-2" />
                حساب جديد
              </TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="space-y-6 mt-6 animate-fade-in">
              <form onSubmit={handleSignIn} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="signin-email" className="text-procell-dark font-medium">البريد الإلكتروني</Label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-procell-primary/60 transition-colors group-focus-within:text-procell-primary" />
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="أدخل بريدك الإلكتروني"
                      value={signInData.email}
                      onChange={(e) => setSignInData(prev => ({ ...prev, email: e.target.value }))}
                      className="pl-12 h-12 bg-white/70 backdrop-blur-sm border-procell-primary/20 focus:border-procell-primary rounded-xl transition-all duration-300 hover:bg-white/90 focus:bg-white"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signin-password" className="text-procell-dark font-medium">كلمة المرور</Label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-procell-primary/60 transition-colors group-focus-within:text-procell-primary" />
                    <Input
                      id="signin-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="أدخل كلمة المرور"
                      value={signInData.password}
                      onChange={(e) => setSignInData(prev => ({ ...prev, password: e.target.value }))}
                      className="pl-12 pr-12 h-12 bg-white/70 backdrop-blur-sm border-procell-primary/20 focus:border-procell-primary rounded-xl transition-all duration-300 hover:bg-white/90 focus:bg-white"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-procell-primary/10 rounded-lg transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4 text-procell-primary" /> : <Eye className="h-4 w-4 text-procell-primary" />}
                    </Button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-blue-500"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin ml-2"></div>
                      جاري تسجيل الدخول...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Shield className="h-4 w-4 ml-2" />
                      تسجيل الدخول
                    </div>
                  )}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-procell-primary/10" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-muted-foreground">أو</span>
                </div>
              </div>

              {/* Google Sign In Button */}
              <div className="flex justify-center">
                <GoogleAuthButton />
              </div>
            </TabsContent>

            <TabsContent value="signup" className="space-y-6 mt-6 animate-fade-in">
              <form onSubmit={handleSignUp} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="signup-name" className="text-procell-dark font-medium">الاسم الكامل</Label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-procell-secondary/60 transition-colors group-focus-within:text-procell-secondary" />
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="أدخل اسمك الكامل"
                      value={signUpData.name}
                      onChange={(e) => setSignUpData(prev => ({ ...prev, name: e.target.value }))}
                      className="pl-12 h-12 bg-white/70 backdrop-blur-sm border-procell-secondary/20 focus:border-procell-secondary rounded-xl transition-all duration-300 hover:bg-white/90 focus:bg-white"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-procell-dark font-medium">البريد الإلكتروني</Label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-procell-secondary/60 transition-colors group-focus-within:text-procell-secondary" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="أدخل بريدك الإلكتروني"
                      value={signUpData.email}
                      onChange={(e) => setSignUpData(prev => ({ ...prev, email: e.target.value }))}
                      className="pl-12 h-12 bg-white/70 backdrop-blur-sm border-procell-secondary/20 focus:border-procell-secondary rounded-xl transition-all duration-300 hover:bg-white/90 focus:bg-white"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-phone" className="text-procell-dark font-medium">رقم الهاتف</Label>
                  <div className="relative group">
                    <Smartphone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-procell-secondary/60 transition-colors group-focus-within:text-procell-secondary" />
                    <Input
                      id="signup-phone"
                      type="tel"
                      placeholder="+9705xxxxxxxx"
                      value={signUpData.phone}
                      onChange={(e) => setSignUpData(prev => ({ ...prev, phone: e.target.value }))}
                      className="pl-12 h-12 bg-white/70 backdrop-blur-sm border-procell-secondary/20 focus:border-procell-secondary rounded-xl transition-all duration-300 hover:bg-white/90 focus:bg-white text-left"
                      dir="ltr"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-procell-dark font-medium">كلمة المرور</Label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-procell-secondary/60 transition-colors group-focus-within:text-procell-secondary" />
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="6 أحرف على الأقل"
                        value={signUpData.password}
                        onChange={(e) => setSignUpData(prev => ({ ...prev, password: e.target.value }))}
                        className="pl-12 pr-12 h-12 bg-white/70 backdrop-blur-sm border-procell-secondary/20 focus:border-procell-secondary rounded-xl transition-all duration-300 hover:bg-white/90 focus:bg-white"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-procell-secondary/10 rounded-lg transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4 text-procell-secondary" /> : <Eye className="h-4 w-4 text-procell-secondary" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm" className="text-procell-dark font-medium">تأكيد كلمة المرور</Label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-procell-secondary/60 transition-colors group-focus-within:text-procell-secondary" />
                      <Input
                        id="signup-confirm"
                        type={showPassword ? "text" : "password"}
                        placeholder="أعد إدخال كلمة المرور"
                        value={signUpData.confirmPassword}
                        onChange={(e) => setSignUpData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="pl-12 h-12 bg-white/70 backdrop-blur-sm border-procell-secondary/20 focus:border-procell-secondary rounded-xl transition-all duration-300 hover:bg-white/90 focus:bg-white"
                        required
                      />
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-blue-500"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin ml-2"></div>
                      جاري إنشاء الحساب...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Sparkles className="h-4 w-4 ml-2" />
                      إنشاء حساب جديد
                    </div>
                  )}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-procell-secondary/10" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-muted-foreground">أو</span>
                </div>
              </div>

              {/* Google Sign Up Button */}
              <div className="flex justify-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={async () => {
                    try {
                      await signInWithGoogle();
                    } catch (error: any) {
                      console.error('Google sign in error:', error);
                      toast.error('حدثت مشكلة في تسجيل الدخول عبر Google');
                    }
                  }}
                  className="w-12 h-12 rounded-full p-0 flex items-center justify-center hover:bg-blue-50 border-2 border-procell-secondary/20 hover:border-procell-secondary transition-all duration-300"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          {/* Trust indicators */}
          <div className="mt-8 pt-6 border-t border-procell-primary/10">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="flex flex-col items-center space-y-2 p-3 rounded-lg bg-white/30 backdrop-blur-sm hover:bg-white/50 transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.6s' }}>
                <Shield className="h-5 w-5 text-procell-primary" />
                <span className="text-xs text-procell-dark font-medium">آمن ومضمون</span>
              </div>
              <div className="flex flex-col items-center space-y-2 p-3 rounded-lg bg-white/30 backdrop-blur-sm hover:bg-white/50 transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.7s' }}>
                <Sparkles className="h-5 w-5 text-procell-secondary" />
                <span className="text-xs text-procell-dark font-medium">خدمة مميزة</span>
              </div>
              <div className="flex flex-col items-center space-y-2 p-3 rounded-lg bg-white/30 backdrop-blur-sm hover:bg-white/50 transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.8s' }}>
                <Smartphone className="h-5 w-5 text-procell-accent" />
                <span className="text-xs text-procell-dark font-medium">أحدث الهواتف</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}