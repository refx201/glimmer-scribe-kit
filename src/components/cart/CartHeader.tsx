import { ShoppingBag } from "lucide-react";

interface CartHeaderProps {
  itemCount: number;
}

const CartHeader = ({ itemCount }: CartHeaderProps) => {
  return (
    <div className="flex items-center gap-2 p-6 border-b">
      <ShoppingBag className="w-6 h-6" />
      <h2 className="text-xl font-semibold">Your Cart ({itemCount})</h2>
    </div>
  );
};

export default CartHeader;
