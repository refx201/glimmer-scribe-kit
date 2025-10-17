import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TelegramNotification {
  type: 'order' | 'repair_code' | 'trade_in' | 'repair_request' | 'join_request' | 'contact' | 'device_evaluation' | 'service_request';
  data: any;
}

const formatOrderMessage = (data: any): string => {
  const promoText = data.promo_code 
    ? `\n💰 كود الخصم: ${data.promo_code}` 
    : '';
  
  const hasDiscount = data.total_discount && data.total_discount > 0;
    
  return `
╔══════════════════════════════════╗
    🛒 طلب جديد #${data.order_number || 'N/A'}
╚══════════════════════════════════╝

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
  👤 معلومات العميل
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
📝 الاسم: ${data.customer_name}
📞 الهاتف: ${data.phone_number}
📍 العنوان: ${data.address}

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
  📦 تفاصيل الطلب
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
${data.items?.map((item: any, index: number) => {
  const hasItemDiscount = item.discountPercent && item.discountPercent > 0;
  const originalPrice = item.originalPrice || item.price || 0;
  const finalPrice = item.price || originalPrice;
  const quantity = item.quantity || 1;
  const originalTotal = originalPrice * quantity;
  const finalTotal = finalPrice * quantity;
  const colorInfo = item.color ? `\n   🎨 اللون: ${item.color}` : '';
  
  if (hasItemDiscount) {
    const discountAmount = originalPrice - finalPrice;
    
    return `${index + 1}. ${item.name}${colorInfo}
   📊 الكمية: ${quantity}
   💵 السعر الأصلي للوحدة: ₪${originalPrice.toFixed(2)}
   🎁 الخصم: ${item.discountPercent}% (-₪${discountAmount.toFixed(2)})
   ⚡️ السعر بعد الخصم: ₪${finalPrice.toFixed(2)}
   📦 المجموع الأصلي: ₪${originalTotal.toFixed(2)}
   💰 المجموع بعد الخصم: ₪${finalTotal.toFixed(2)}
   ─────────────────────────`;
  } else {
    return `${index + 1}. ${item.name}${colorInfo}
   📊 الكمية: ${quantity}
   💵 سعر الوحدة: ₪${originalPrice.toFixed(2)}
   💰 المجموع: ₪${originalTotal.toFixed(2)}
   ─────────────────────────`;
  }
}).join('\n') || 'لا توجد منتجات'}

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
  💵 الملخص المالي
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
${hasDiscount ? `💵 المجموع قبل الخصم: ₪${data.subtotal}
🎁 إجمالي الخصم: -₪${data.total_discount}${promoText}
💰 المجموع النهائي: ₪${data.total_price}` : `💵 السعر الإجمالي: ₪${data.total_price}`}
💳 طريقة الدفع: ${data.payment_method || 'الدفع عند الاستلام'}

${data.additional_details ? `📝 تفاصيل إضافية: ${data.additional_details}\n` : ''}
⏰ التاريخ: ${new Date(data.created_at).toLocaleString('ar-EG')}
`;
};

const formatRepairCodeMessage = (data: any): string => {
  return `
🔧 *استخدام كود صيانة*

🎫 *الكود:* ${data.code}
👤 *اسم العميل:* ${data.customer_name}
📱 *الهاتف:* ${data.customer_phone}

💵 *السعر الأصلي:* ₪${data.original_price}
💰 *السعر بعد الخصم:* ₪${data.discounted_price}

⏰ وقت الاستخدام: ${new Date(data.used_at).toLocaleString('ar-EG')}
`;
};

const formatTradeInMessage = (data: any): string => {
  return `
🔄 *طلب استبدال جديد*

👤 *معلومات العميل:*
الاسم: ${data.customer_name || 'غير محدد'}
الهاتف: ${data.customer_phone || 'غير محدد'}
البريد: ${data.customer_email || 'غير محدد'}

📱 *معلومات الجهاز:*
العلامة: ${data.brand}
الموديل: ${data.model}
الحالة: ${data.condition}
المساحة: ${data.storage || 'غير محدد'}
الإكسسوارات: ${data.accessories || 'غير محدد'}

💵 *السعر المقدر:* ₪${data.estimated_price || 'لم يتم التقدير'}

⏰ التاريخ: ${new Date(data.created_at).toLocaleString('ar-EG')}
`;
};

