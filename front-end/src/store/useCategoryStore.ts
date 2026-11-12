import { create } from 'zustand'
import { api } from '../api/api';

export interface Category {
  name: string;
  subCategories?: string[]
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
    const currentCategories = get().categories || [];
    
    if (currentCategories.length > 0) return;

    set({ isLoading: true })
    try {
      const res = await api.get("/category/get-categories.php");
      
      const fetchedData = res?.data?.data || res?.data || [];

      set({ 
        categories: Array.isArray(fetchedData) ? fetchedData : [], 
        isLoading: false 
      });
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      set({ categories: [], isLoading: false });
    }
  }
}))
