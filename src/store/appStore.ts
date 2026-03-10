import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Shop {
  id: string;
  name: string;
  ownerName: string;
  phone: string;
}

interface AppState {
  activeShop: Shop | null;
  setActiveShop: (shop: Shop) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      activeShop: {
        id: 'shop-1',
        name: 'Mama Wanjiku General Shop',
        ownerName: 'Mama Wanjiku',
        phone: '254712345678',
      },
      setActiveShop: (shop) => set({ activeShop: shop }),
    }),
    {
      name: 'duka-erp-storage',
    }
  )
);
