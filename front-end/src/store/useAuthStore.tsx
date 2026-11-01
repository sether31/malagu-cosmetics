import { create } from "zustand";
import { authService } from "../services/authService";
import { useCart } from "./useCart";


interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAccessToken: (token: string | null) => void;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  isAuthenticated: false,
  isLoading: true, 

  setAccessToken: (token) => set({ 
    accessToken: token, 
    isAuthenticated: !!token, 
    isLoading: false 
  }),
  
  checkAuth: async () => {
    try {
      const res = await authService.refreshToken();
      if(res.data.success && res.data.access_token) {
        set({
          accessToken: res.data.access_token,
          isAuthenticated: true,
          isLoading: false
        })
      }
    } catch(error) {
      set({
        accessToken: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  logout: async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Server logout failed:", error);
    } finally {
      set({ accessToken: null, isAuthenticated: false });
      useCart.getState().clearCart();
    }
  }
}))