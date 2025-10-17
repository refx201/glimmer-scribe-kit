import { useState, useEffect } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/lib/cart-context";
import { ScrollArea } from "@/components/ui/scroll-area";
import PaymentMethodSelector from "./payment/PaymentMethodSelector";
import CartHeader from "./cart/CartHeader";
import CartItem from "./cart/CartItem";
import CartPromoCode from "./cart/CartPromoCode";
import CartSummary from "./cart/CartSummary";
import CartCustomerForm from "./cart/CartCustomerForm";
import { formatOrderData } from "@/utils/orderHelpers";
import { sendOrderNotification } from "@/services/orderService";

interface CartProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const Cart = ({ open, onOpenChange }: CartProps) => {
  const { toast } = useToast();
  const { state, updateQuantity, removeItem, clearCart } = useCart();
  const items = state.items;
  const [isLoading] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [isValidatingPromo, setIsValidatingPromo] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number } | null>(null);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string | null>(null);

  const validatePromoCode = async () => {
    if (!promoCode) return;
    setIsValidatingPromo(true);
    try {
      // Fetch promo code
      const { data: promoData, error: promoError } = await supabase
        .from("promo_codes")
        .select("*")
        .eq("code", promoCode.toUpperCase())
        .eq("is_active", true)
        .maybeSingle();

      if (promoError) throw promoError;
      if (!promoData) {
        toast({ variant: "destructive", title: "كود غير صالح", description: "هذا الكود غير صالح أو منتهي الصلاحية" });
        setAppliedPromo(null);
        return;
      }

      // Fetch brand-specific discounts
      const { data: brandDiscounts } = await supabase
        .from("promo_code_brand_discounts")
        .select("brand_id, discount_percentage")
        .eq("promo_code_id", promoData.id);

      // Fetch package-specific discounts
      const { data: packageDiscounts } = await supabase
        .from("promo_code_package_discounts")
        .select("package_id, discount_percentage")
        .eq("promo_code_id", promoData.id);

      // Check if any cart items match the promo code
      let hasMatch = false;
      let maxDiscount = 0;

      // Check if any items have matching brands
      if (brandDiscounts && brandDiscounts.length > 0) {
        const brandIds = brandDiscounts.map(bd => bd.brand_id);
        hasMatch = items.some(item => item.brandId && brandIds.includes(item.brandId));
        if (hasMatch) {
          maxDiscount = Math.max(...brandDiscounts.map(bd => bd.discount_percentage));
        }
      }

      // Check if any items are packages
      if (!hasMatch && packageDiscounts && packageDiscounts.length > 0) {
        const packageIds = packageDiscounts.map(pd => pd.package_id);
        hasMatch = items.some(item => packageIds.includes(item.productId));
        if (hasMatch) {
          maxDiscount = Math.max(...packageDiscounts.map(pd => pd.discount_percentage));
        }
      }

      if (!hasMatch) {
        toast({ variant: "destructive", title: "الكود غير متوافق", description: "هذا الكود لا ينطبق على المنتجات في سلتك" });
        setAppliedPromo(null);
        return;
      }

      setAppliedPromo({ code: promoData.code, discount: maxDiscount });
      toast({ title: "تم تطبيق الكود!", description: `حصلت على خصم ${maxDiscount}%!` });
    } catch (error) {
      toast({ variant: "destructive", title: "خطأ", description: "فشل التحقق من الكود" });
    } finally {
      setIsValidatingPromo(false);
    }
  };

  const handleCheckout = async () => {
    if (!customerName || !phoneNumber || !address || !selectedPaymentMethodId) {
      toast({ variant: "destructive", title: "Error", description: "Please complete all fields." });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const userEmail = session?.user?.email;
      
      console.log("Starting checkout process for", items.length, "items");
      
      // Get payment method details for notification
      const { data: paymentMethod } = await supabase
        .from('payment_methods')
        .select('name, type')
        .eq('id', selectedPaymentMethodId)
        .maybeSingle();
      
      // Validate all items exist before creating order
      for (const item of items) {
        let productExists = false;
        let checkError = null;
        
        // Try packages first, then products
        const packageResult = await supabase
          .from("packages")
          .select('id')
          .eq('id', item.productId)
          .maybeSingle();
          
        if (packageResult.data) {
          productExists = true;
        } else {
          const productResult = await supabase
            .from("products")
            .select('id')
            .eq('id', item.productId)
            .maybeSingle();
          checkError = productResult.error;
          productExists = !!productResult.data;
        }
        
        if (checkError) {
          console.error(`Error checking product:`, checkError);
          throw new Error(`Failed to validate product ID`);
        }
        
        if (!productExists) {
          console.error(`Product ID not found:`, item.productId);
          throw new Error(`Invalid product ID`);
        }
      }
      
      // Get brand and package discounts
      let brandDiscounts: any[] = [];
      let packageDiscounts: any[] = [];
      
      if (appliedPromo) {
        const promoId = (await supabase
          .from("promo_codes")
          .select("id")
          .eq("code", appliedPromo.code)
          .maybeSingle()).data?.id;
          
        if (promoId) {
          const { data: brandData } = await supabase
            .from("promo_code_brand_discounts")
            .select("brand_id, discount_percentage")
            .eq("promo_code_id", promoId);
          brandDiscounts = brandData || [];
          
          const { data: packageData } = await supabase
            .from("promo_code_package_discounts")
            .select("package_id, discount_percentage")
            .eq("promo_code_id", promoId);
          packageDiscounts = packageData || [];
        }
      }

      // Create ONE order with all items including discount info
      const orderItems = items.map(item => {
        const itemPrice = typeof item.price === 'number' ? item.price : Number(item.price);
        const itemQuantity = typeof item.quantity === 'number' ? item.quantity : Number(item.quantity || 1);
        
        // Find applicable discount
        let discountPercent = 0;
        const brandDiscount = brandDiscounts.find(bd => bd.brand_id === item.brandId);
        const packageDiscount = packageDiscounts.find(pd => pd.package_id === item.productId || pd.package_id === item.packageId);
        
        if (brandDiscount) {
          discountPercent = brandDiscount.discount_percentage;
        } else if (packageDiscount) {
          discountPercent = packageDiscount.discount_percentage;
        }
        
        const originalPrice = itemPrice;
        const priceAfterDiscount = discountPercent > 0 
          ? Math.round(originalPrice - (originalPrice * discountPercent / 100))
          : originalPrice;
        
        return {
          product_id: item.productId,
          product_name: item.name,
          productId: item.productId,
          name: item.name,
          quantity: itemQuantity,
          price: priceAfterDiscount,
          originalPrice: originalPrice,
          discountPercent: discountPercent,
          color: item.color?.name || null,
          image: item.image,
          type: 'product'
        };
      });
      
      const orderData = formatOrderData({
        customer_name: userEmail || customerName,
        phone_number: phoneNumber,
        address,
        items: orderItems,
        total_price: total,
        promo_code: appliedPromo?.code || null,
        discount_amount: discount,
        payment_method_id: selectedPaymentMethodId,
        payment_status: "pending",
        status: "pending"
      });

      console.log('Submitting order with data:', orderData);
      const { error } = await supabase.from("orders").insert(orderData);
      
      if (error) {
        console.error("Error creating order:", error);
        throw error;
      }
      
      // Use our enhanced notification function to send order notification
      const notificationResult = await sendOrderNotification({
        customerName: customerName, 
        phoneNumber: phoneNumber, 
        address: address,
        total: total,
        subtotal: subtotal,
        totalDiscount: discount,
        appliedPromo: appliedPromo,
        paymentMethod: paymentMethod || { name: 'Cash on Delivery' }
      }, orderItems);
      
      if (!notificationResult.success) {
        console.warn("Order placed but notification might not have been sent");
      }
      
      toast({ title: "Success", description: "Your order has been placed!" });
      clearCart();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error during checkout:", error);
      toast({ 
        variant: "destructive", 
        title: "Error", 
        description: error.message || "Failed to place order." 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const subtotal = items.reduce((sum, item) => {
    const itemPrice = typeof item.price === 'number' ? item.price : Number(item.price);
    const itemQuantity = typeof item.quantity === 'number' ? item.quantity : Number(item.quantity || 1);
    return sum + itemPrice * itemQuantity;
  }, 0);

  // Calculate discount based on matching items only
  const calculateDiscount = async () => {
    if (!appliedPromo) return 0;

    try {
      // Fetch brand-specific discounts for this promo code
      const { data: brandDiscounts } = await supabase
        .from("promo_code_brand_discounts")
        .select("brand_id, discount_percentage")
        .eq("promo_code_id", (await supabase
          .from("promo_codes")
          .select("id")
          .eq("code", appliedPromo.code)
          .maybeSingle()).data?.id || "");

      // Fetch package-specific discounts for this promo code
      const { data: packageDiscounts } = await supabase
        .from("promo_code_package_discounts")
        .select("package_id, discount_percentage")
        .eq("promo_code_id", (await supabase
          .from("promo_codes")
          .select("id")
          .eq("code", appliedPromo.code)
          .maybeSingle()).data?.id || "");

      let discountAmount = 0;

      // Apply brand-specific discounts
      if (brandDiscounts && brandDiscounts.length > 0) {
        items.forEach(item => {
          const brandDiscount = brandDiscounts.find(bd => bd.brand_id === item.brandId);
          if (brandDiscount) {
            const itemPrice = typeof item.price === 'number' ? item.price : Number(item.price);
            const itemQuantity = typeof item.quantity === 'number' ? item.quantity : Number(item.quantity || 1);
            discountAmount += (itemPrice * itemQuantity * brandDiscount.discount_percentage) / 100;
          }
        });
      }

      // Apply package-specific discounts
      if (packageDiscounts && packageDiscounts.length > 0) {
        items.forEach(item => {
          const packageDiscount = packageDiscounts.find(pd => pd.package_id === item.productId || pd.package_id === item.packageId);
          if (packageDiscount) {
            const itemPrice = typeof item.price === 'number' ? item.price : Number(item.price);
            const itemQuantity = typeof item.quantity === 'number' ? item.quantity : Number(item.quantity || 1);
            discountAmount += (itemPrice * itemQuantity * packageDiscount.discount_percentage) / 100;
          }
        });
      }

      return discountAmount;
    } catch (error) {
      console.error("Error calculating discount:", error);
      return 0;
    }
  };

  const [discount, setDiscount] = useState(0);

  // Recalculate discount when promo code or items change
  useEffect(() => {
    calculateDiscount().then(setDiscount);
  }, [appliedPromo, items]);

  const total = subtotal - discount;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="fixed inset-y-0 right-0 w-full sm:max-w-[450px] p-0 flex flex-col h-full bg-background">
        <CartHeader itemCount={items.length} />
        <ScrollArea className="flex-1 h-full">
          <div className="px-4 py-3">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="animate-spin h-6 w-6" />
              </div>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <ShoppingBag className="w-16 h-16 text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">السلة فارغة</p>
              </div>
            ) : (
                <div className="divide-y">
                {items.map((item) => (
                  <CartItem
                    key={`${item.id}-${item.color?.name || 'default'}-product`}
                    item={{
                      id: item.id,
                      name: item.name,
                      price: item.price,
                      quantity: item.quantity || 1,
                      image: item.image,
                      color: item.color,
                      type: 'product'
                    }}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeItem}
                  />
                ))}
                </div>
            )}
          </div>
          {items.length > 0 && (
            <div className="px-4 pb-4 space-y-4">
              <CartPromoCode
                promoCode={promoCode}
                isValidatingPromo={isValidatingPromo}
                appliedPromo={appliedPromo}
                onPromoCodeChange={setPromoCode}
                onValidatePromo={validatePromoCode}
                onRemovePromo={() => setAppliedPromo(null)}
              />
              <CartCustomerForm
                customerName={customerName}
                phoneNumber={phoneNumber}
                address={address}
                onCustomerNameChange={setCustomerName}
                onPhoneNumberChange={setPhoneNumber}
                onAddressChange={setAddress}
              />
              <PaymentMethodSelector
                selectedMethodId={selectedPaymentMethodId}
                onSelect={setSelectedPaymentMethodId}
              />
              <CartSummary
                subtotal={subtotal}
                discount={discount}
                appliedPromo={appliedPromo}
              />
              <Button
                onClick={handleCheckout}
                disabled={isSubmitting}
                className="w-full h-12 text-base font-semibold bg-foreground text-background hover:bg-foreground/90"
              >
                {isSubmitting ? "جاري المعالجة..." : "Checkout"}
              </Button>
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
