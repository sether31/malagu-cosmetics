import { create } from 'zustand'
import { api } from '../api/api';

export interface Category {
  id: string | number;
  name: string;
}

interface CategoryStore {
  categories: Category[];
  isLoading: boolean;
  fetchCategories: () => void;
}

export const useCategoryStore = create<CategoryStore>((set, get) => ({
  categories: [],
  isLoading: false,
  fetchCategories: async () => {
    if (get().categories.length > 0) return;
    set({ isLoading: true })
    try {
      const res = await api.get("/category/get-categories.php");
      
      if (res.data.success) {
        set({ categories: res.data.data, isLoading: false });
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      set({ isLoading: false });
    }
  }
}))
