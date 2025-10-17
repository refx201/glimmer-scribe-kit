import { CartItem } from "@/lib/cart-context";

interface OrderNotificationParams {
  customerName: string;
  phoneNumber: string;
  address: string;
  total: number;
  subtotal?: number;
  totalDiscount?: number;
  appliedPromo: { code: string; discount: number } | null;
  paymentMethod: { name: string };
}

export const sendOrderNotification = async (
  params: OrderNotificationParams,
  items: any[]
): Promise<{ success: boolean; message?: string }> => {
  try {
    console.log("Sending order notification", { params, items });
    
    const { supabase } = await import("@/integrations/supabase/client");
    
    const { data, error } = await supabase.functions.invoke('send-telegram-notification', {
      body: {
        type: 'order',
        data: {
          customer_name: params.customerName,
          phone_number: params.phoneNumber,
          address: params.address,
          total_price: params.total,
          subtotal: params.subtotal || params.total,
          total_discount: params.totalDiscount || 0,
          promo_code: params.appliedPromo?.code || null,
          payment_method: params.paymentMethod.name,
          items: items.map(item => ({
            name: item.name,
            quantity: item.quantity,
            originalPrice: item.originalPrice || item.price,
            price: item.price,
            discountPercent: item.discountPercent || 0,
            color: item.color || null
          })),
          created_at: new Date().toISOString()
        }
      }
    });
    if (error) {
      console.error('Error invoking send-telegram-notification:', error);
      throw error;
    }
    console.log('Telegram notification response:', data);
    
    return {
      success: true,
      message: "Order notification sent successfully"
    };
  } catch (error) {
    console.error("Error sending order notification:", error);
    return {
      success: false,
      message: "Failed to send order notification"
    };
  }
};
