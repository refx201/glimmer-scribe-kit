import { useState } from 'react';
import { useCart } from '../lib/cart-context';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { sendOrderNotification } from '@/services/orderService';

export function CartSidebar() {
  const { state, closeCart, updateQuantity, removeItem, clearCart } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ 
    code: string; 
    brandDiscounts: { brand_id: string; discount_percentage: number; profit_percentage: number }[] 
  } | null>(null);
  const [isValidatingPromo, setIsValidatingPromo] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const { toast } = useToast();
  
  if (!state.isOpen) return null;

  // Calculate totals with brand-specific discounts
  const calculateTotals = () => {
    let subtotal = state.totalPrice;
    let totalDiscount = 0;

    if (appliedPromo && state.items.length > 0) {
      // Calculate discount for each item based on brand
      state.items.forEach(item => {
        const brandDiscount = appliedPromo.brandDiscounts.find(
          bd => bd.brand_id === item.brandId
        );
        
        if (brandDiscount) {
          const itemTotal = item.price * item.quantity;
          const itemDiscount = Math.round((itemTotal * brandDiscount.discount_percentage) / 100);
          totalDiscount += itemDiscount;
        }
      });
    }

    return { subtotal, discount: totalDiscount, total: subtotal - totalDiscount };
  };

  const { subtotal, discount, total } = calculateTotals();

  const handleValidatePromo = async () => {
    if (!promoCode.trim()) return;
    
    setIsValidatingPromo(true);
    try {
      console.log('🔍 Validating promo code:', promoCode);
      console.log('📦 Cart items:', state.items);
      console.log('🏷️ Cart brand IDs:', state.items.map(item => ({ name: item.name, brandId: item.brandId })));
      
      // Fetch promo code with brand-specific discounts
      const { data: promoData, error: promoError } = await supabase
        .from('promo_codes')
        .select('*')
        .eq('code', promoCode.toUpperCase())
        .eq('is_active', true)
        .maybeSingle();

      console.log('✅ Promo data:', promoData);
      console.log('❌ Promo error:', promoError);

      if (promoError || !promoData) {
        toast({
          title: 'رمز غير صالح',
          description: 'الرمز الذي أدخلته غير صحيح أو منتهي الصلاحية',
          variant: 'destructive',
        });
        return;
      }

      // Fetch brand-specific discounts
      const { data: brandDiscounts, error: brandError } = await supabase
        .from('promo_code_brand_discounts')
        .select('brand_id, discount_percentage, profit_percentage')
        .eq('promo_code_id', promoData.id);

      console.log('💰 Brand discounts:', brandDiscounts);
      console.log('❌ Brand error:', brandError);

      if (brandError) {
        console.error('Error fetching brand discounts:', brandError);
        toast({
          title: 'خطأ',
          description: 'حدث خطأ في جلب معلومات الخصم',
          variant: 'destructive',
        });
        return;
      }

      if (!brandDiscounts || brandDiscounts.length === 0) {
        toast({
          title: 'رمز غير صالح',
          description: 'هذا الرمز غير مرتبط بأي علامة تجارية',
          variant: 'destructive',
        });
        return;
      }

      // Check if any items in cart match the brand discounts
      const cartBrandIds = state.items.map(item => item.brandId).filter(Boolean);
      const matchingBrands = brandDiscounts.filter(bd => cartBrandIds.includes(bd.brand_id));

      console.log('🎯 Matching brands:', matchingBrands);

      if (matchingBrands.length === 0) {
        toast({
          title: 'رمز غير قابل للتطبيق',
          description: 'هذا الرمز لا ينطبق على المنتجات في سلتك',
          variant: 'destructive',
        });
        return;
      }

      setAppliedPromo({
        code: promoData.code,
        brandDiscounts: brandDiscounts,
      });
      
      toast({
        title: 'تم تطبيق الخصم',
        description: `تم تطبيق الخصم على ${matchingBrands.length} منتج من منتجات السلة`,
      });
    } catch (error) {
      console.error('Error validating promo code:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء التحقق من الرمز',
        variant: 'destructive',
      });
    } finally {
      setIsValidatingPromo(false);
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCode('');
  };

  const handleCheckout = async () => {
    if (!customerName || !phoneNumber || !deliveryAddress) {
      toast({
        title: 'معلومات ناقصة',
        description: 'يرجى ملء جميع الحقول المطلوبة',
        variant: 'destructive',
      });
      return;
    }

    setIsCheckingOut(true);
    try {
      // Prepare items with discount info
      const itemsWithDiscount = state.items.map(item => {
        const brandDiscount = appliedPromo?.brandDiscounts.find(
          bd => bd.brand_id === item.brandId
        );
        const discountPercent = brandDiscount?.discount_percentage || 0;
        const originalPrice = item.price;
        const priceAfterDiscount = discountPercent > 0 
          ? Math.round(originalPrice - (originalPrice * discountPercent / 100))
          : originalPrice;
        
        return {
          ...item,
          originalPrice: originalPrice,
          price: priceAfterDiscount,
          discountPercent: discountPercent
        };
      });

      // Create a SINGLE order with ALL items
      const { data, error } = await supabase
        .from('orders')
        .insert({
          customer_name: customerName,
          phone_number: phoneNumber,
          address: deliveryAddress,
          product_id: state.items[0]?.productId || null,
          quantity: state.totalItems,
          total_price: total,
          promo_code: appliedPromo?.code || null,
          status: 'pending',
          items: itemsWithDiscount, // Store items with discount info
        })
        .select()
        .single();

      if (error) throw error;

      // Send Telegram notification with discount details
      const notificationResult = await sendOrderNotification({
        customerName: customerName,
        phoneNumber: phoneNumber,
        address: deliveryAddress,
        total: total,
        subtotal: subtotal,
        totalDiscount: discount,
        appliedPromo: appliedPromo ? {
          code: appliedPromo.code,
          discount: 0 // Not needed anymore
        } : null,
        paymentMethod: { name: 'Cash on Delivery' }
      }, itemsWithDiscount);

      if (!notificationResult.success) {
        console.error('Failed to send Telegram notification:', notificationResult.message);
      }

      // Update promo code usage if applied
      if (appliedPromo) {
        const { data: currentPromo } = await supabase
          .from('promo_codes')
          .select('current_uses')
          .eq('code', appliedPromo.code)
          .single();
        
        if (currentPromo) {
          await supabase
            .from('promo_codes')
            .update({ current_uses: currentPromo.current_uses + 1 })
            .eq('code', appliedPromo.code);
        }
      }

      // Show success message in cart
      toast({
        title: '🎉 تم الطلب بنجاح!',
        description: 'سيتم التواصل معك قريباً لتأكيد الطلب',
        duration: 10000, // 10 seconds
      });

      // Clear cart but KEEP IT OPEN
      clearCart();
      setCustomerName('');
      setPhoneNumber('');
      setDeliveryAddress('');
      setPromoCode('');
      setAppliedPromo(null);
      // Don't close cart - keep it open to show the success message
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء إنشاء الطلب. يرجى المحاولة مرة أخرى',
        variant: 'destructive',
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={closeCart}
      />
      
      {/* Sidebar */}
      <div className="fixed top-0 right-0 h-full w-full sm:w-[480px] bg-white z-50 shadow-2xl overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            <h2 className="text-lg font-bold">سلة التسوق ({state.totalItems})</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={closeCart}
            className="h-8 w-8"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {state.items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)] p-8 text-center">
            <div className="animate-fade-in">
              <ShoppingBag className="h-24 w-24 text-gray-300 mb-4 mx-auto" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">السلة فارغة</h3>
              <p className="text-gray-600 mb-6">ابدأ بإضافة منتجات إلى سلتك</p>
              <Button onClick={closeCart}>تصفح المنتجات</Button>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {/* Cart Items */}
            <div className="space-y-4">
              {state.items.map((item: any) => {
                // Find discount for this item's brand
                const brandDiscount = appliedPromo?.brandDiscounts.find(
                  bd => bd.brand_id === item.brandId
                );
                const discountPercent = brandDiscount?.discount_percentage || 0;
                const itemPrice = discountPercent > 0 
                  ? Math.round(item.price * (1 - discountPercent / 100))
                  : item.price;

                return (
                  <div key={item.id} className="flex gap-3 pb-4 border-b border-gray-100">
                    {/* Product Image */}
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm mb-1 line-clamp-2">{item.name}</h4>
                      {item.color && (
                        <p className="text-xs text-gray-500 mb-1">Color: {item.color.name || item.color}</p>
                      )}
                      <div className="flex items-center gap-2 flex-wrap">
                        {discountPercent > 0 ? (
                          <>
                            <p className="text-primary font-bold text-base">₪{itemPrice.toLocaleString()}</p>
                            <p className="text-xs text-gray-400 line-through">₪{item.price.toLocaleString()}</p>
                            <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">
                              -{discountPercent}%
                            </span>
                          </>
                        ) : (
                          <p className="text-primary font-bold text-base">₪{item.price.toLocaleString()}</p>
                        )}
                      </div>
                    </div>

                    {/* Quantity & Delete */}
                    <div className="flex flex-col items-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    
                    <div className="flex items-center gap-1 border rounded-md">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
            </div>

            {/* Promo Code Section */}
            <div className="space-y-2 p-4 border border-gray-200 rounded-lg">
              <h3 className="text-sm font-medium">هل لديك رمز تخفيض؟</h3>
              {appliedPromo ? (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <span className="flex-1 text-sm text-green-700 font-medium">
                    {appliedPromo.code} - خصم على منتجات محددة
                  </span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 hover:bg-green-100"
                    onClick={handleRemovePromo}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    placeholder="أدخل رمز التخفيض إن كان لديك"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    className="flex-1 border-gray-300"
                  />
                  <Button 
                    variant="secondary" 
                    className="px-6"
                    onClick={handleValidatePromo}
                    disabled={isValidatingPromo || !promoCode.trim()}
                  >
                    {isValidatingPromo ? 'جاري التحقق...' : 'تأكيد'}
                  </Button>
                </div>
              )}
            </div>

            {/* Customer Info Form */}
            <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
              <div className="space-y-2">
                <label className="text-sm font-medium">الاسم الكامل *</label>
                <Input
                  placeholder="أدخل اسمك الكامل"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">رقم الهاتف مع مفتاح الدولة (مثل: 05x) *</label>
                <Input
                  placeholder="+9705xxxxxxxx"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  dir="ltr"
                  className="border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">عنوان التوصيل *</label>
                <Input
                  placeholder="أدخل عنوان التوصيل"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="border-gray-300"
                />
              </div>

            </div>

            {/* Summary */}
            <div className="space-y-3 pt-4 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">المجموع الفرعي:</span>
                <span className="font-bold">₪{subtotal.toLocaleString()}</span>
              </div>
              {appliedPromo && discount > 0 && (
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-sm text-green-600">
                    <span>الخصم:</span>
                    <span className="font-bold">-₪{discount.toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-gray-500 text-right">
                    * الخصم مطبق على المنتجات المؤهلة فقط
                  </p>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold border-t pt-3">
                <span>المجموع:</span>
                <span className="text-primary">₪{total.toLocaleString()}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <Button 
              className="w-full h-12 text-base font-bold"
              disabled={!customerName || !phoneNumber || !deliveryAddress || isCheckingOut}
              onClick={handleCheckout}
            >
              {isCheckingOut ? 'جاري الطلب...' : 'إتمام الطلب'}
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
