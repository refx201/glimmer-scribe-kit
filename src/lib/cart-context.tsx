import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';

// ===================================
// TYPES
// ===================================

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  brandId?: string; // Brand ID for promo code matching
  packageId?: string; // Package ID for promo code matching
  isPackage?: boolean; // Flag to identify if item is a package
  color?: {
    name: string;
    value: string;
  };
  storage?: {
    size: string;
    price: number;
  };
  quantity: number;
  maxStock: number;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
  totalItems: number;
  totalPrice: number;
  totalSavings: number;
}

export type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> & { quantity?: number } }
  | { type: 'REMOVE_ITEM'; payload: { id: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] };

// ===================================
// INITIAL STATE
// ===================================

const initialState: CartState = {
  items: [],
  isOpen: false,
  totalItems: 0,
  totalPrice: 0,
  totalSavings: 0,
};

// ===================================
// CART REDUCER
// ===================================

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { quantity = 1, ...item } = action.payload;
      const existingItemIndex = state.items.findIndex(
        cartItem => 
          cartItem.productId === item.productId &&
          cartItem.color?.name === item.color?.name &&
          cartItem.storage?.size === item.storage?.size
      );

      let newItems: CartItem[];

      if (existingItemIndex >= 0) {
        // Update existing item quantity
        const existingItem = state.items[existingItemIndex];
        const newQuantity = Math.min(
          existingItem.quantity + quantity,
          existingItem.maxStock
        );
        
        newItems = state.items.map((cartItem, index) =>
          index === existingItemIndex
            ? { ...cartItem, quantity: newQuantity }
            : cartItem
        );
      } else {
        // Add new item
        const cartItem: CartItem = {
          ...item,
          id: `${item.productId}-${item.color?.name || 'default'}-${item.storage?.size || 'default'}-${Date.now()}`,
          quantity: Math.min(quantity, item.maxStock),
        };
        newItems = [...state.items, cartItem];
      }

      const totals = calculateTotals(newItems);
      
      return {
        ...state,
        items: newItems,
        ...totals,
      };
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload.id);
      const totals = calculateTotals(newItems);
      
      return {
        ...state,
        items: newItems,
        ...totals,
      };
    }

    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      
      if (quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: { id } });
      }

      const newItems = state.items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.min(quantity, item.maxStock) }
          : item
      );
      
      const totals = calculateTotals(newItems);
      
      return {
        ...state,
        items: newItems,
        ...totals,
      };
    }

    case 'CLEAR_CART': {
      return {
        ...state,
        items: [],
        totalItems: 0,
        totalPrice: 0,
        totalSavings: 0,
      };
    }

    case 'TOGGLE_CART': {
      return {
        ...state,
        isOpen: !state.isOpen,
      };
    }

    case 'OPEN_CART': {
      return {
        ...state,
        isOpen: true,
      };
    }

    case 'CLOSE_CART': {
      return {
        ...state,
        isOpen: false,
      };
    }

    case 'LOAD_CART': {
      const totals = calculateTotals(action.payload);
      return {
        ...state,
        items: action.payload,
        ...totals,
      };
    }

    default:
      return state;
  }
}

// ===================================
// HELPER FUNCTIONS
// ===================================

function calculateTotals(items: CartItem[]) {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalSavings = items.reduce((sum, item) => {
    if (item.originalPrice && item.originalPrice > item.price) {
      return sum + ((item.originalPrice - item.price) * item.quantity);
    }
    return sum;
  }, 0);

  return { totalItems, totalPrice, totalSavings };
}

// ===================================
// CONTEXT
// ===================================

interface CartContextType {
  state: CartState;
  addItem: (item: Omit<CartItem, 'quantity' | 'id'> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  sendWhatsAppOrder: () => void;
  buyNow: (item: Omit<CartItem, 'quantity' | 'id'> & { quantity?: number }) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// ===================================
// CART PROVIDER
// ===================================

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('procell-cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: parsedCart });
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('procell-cart', JSON.stringify(state.items));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [state.items]);

  const addItem = (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' });
  };

  const openCart = () => {
    dispatch({ type: 'OPEN_CART' });
  };

  const closeCart = () => {
    dispatch({ type: 'CLOSE_CART' });
  };

  const sendWhatsAppOrder = () => {
    if (state.items.length === 0) return;

    let message = '🛒 *طلب جديد من procell*\n\n';
    
    state.items.forEach((item, index) => {
      message += `${index + 1}. *${item.name}*\n`;
      if (item.color) {
        message += `   🎨 اللون: ${item.color.name}\n`;
      }
      if (item.storage) {
        message += `   💾 التخزين: ${item.storage.size}\n`;
      }
      message += `   📦 الكمية: ${item.quantity}\n`;
      message += `   💰 السعر: ${(item.price * item.quantity).toLocaleString()} ₪\n\n`;
    });

    message += `💰 *إجمالي المبلغ: ${state.totalPrice.toLocaleString()} ₪*\n`;
    
    if (state.totalSavings > 0) {
      message += `💚 *إجمالي التوفير: ${state.totalSavings.toLocaleString()} ₪*\n`;
    }

    message += '\n📞 يرجى التواصل معي لتأكيد الطلب وترتيب التوصيل.';

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/972598366822?text=${encodedMessage}`, '_blank');
  };

  const buyNow = (item: Omit<CartItem, 'quantity' | 'id'> & { quantity?: number }) => {
    // Add item to cart (addItem expects Omit<CartItem, 'quantity'> so we spread item which has id omitted, but addItem generates id internally)
    const itemToAdd = {
      ...item,
      productId: item.productId,
      name: item.name,
      price: item.price,
      originalPrice: item.originalPrice,
      discount: item.discount,
      image: item.image,
      color: item.color,
      storage: item.storage,
      maxStock: item.maxStock,
    } as Omit<CartItem, 'quantity'>;
    
    addItem({ ...itemToAdd, quantity: item.quantity });
    // Open cart immediately
    openCart();
  };

  const value: CartContextType = {
    state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart,
    openCart,
    closeCart,
    sendWhatsAppOrder,
    buyNow,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

// ===================================
// CUSTOM HOOK
// ===================================

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}