const formatRepairRequestMessage = (data: any): string => {
  return `
🔧 *طلب صيانة جديد*

👤 *معلومات العميل:*
الاسم: ${data.customer_name}
الهاتف: ${data.phone_number}

📱 *نوع الجهاز:* ${data.device_type}
🔍 *وصف المشكلة:* ${data.issue_description}

💵 *التكلفة المقدرة:* ${data.estimated_cost ? `₪${data.estimated_cost}` : 'لم يتم التقدير'}

📝 *ملاحظات:* ${data.notes || 'لا يوجد'}

⏰ التاريخ: ${new Date(data.created_at).toLocaleString('ar-EG')}
`;
};

const formatJoinRequestMessage = (data: any): string => {
  return `
🤝 *طلب انضمام للبرنامج*

👤 *الاسم:* ${data.full_name}
📱 *الهاتف:* ${data.phone_number}

💼 *الخبرة:* ${data.experience}

📝 *كيف يمكنه المساعدة:*
${data.help_description}

⏰ التاريخ: ${new Date(data.created_at).toLocaleString('ar-EG')}
`;
};

const formatContactMessage = (data: any): string => {
  return `
📧 *رسالة تواصل جديدة*

👤 *معلومات المرسل:*
الاسم: ${data.name}
البريد: ${data.email}
الهاتف: ${data.phone}

📋 *الموضوع:* ${data.subject}
🔖 *نوع الاستفسار:* ${data.inquiry_type}

📝 *الرسالة:*
${data.message}

⏰ التاريخ: ${new Date(data.created_at).toLocaleString('ar-EG')}
`;
};

const formatDeviceEvaluationMessage = (data: any): string => {
  return `
💰 *طلب تقييم جهاز جديد*

👤 *معلومات العميل:*
الاسم: ${data.customer_name}
الهاتف: ${data.customer_phone}
البريد: ${data.customer_email || 'غير محدد'}
الموقع: ${data.customer_location || 'غير محدد'}

📱 *معلومات الجهاز:*
العلامة: ${data.brand}
الموديل: ${data.model}
المساحة: ${data.storage}
الحالة: ${data.condition}
الإكسسوارات: ${data.accessories?.join(', ') || 'لا يوجد'}

📝 *وصف إضافي:*
${data.description || 'لا يوجد'}

⏰ التاريخ: ${new Date(data.created_at).toLocaleString('ar-EG')}
`;
};

const formatServiceRequestMessage = (data: any): string => {
  return `
🔔 *طلب خدمة جديد - ${data.service_name || data.service_type}*

👤 *معلومات العميل:*
الاسم: ${data.customer_name}
الهاتف: ${data.customer_phone}
البريد: ${data.customer_email || 'غير محدد'}

📱 *معلومات الجهاز:*
${data.device_info || 'غير محدد'}

📝 *التفاصيل:*
${data.description}

⏰ التاريخ: ${new Date(data.created_at).toLocaleString('ar-EG')}
`;
};

const sendToTelegram = async (message: string): Promise<void> => {
  const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
  const chatId = Deno.env.get('TELEGRAM_CHAT_ID');

  if (!botToken || !chatId) {
    throw new Error('Telegram credentials not configured');
  }

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      // parse_mode removed to avoid Telegram Markdown parsing errors
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Telegram API error: ${error}`);
  }
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, data }: TelegramNotification = await req.json();

    let message = '';
    
    switch (type) {
      case 'order':
        message = formatOrderMessage(data);
        break;
      case 'repair_code':
        message = formatRepairCodeMessage(data);
        break;
      case 'trade_in':
        message = formatTradeInMessage(data);
        break;
      case 'repair_request':
        message = formatRepairRequestMessage(data);
        break;
      case 'join_request':
        message = formatJoinRequestMessage(data);
        break;
      case 'contact':
        message = formatContactMessage(data);
        break;
      case 'device_evaluation':
        message = formatDeviceEvaluationMessage(data);
        break;
      case 'service_request':
        message = formatServiceRequestMessage(data);
        break;
      default:
        throw new Error(`Unknown notification type: ${type}`);
    }

    await sendToTelegram(message);

    return new Response(
      JSON.stringify({ success: true, message: 'Notification sent to Telegram' }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error('Error sending Telegram notification:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
});
