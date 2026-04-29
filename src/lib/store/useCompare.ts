import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CompareProduct {
  id: string;
  name: string;
  price: number;
  image_url: string;
  category: string;
  wattage?: number;
  slug: string;
  selected_color?: string;
  // Specifications for comparison
  blade_size?: string;
  rpm?: string;
  airflow?: string;
  noise_level?: string;
  warranty_years?: number;
  colors_available?: string[];
  sizes_available?: string[];
}

interface CompareStore {
  products: CompareProduct[];
  addProduct: (product: CompareProduct) => void;
  removeProduct: (productId: string) => void;
  clearCompare: () => void;
  isInCompare: (productId: string) => boolean;
}

export const useCompare = create<CompareStore>()(
  persist(
    (set, get) => ({
      products: [],
      
      addProduct: (product) => {
        const { products } = get();
        if (products.length >= 2) {
          // Replace the second product if we already have two
          set({ products: [products[0], product] });
        } else if (!products.find(p => p.id === product.id)) {
          set({ products: [...products, product] });
        }
      },
      
      removeProduct: (productId) => {
        set({
          products: get().products.filter(p => p.id !== productId)
        });
      },
      
      clearCompare: () => set({ products: [] }),
      
      isInCompare: (productId) => {
        return get().products.some(p => p.id === productId);
      },
    }),
    {
      name: 'compare-storage',
    }
  )
);
