import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
  category?: string;
  wattage?: number;
  selected_color?: string;
  selected_size?: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string, color?: string, size?: string) => void;
  updateQuantity: (id: string, quantity: number, color?: string, size?: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((i) => 
          i.id === item.id && 
          i.selected_color === item.selected_color && 
          i.selected_size === item.selected_size
        );
        
        if (existingItem) {
          set({
            items: currentItems.map((i) =>
              (i.id === item.id && i.selected_color === item.selected_color && i.selected_size === item.selected_size) 
                ? { ...i, quantity: i.quantity + item.quantity } 
                : i
            ),
          });
        } else {
          set({ items: [...currentItems, item] });
        }
      },
      
      removeItem: (id, color, size) => {
        set({ 
          items: get().items.filter((i) => 
            !(i.id === id && i.selected_color === color && i.selected_size === size)
          ) 
        });
      },
      
      updateQuantity: (id, quantity, color, size) => {
        if (quantity <= 0) {
          get().removeItem(id, color, size);
          return;
        }
        set({
          items: get().items.map((i) =>
            (i.id === id && i.selected_color === color && i.selected_size === size) ? { ...i, quantity } : i
          ),
        });
      },
      
      clearCart: () => set({ items: [] }),
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
    }),
    {
      name: 'taimoor-fans-cart',
    }
  )
);
