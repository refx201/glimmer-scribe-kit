interface CartSummaryProps {
  subtotal: number;
  discount: number;
  appliedPromo: { code: string; discount: number } | null;
}

const CartSummary = ({ subtotal, discount, appliedPromo }: CartSummaryProps) => {
  const total = subtotal - discount;

  return (
    <div className="space-y-3 pt-4 border-t">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">المجموع الفرعي:</span>
        <span className="font-medium">₪{subtotal.toLocaleString()}</span>
      </div>
      {appliedPromo && (
        <div className="flex justify-between text-sm text-success">
          <span>الخصم ({appliedPromo.discount}%)</span>
          <span>-₪{discount.toLocaleString()}</span>
        </div>
      )}
      <div className="flex justify-between text-base font-bold pt-2 border-t">
        <span>المجموع:</span>
        <span className="text-primary">₪{total.toLocaleString()}</span>
      </div>
    </div>
  );
};

export default CartSummary;
