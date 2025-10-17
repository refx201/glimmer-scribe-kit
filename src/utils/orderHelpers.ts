export function calculateOrderTotal(items: any[], promoDiscount: number = 0): number {
  const subtotal = items.reduce((total, item) => {
    return total + (item.price * item.quantity)
  }, 0)
  
  const discount = subtotal * (promoDiscount / 100)
  return subtotal - discount
}

export function formatOrderStatus(status: string): { label: string; color: string } {
  switch (status) {
    case 'pending':
      return { label: 'في الانتظار', color: 'yellow' }
    case 'confirmed':
      return { label: 'مؤكد', color: 'blue' }
    case 'processing':
      return { label: 'قيد التحضير', color: 'orange' }
    case 'shipped':
      return { label: 'تم الشحن', color: 'purple' }
    case 'delivered':
      return { label: 'تم التسليم', color: 'green' }
    case 'cancelled':
      return { label: 'ملغي', color: 'red' }
    default:
      return { label: status, color: 'gray' }
  }
}

export function getOrderStatusSteps(currentStatus: string): Array<{ status: string; label: string; completed: boolean }> {
  const steps = [
    { status: 'pending', label: 'في الانتظار' },
    { status: 'confirmed', label: 'مؤكد' },
    { status: 'processing', label: 'قيد التحضير' },
    { status: 'shipped', label: 'تم الشحن' },
    { status: 'delivered', label: 'تم التسليم' }
  ]
  
  const currentIndex = steps.findIndex(step => step.status === currentStatus)
  
  return steps.map((step, index) => ({
    ...step,
    completed: index <= currentIndex
  }))
}

export function formatCurrency(amount: number, currency: string = "ILS"): string {
  return new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

export const formatOrderData = (data: any) => {
  return {
    ...data,
    created_at: new Date().toISOString()
  };
};