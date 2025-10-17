
import { Checkbox } from "@/components/ui/checkbox";
import { formatCurrency } from "@/utils/orderHelpers";

interface OrderItemsProps {
  items: any[];
  selectedItems?: string[];
  onToggleItem?: (id: string) => void;
  viewOnly?: boolean;
}

const OrderItems = ({ items, selectedItems = [], onToggleItem, viewOnly = false }: OrderItemsProps) => {
  if (!items || items.length === 0) {
    return <div>No items in this order</div>;
  }

  // Check if this is a new-style order with items array or old-style individual orders
  const hasItemsArray = items[0]?.items && Array.isArray(items[0].items);

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Order Items</h3>
      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
        {hasItemsArray ? (
          // New format: Order with items array
          items[0].items.map((cartItem: any, index: number) => {
            const name = cartItem.name || "Unknown Product";
            const image = cartItem.image || "";
            const quantity = cartItem.quantity || 1;
            const hasDiscount = cartItem.discountPercent && cartItem.discountPercent > 0;
            const originalPrice = cartItem.originalPrice || cartItem.price;
            const priceAfterDiscount = cartItem.price;
            const itemId = `${items[0].id}-${index}`;

            return (
              <div
                key={itemId}
                className="p-4 rounded-lg border bg-white border-gray-200"
              >
                <div className="flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex gap-4 items-center">
                      {image && (
                        <div className="h-12 w-12 shrink-0 rounded overflow-hidden border border-gray-200">
                          <img
                            src={image}
                            alt={name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <h4 className="font-medium">{name}</h4>
                         <div className="text-sm text-muted-foreground space-y-1">
                          <div className="flex gap-2 flex-wrap">
                            {cartItem.color && (
                              <span className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded">
                                <div
                                  className="w-3 h-3 rounded-full border"
                                  style={{ backgroundColor: cartItem.color.value }}
                                />
                                {cartItem.color.name}
                              </span>
                            )}
                            {cartItem.storage && (
                              <span className="bg-blue-100 px-2 py-0.5 rounded">
                                {cartItem.storage.size}
                              </span>
                            )}
                            {hasDiscount && (
                              <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded font-medium">
                                -{cartItem.discountPercent}% OFF
                              </span>
                            )}
                          </div>
                          <div className="flex gap-3 items-center flex-wrap">
                            <span>Quantity: {quantity}</span>
                            {hasDiscount ? (
                              <div className="flex flex-col gap-1">
                                <div className="flex gap-2 items-center">
                                  <span className="text-gray-400 line-through text-xs">
                                    {formatCurrency(originalPrice)} × {quantity}
                                  </span>
                                  <span className="text-green-600 font-bold">
                                    {formatCurrency(priceAfterDiscount)} × {quantity}
                                  </span>
                                </div>
                                <div className="flex gap-2 items-center text-xs">
                                  <span className="text-gray-400 line-through">
                                    Total: {formatCurrency(originalPrice * quantity)}
                                  </span>
                                  <span className="text-green-600 font-bold">
                                    {formatCurrency(priceAfterDiscount * quantity)}
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <span className="text-primary font-medium">
                                {formatCurrency(originalPrice)} × {quantity} = {formatCurrency(originalPrice * quantity)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          // Old format: Individual orders
          items.map((item) => {
            const itemSelected = selectedItems.includes(item.id);
            const name = item.products?.name || item.product_name || "Unknown Product";
            const image = item.products?.image || "";
            const quantity = item.quantity || 1;
            const price = item.total_price || 0;

            return (
              <div
                key={item.id}
                className={`p-4 rounded-lg border ${
                  itemSelected ? "bg-blue-50 border-blue-200" : "bg-white border-gray-200"
                }`}
              >
                <div className="flex items-center gap-4">
                  {!viewOnly && onToggleItem && (
                    <Checkbox
                      checked={itemSelected}
                      onCheckedChange={() => onToggleItem(item.id)}
                      id={`item-${item.id}`}
                      className="h-5 w-5"
                    />
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex gap-4 items-center">
                      {image && (
                        <div className="h-12 w-12 shrink-0 rounded overflow-hidden border border-gray-200">
                          <img
                            src={image}
                            alt={name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <h4 className="font-medium">{name}</h4>
                        <div className="text-sm text-muted-foreground flex gap-2">
                          <span>Quantity: {quantity}</span>
                          <span className="text-primary font-medium">
                            {formatCurrency(price)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default OrderItems;