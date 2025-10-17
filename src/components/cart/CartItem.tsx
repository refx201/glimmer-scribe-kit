import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CartItemProps {
  item: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    color?: {
      name: string;
      value: string;
    };
    type?: string;
    brandId?: string;
  };
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  discountPercentage?: number;
}

const CartItem = ({ item, onUpdateQuantity, onRemove, discountPercentage }: CartItemProps) => {
  const discountedPrice = discountPercentage 
    ? Math.round(item.price * (1 - discountPercentage / 100))
    : item.price;
    
  return (
    <div className="flex gap-3 py-4">
      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-sm mb-1 line-clamp-2">{item.name}</h3>
        {item.color && (
          <div className="flex items-center gap-1.5 mb-1">
            <div 
              className="w-4 h-4 rounded-full border-2 border-gray-300" 
              style={{ backgroundColor: item.color.value }}
            />
            <p className="text-xs text-muted-foreground">{item.color.name}</p>
          </div>
        )}
        <div className="flex items-center gap-2">
          {discountPercentage ? (
            <>
              <p className="text-primary font-semibold text-sm">₪{discountedPrice.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground line-through">₪{item.price.toLocaleString()}</p>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                خصم {discountPercentage}%
              </span>
            </>
          ) : (
            <p className="text-primary font-semibold text-sm">₪{item.price.toLocaleString()}</p>
          )}
        </div>
      </div>
      <div className="flex flex-col items-end justify-between">
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={() => onRemove(item.id)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
        <div className="flex items-center gap-1 border rounded-md">
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7"
            onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
          >
            <Minus className="w-3 h-3" />
          </Button>
          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7"
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
          >
            <Plus className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
