import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProductProps, ProductVariant } from "../components/ProductCard";
import { apiPrivate } from "../api/api";
import { useAuthStore } from "./useAuthStore";

export interface CartItem {
  cartItemId: string; 
  product: ProductProps; 
  selectedVariant: ProductVariant; 
  quantity: number;
}

export interface CartStore {
  cart: CartItem[];
  isLoading: boolean;
  addToCart: (product: ProductProps, variant: ProductVariant, quantity: number) => Promise<{ success: boolean, message: string }>;
  updateQuantity: (CartItemId: string, newQuantity: number) => void;
  updateVariant: (cartItemId: string, newVariantId: number) => void;
  removeFromCart: (CartItemId: string) => void;
  checkout: (selectedItems: string[]) => void;
  mergeCart: () => Promise<void>;
  fetchCart: () => Promise<void>;
  clearCart: () => void;
}

const itemTimers: Record<string, NodeJS.Timeout> = {};

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],
      isLoading: false,

      addToCart: async (product, variant, quantity) => {
        set({ isLoading: true });
        const isAuthenticated = useAuthStore.getState().isAuthenticated;

        if(isAuthenticated) {
          try {
            const res = await apiPrivate.post("/cart/add-cart.php", {
              variant_id: variant.id,
              quantity: quantity
            });

            if(res.data.success) {
              await get().fetchCart();
              set({ isLoading: false });
              return {
                success: true,
                message: res.data.message
              }
            }
          } catch (error) {
            set({ isLoading: false });
            return { success: false, message: "Failed to add item to server cart." };
          }
        }

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

      updateQuantity: async (cartItemId, newQuantity) => {
        const isAuthenticated = useAuthStore.getState().isAuthenticated;

        const cart = get().cart;
        set({
          cart: cart.map((item) => (
            item.cartItemId === cartItemId
            ? {...item, quantity: newQuantity}
            : item
          ))
        })

        if(!isAuthenticated) return;

        if (itemTimers[cartItemId]) {
          clearTimeout(itemTimers[cartItemId]);
        }

        itemTimers[cartItemId] = setTimeout(async () => {
          const currentItem = get().cart.find((i) => i.cartItemId === cartItemId);
          const finalQuantity = currentItem ? currentItem.quantity : newQuantity;

          try {
            const res = await apiPrivate.post("/cart/update-cart.php", {
              cart_item_id: cartItemId,
              quantity: finalQuantity
            });

            if(res.data.success) {
              await get().fetchCart();
            }
            return;
          } catch (error) {
            console.error("Failed to update quantity on server:", error);
          } finally {
            delete itemTimers[cartItemId];
          }
        }, 500)
      },

      updateVariant: async (cartItemId, newVariantId) => {
        const cart = get().cart;
        const isAuthenticated = useAuthStore.getState().isAuthenticated;

        const targetItem = cart.find((i) => i.cartItemId === cartItemId);
        if(!targetItem) return;

        const newVariant = targetItem.product.variants.find((v) => v.id === newVariantId);
        if(!newVariant) return;

        const newCartItemId = `${targetItem.product.id}-${newVariantId}`;

        if(cartItemId === newCartItemId) return;

        const existingTargetItem = cart.find((i) => i.cartItemId === newCartItemId);

        if(existingTargetItem) {
          const mergedQuantity = Math.min(existingTargetItem.quantity + targetItem.quantity, 100);

          set({
            cart: cart
              .map((item) => 
                item.cartItemId === newCartItemId
                ? {...item, quantity: mergedQuantity}
                : item
              ).filter((i) => i.cartItemId !== cartItemId)
          });

          if(isAuthenticated) {
            try {
              await apiPrivate.post("/cart/update-variant.php", {
                old_cart_item_id: cartItemId,
                new_cart_item_id: newCartItemId,
                action: "merge",
                quantity: mergedQuantity
              });

              await get().fetchCart();
            } catch (error) {
              console.error("Failed to merge variants on server:", error);
            }
          }
        } else {
          set({
            cart: cart
              .map((item) => 
                item.cartItemId === cartItemId
                ? {...item, cartItemId: newCartItemId, selectedVariant: newVariant}
                : item
              )
          });

          if(isAuthenticated) {
            try {
              await apiPrivate.post("/cart/update-variant.php", {
                old_cart_item_id: cartItemId,
                new_cart_item_id: newCartItemId,
                action: "swap",
                quantity: targetItem.quantity
              });

              await get().fetchCart();
            } catch (error) {
              console.error("Failed to update variant on server:", error);
            }
          }
        }
      },

      removeFromCart: async (cartItemId) => {
        const isAuthenticated = useAuthStore.getState().isAuthenticated;

        const cart = get().cart;
        const removeItem = cart.filter((item) => item.cartItemId !== cartItemId);
        set({cart: removeItem})

        if(!isAuthenticated) return;

        try {
          const res = await apiPrivate.post("/cart/remove-cart.php", {
            cart_item_id: cartItemId
          });

          if(res.data.success) {
            await get().fetchCart()
          }
        } catch (error) {
          console.error("Failed to remove item on server cart:", error);
        }
      },

      checkout: async (selectedItems) => {
        const isAuthenticated = useAuthStore.getState().isAuthenticated;

        if (!selectedItems || selectedItems.length === 0) return;

        set((state) => ({
          cart: state.cart.filter((item) => !selectedItems.includes(item.cartItemId))
        }));

        if (!isAuthenticated) return;

        try {
          const res = await apiPrivate.post("/cart/checkout-cart.php", {
            cart_item_ids: selectedItems
          });

          if (res.data.success) {
            await get().fetchCart(); 
          }
        } catch (error) {
          console.error("Failed to process checkout on server:", error);
          await get().fetchCart();
        }
      },

      mergeCart: async () => {
        const currentCart = get().cart;
        if(currentCart.length === 0) return;

        try {
          await apiPrivate.post("/cart/merge-cart.php", { cart: currentCart });

          get().clearCart();
          await get().fetchCart();
        } catch (error) {
          console.error("Failed to sync guest cart with database:", error);
        }
      },

      fetchCart: async() => {
        try {
          const res = await apiPrivate.get("/cart/get-cart.php");
          if(res.data.success) {
            set({ cart: res.data.cart });
          }
        } catch (error) {
          console.error("Failed to fetch server cart:", error);
        }
      },
      
      clearCart: () => set({ cart: [] })
    }),
    {
      name: "malagu-cart",
      partialize: (state) => ({ cart: state.cart })
    }
  ),
  
)