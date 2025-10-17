import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Loader2, Package, MapPin, Phone, User } from "lucide-react";
import { CartItem } from "@/lib/cart-context";

interface CartCheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cartItems: CartItem[];
  totalPrice: number;
  onSuccess: () => void;
  appliedPromo?: { code: string; brandDiscounts: { brand_id: string; discount_percentage: number; profit_percentage: number }[] } | null;
}

export function CartCheckoutDialog({
  open,
  onOpenChange,
  cartItems,
  totalPrice,
  onSuccess,
  appliedPromo = null,
}: CartCheckoutDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: "",
    phone_number: "",
    address: "",
    additional_details: "",
  });

  const generateOrderNumber = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `ORD-${timestamp}-${random}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Generate unique order number
      const orderNumber = generateOrderNumber();

      // Calculate totals with discounts
      const calculateTotals = () => {
        let subtotal = totalPrice;
        let totalDiscount = 0;

        if (appliedPromo && cartItems.length > 0) {
          cartItems.forEach(item => {
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

      // Prepare items data with discount info
      const itemsData = cartItems.map((item) => {
        const brandDiscount = appliedPromo?.brandDiscounts.find(
          bd => bd.brand_id === item.brandId
        );
        const discountPercent = brandDiscount?.discount_percentage || 0;
        const originalPrice = item.price;
        const priceAfterDiscount = discountPercent > 0 
          ? Math.round(originalPrice - (originalPrice * discountPercent / 100))
          : originalPrice;
        
        return {
          productId: item.productId,
          name: item.name,
          price: priceAfterDiscount,
          originalPrice: originalPrice,
          discountPercent: discountPercent,
          quantity: item.quantity,
          color: item.color,
          storage: item.storage,
          image: item.image,
        };
      });

      // Create a single order with all items
      const { data, error } = await supabase.from("orders").insert({
        order_number: orderNumber,
        customer_name: formData.customer_name,
        phone_number: formData.phone_number,
        address: formData.address,
        additional_details: formData.additional_details,
        total_price: total,
        items: itemsData,
        quantity: cartItems.reduce((sum, item) => sum + item.quantity, 0),
        status: "pending",
        payment_status: "pending",
        promo_code: appliedPromo?.code || null,
      }).select();

      if (error) throw error;

      // Send Telegram notification with discount details
      const { sendOrderNotification } = await import("@/services/orderService");
      await sendOrderNotification(
        {
          customerName: formData.customer_name,
          phoneNumber: formData.phone_number,
          address: formData.address,
          total: total,
          subtotal: subtotal,
          totalDiscount: discount,
          appliedPromo: appliedPromo ? {
            code: appliedPromo.code,
            discount: 0
          } : null,
          paymentMethod: { name: "Cash on Delivery" },
        },
        itemsData
      );

      // Show success animation with toast
      toast({
        title: "🎉 Order Placed Successfully!",
        description: (
          <div className="space-y-2 animate-fade-in">
            <p className="font-semibold">Order number: {orderNumber}</p>
            <p className="text-sm">We'll contact you shortly to confirm your order!</p>
          </div>
        ),
        duration: 5000,
      });

      // Reset form
      setFormData({
        customer_name: "",
        phone_number: "",
        address: "",
        additional_details: "",
      });

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Order creation error:", error);
      toast({
        title: "Order Failed",
        description: "Failed to create order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Complete Your Order
          </DialogTitle>
          <DialogDescription>
            Enter your delivery information to complete the order
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Order Summary */}
          <div className="bg-blue-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total Items:</span>
              <span className="font-semibold">
                {cartItems.reduce((sum, item) => sum + item.quantity, 0)} items
              </span>
            </div>
            {(() => {
              const calculateTotals = () => {
                let subtotal = totalPrice;
                let totalDiscount = 0;

                if (appliedPromo && cartItems.length > 0) {
                  cartItems.forEach(item => {
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
              
              return (
                <>
                  {appliedPromo && discount > 0 && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-semibold">₪{subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Discount ({appliedPromo.code}):</span>
                        <span>-₪{discount.toLocaleString()}</span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between">
                    <span className="font-semibold">Total Amount:</span>
                    <span className="font-bold text-lg text-blue-600">
                      ₪{(appliedPromo && discount > 0 ? total : totalPrice).toLocaleString()}
                    </span>
                  </div>
                </>
              );
            })()}
          </div>

          {/* Customer Name */}
          <div className="space-y-2">
            <Label htmlFor="customer_name" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Full Name *
            </Label>
            <Input
              id="customer_name"
              value={formData.customer_name}
              onChange={(e) =>
                setFormData({ ...formData, customer_name: e.target.value })
              }
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="phone_number" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Phone Number *
            </Label>
            <Input
              id="phone_number"
              type="tel"
              value={formData.phone_number}
              onChange={(e) =>
                setFormData({ ...formData, phone_number: e.target.value })
              }
              placeholder="05xxxxxxxx"
              required
            />
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Delivery Address *
            </Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              placeholder="City, Street, Building number, Floor..."
              required
              rows={3}
            />
          </div>

          {/* Additional Details */}
          <div className="space-y-2">
            <Label htmlFor="additional_details">
              Additional Details (Optional)
            </Label>
            <Textarea
              id="additional_details"
              value={formData.additional_details}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  additional_details: e.target.value,
                })
              }
              placeholder="Any special instructions or notes..."
              rows={2}
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Package className="h-4 w-4 mr-2" />
                Place Order
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
