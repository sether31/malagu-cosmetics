import { create } from "zustand";
import { authService } from "../services/authService";
import { useCart } from "./useCart";
import { userService } from "../services/userService";

interface UserType {
  user_id: number;
  profile_picture: string;
  name: string;
  email: string;
}

interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserType | null;
  setAccessToken: (token: string | null) => void;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
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
        });

        try {
          const userRes = await userService.getUserProfile();
          if (userRes.data.success) {
            set({ user: userRes.data.user });
          }
        } catch (userErr) {
          console.error("Failed to fetch user profile details", userErr);
        }
      }
    } catch(error) {
      set({
        user: null,
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
      set({ user: null, accessToken: null, isAuthenticated: false });
      useCart.getState().clearCart();
    }
  }
}))