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
  addToCart: (product: ProductProps, variant: ProductVariant, quantity: number) => { success: boolean; message: string };
  updateQuantity: (CartItemId: string, newQuantity: number) => void;
  removeFromCart: (CartItemId: string) => void;
}


export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],
      isLoading: false,
      addToCart: (product, variant, quantity) => {
        set({ isLoading: true });
        const currentCart = get().cart;
        const cartItemId = `${product.id}-${variant.id}`;
        const existingItem = currentCart.find((item) => item.cartItemId === cartItemId);

        if(existingItem) {
          if(existingItem.quantity >= 100) {
            return {
              success: false,
              message: "You've reached the maximum limit of 100 for this item"
            };
          }

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

        return {
          success: true,
          message: "Added to bag successfully!"
        }
      },
      updateQuantity: (cartItemId, newQuantity) => {
        const cart = get().cart;
        set({
          cart: cart.map((item) => (
            item.cartItemId === cartItemId
            ? {...item, quantity: newQuantity}
            : item
          ))
        })
      },
      removeFromCart: (cartItemId) => {
        const cart = get().cart;
        const removeItem = cart.filter((item) => item.cartItemId !== cartItemId);
        set({cart: removeItem})
      }
    }),
    {
      name: "malagu-cart",
      partialize: (state) => ({ cart: state.cart })
    }
  )
)