import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProductProps, ProductVariant } from "../components/ProductCard";

export interface CartItem {
  cartItemId: string; 
  product: ProductProps; 
  selectedVariant: ProductVariant; 
  quantity: number;
}

export interface CartStore {
  cart: CartItem[];
  isLoading: boolean;
  addToCart: (product: ProductProps, variant: ProductVariant, quantity: number) => void;
}


export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],
      isLoading: false,
      addToCart: async (product, variant, quantity) => {
        set({ isLoading: true });
        const currentCart = get().cart;
        const cartItemId = `${product.id}-${variant.id}`;
        const existingItem = currentCart.find((item) => item.cartItemId === cartItemId);

        if(existingItem) {
          set({
            cart: currentCart.map((item) => 
              item.cartItemId === cartItemId
              ? { ...item, quantity: item.quantity + quantity }
              : item
            ),
            isLoading: false
          })
        } else {
          set({
            cart: [
              ...currentCart,
              {
                cartItemId,
                product,
                selectedVariant: variant,
                quantity
              }
            ],
            isLoading: false
          })
        }
      }
    }),
    {
      name: "malagu-cart",
      partialize: (state) => ({ cart: state.cart })
    }
  )
)