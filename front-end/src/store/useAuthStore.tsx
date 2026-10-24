import { create } from "zustand";
import { authService } from "../services/authService";


interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAccessToken: (token: string | null) => void;
  checkAuth: () => Promise<void>;
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
  }
}))